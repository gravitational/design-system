use std::sync::Arc;

use rustc_hash::{FxHashMap, FxHashSet};
use serde::{Deserialize, Serialize};
use swc_atoms::Atom;
use swc_common::{comments::Comments, util::take::Take, SourceMapperDyn, DUMMY_SP};
use swc_ecma_ast::{
  fn_pass, CallExpr, Callee, ClassDecl, Expr, FnDecl, Id, IdentName, ImportDecl, ImportSpecifier,
  JSXAttr, JSXAttrName, JSXAttrOrSpread, JSXAttrValue, JSXElement, JSXElementName,
  ModuleExportName, Pass, Pat, Str, VarDeclarator,
};
use swc_ecma_visit::{Fold, FoldWith, Visit, VisitWith};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct JSXMarkerOptions {
  pub library_name: String,
  pub attribute_name: String,
  pub styled_function_name: String,
}

pub fn jsx_marker<'a, C>(
  options: &'a JSXMarkerOptions,
  cm: Arc<SourceMapperDyn>,
  comments: C,
) -> impl 'a + Pass
where
  C: 'a + Comments + Clone,
{
  fn_pass(move |program| {
    // First pass: check if we should transform
    let mut checker = ShouldWorkChecker {
      should_work: false,
      library_name: &options.library_name,
    };
    program.visit_with(&mut checker);

    if !checker.should_work {
      return;
    }

    // Second pass: apply transformations
    program.map_with_mut(|p| {
      let mut pass = JSXMarkerTransformer::new(
        &options.library_name,
        &options.attribute_name,
        &options.styled_function_name,
        cm.clone(),
        comments.clone(),
      );

      p.fold_with(&mut pass)
    });
  })
}

struct ShouldWorkChecker<'a> {
  should_work: bool,
  library_name: &'a str,
}

impl<'a> Visit for ShouldWorkChecker<'a> {
  fn visit_import_decl(&mut self, import: &ImportDecl) {
    if import.src.value == *self.library_name {
      self.should_work = true;
    }
  }
}

struct JSXMarkerTransformer<'a, C: Comments> {
  library_name: &'a str,
  attribute_name: &'a str,
  styled_function_name: &'a str,
  #[allow(unused)]
  cm: Arc<SourceMapperDyn>,
  #[allow(unused)]
  comments: C,

  // Track imported components from the design system library (for styled() references)
  imported_components: FxHashSet<Id>,

  // Track styled function if imported from the configured library
  styled_function: Option<Id>,

  // Track styled components created with styled() from the configured library
  styled_components: FxHashMap<Id, Vec<String>>, // maps styled component ID to chain of component names

  // Current component context for naming
  current_component: Option<String>,
}

impl<'a, C: Comments> JSXMarkerTransformer<'a, C> {
  fn new(
    library_name: &'a str,
    attribute_name: &'a str,
    styled_function_name: &'a str,
    cm: Arc<SourceMapperDyn>,
    comments: C,
  ) -> Self {
    JSXMarkerTransformer {
      library_name,
      attribute_name,
      styled_function_name,
      cm,
      comments,
      imported_components: FxHashSet::default(),
      styled_function: None,
      styled_components: FxHashMap::default(),
      current_component: None,
    }
  }

  fn create_data_name(&self, component_name: &str) -> String {
    let prefix = if let Some(comp) = &self.current_component {
      comp.clone()
    } else {
      "Component".to_string()
    };

    format!("{}-{}", prefix, component_name)
  }

  fn add_data_name_attr(&self, attrs: &mut Vec<JSXAttrOrSpread>, component_name: &str) {
    // Check if the attribute already exists
    let has_attr = attrs.iter().any(|attr| {
      if let JSXAttrOrSpread::JSXAttr(JSXAttr {
        name: JSXAttrName::Ident(i),
        ..
      }) = attr
      {
        i.sym == self.attribute_name
      } else {
        false
      }
    });

    if !has_attr {
      let data_name = self.create_data_name(component_name);
      attrs.push(JSXAttrOrSpread::JSXAttr(JSXAttr {
        span: DUMMY_SP,
        name: JSXAttrName::Ident(IdentName::new(Atom::from(self.attribute_name), DUMMY_SP)),
        value: Some(JSXAttrValue::Str(Str {
          span: DUMMY_SP,
          value: data_name.into(),
          raw: None,
        })),
      }));
    }
  }

  fn handle_import(&mut self, import: &ImportDecl) {
    // Only process imports from the configured library
    if import.src.value != self.library_name {
      return;
    }

    for specifier in &import.specifiers {
      match specifier {
        ImportSpecifier::Named(named) => {
          let local_name = &named.local;
          let imported_name = match &named.imported {
            Some(ModuleExportName::Ident(i)) => &i.sym,
            Some(ModuleExportName::Str(s)) => s.value.as_str().expect("non-utf8 export name"),
            None => &local_name.sym,
          };

          if imported_name == self.styled_function_name {
            self.styled_function = Some(local_name.to_id());
          } else {
            // Track other components for potential use with styled()
            self.imported_components.insert(local_name.to_id());
          }
        }
        ImportSpecifier::Default(_) => {
          // Ignore default exports - we only care about named styled function from configured library
        }
        ImportSpecifier::Namespace(_) => {
          // Handle namespace imports if needed
        }
      }
    }
  }

  fn handle_styled_component(&mut self, var: &VarDeclarator) {
    if let Pat::Ident(ident) = &var.name {
      let new_component_name = ident.id.sym.to_string();

      if let Some(init) = &var.init {
        // Check for styled(Component) or styled.div patterns
        if let Expr::Call(call) = init.as_ref() {
          if self.is_styled_call(call) {
            // Extract the component being styled
            if let Some(component_chain) = self.extract_styled_component_chain(call) {
              let mut full_chain = vec![new_component_name];
              full_chain.extend(component_chain);
              self.styled_components.insert(ident.id.to_id(), full_chain);
            }
          }
        } else if let Expr::TaggedTpl(tagged) = init.as_ref() {
          // Handle styled(Component)`` or styled.div``
          if let Expr::Call(call) = tagged.tag.as_ref() {
            if self.is_styled_call(call) {
              if let Some(component_chain) = self.extract_styled_component_chain(call) {
                let mut full_chain = vec![new_component_name];
                full_chain.extend(component_chain);
                self.styled_components.insert(ident.id.to_id(), full_chain);
              }
            }
          } else if let Expr::Member(member) = tagged.tag.as_ref() {
            if let Expr::Ident(obj) = member.obj.as_ref() {
              if Some(obj.to_id()) == self.styled_function {
                if let Some(prop_name) = member.prop.as_ident() {
                  self.styled_components.insert(
                    ident.id.to_id(),
                    vec![new_component_name, prop_name.sym.to_string()],
                  );
                }
              }
            }
          }
        }
      }
    }
  }

  fn is_styled_call(&self, call: &CallExpr) -> bool {
    if let Callee::Expr(expr) = &call.callee {
      match expr.as_ref() {
        Expr::Ident(i) => Some(i.to_id()) == self.styled_function,
        Expr::Member(member) => {
          if let Expr::Ident(obj) = member.obj.as_ref() {
            Some(obj.to_id()) == self.styled_function
          } else {
            false
          }
        }
        _ => false,
      }
    } else {
      false
    }
  }

  fn extract_styled_component_chain(&self, call: &CallExpr) -> Option<Vec<String>> {
    if let Callee::Expr(expr) = &call.callee {
      match expr.as_ref() {
        Expr::Ident(_) => {
          // styled(Component) pattern
          if let Some(first_arg) = call.args.first() {
            if let Expr::Ident(component) = first_arg.expr.as_ref() {
              let component_id = component.to_id();

              // Check if it's a styled component (has a chain)
              if let Some(chain) = self.styled_components.get(&component_id) {
                return Some(chain.clone());
              }

              // Check if it's an imported component
              if self.imported_components.contains(&component_id) {
                return Some(vec![component.sym.to_string()]);
              }
            }
          }
        }
        Expr::Member(member) => {
          // styled.div pattern
          if let Some(prop) = member.prop.as_ident() {
            return Some(vec![prop.sym.to_string()]);
          }
        }
        _ => {}
      }
    }
    None
  }
}

impl<'a, C: Comments> Fold for JSXMarkerTransformer<'a, C> {
  fn fold_class_decl(&mut self, class: ClassDecl) -> ClassDecl {
    let old_component = self.current_component.clone();
    self.current_component = Some(class.ident.sym.to_string());
    let result = class.fold_children_with(self);
    self.current_component = old_component;
    result
  }

  fn fold_fn_decl(&mut self, func: FnDecl) -> FnDecl {
    let old_component = self.current_component.clone();
    self.current_component = Some(func.ident.sym.to_string());
    let result = func.fold_children_with(self);
    self.current_component = old_component;
    result
  }

  fn fold_import_decl(&mut self, import: ImportDecl) -> ImportDecl {
    self.handle_import(&import);
    import
  }

  fn fold_jsx_element(&mut self, mut elem: JSXElement) -> JSXElement {
    // Check if this element is one of our tracked components
    if let JSXElementName::Ident(ident) = &elem.opening.name {
      let id = ident.to_id();

      // Check if it's an imported component from the configured library
      if self.imported_components.contains(&id) {
        self.add_data_name_attr(&mut elem.opening.attrs, &ident.sym);
      }
      // Check if it's a styled component created with styled() from the configured library
      else if let Some(component_chain) = self.styled_components.get(&id) {
        // Limit the chain to maximum 2 layers (excluding the component name prefix)
        // Take at most 2 elements from the chain
        let limited_chain: Vec<_> = component_chain.iter().take(2).cloned().collect();
        let full_name = limited_chain.join("-");
        self.add_data_name_attr(&mut elem.opening.attrs, &full_name);
      }
    }

    elem.fold_children_with(self)
  }

  fn fold_var_declarator(&mut self, var: VarDeclarator) -> VarDeclarator {
    self.handle_styled_component(&var);
    var.fold_children_with(self)
  }
}

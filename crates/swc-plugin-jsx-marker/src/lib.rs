#![allow(clippy::not_unsafe_ptr_arg_deref)]

use jsx_marker::JSXMarkerOptions;
use serde::Deserialize;
use swc_ecma_ast::Program;
use swc_plugin_macro::plugin_transform;
use swc_plugin_proxy::TransformPluginProgramMetadata;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct JSXMarkerPluginOptions {
  library_name: Option<String>,
  attribute_name: Option<String>,
  styled_function: Option<String>,
}

impl JSXMarkerPluginOptions {
  fn into_jsx_marker_options(self) -> JSXMarkerOptions {
    JSXMarkerOptions {
      library_name: self
        .library_name
        .unwrap_or_else(|| "@chakra-ui/react".to_string()),
      attribute_name: self
        .attribute_name
        .unwrap_or_else(|| "data-uic".to_string()),
      styled_function_name: self
        .styled_functiong
        .unwrap_or_else(|| "chakra".to_string()),
    }
  }
}

#[plugin_transform]
pub fn process_transform(program: Program, data: TransformPluginProgramMetadata) -> Program {
  let config = serde_json::from_str::<JSXMarkerPluginOptions>(
    &data
      .get_transform_plugin_config()
      .expect("failed to get plugin config for JSX marker"),
  )
  .expect("invalid config for JSX marker");

  let config = config.into_jsx_marker_options();

  let source_map = std::sync::Arc::new(data.source_map);

  program.apply(jsx_marker::jsx_marker(&config, source_map, data.comments))
}

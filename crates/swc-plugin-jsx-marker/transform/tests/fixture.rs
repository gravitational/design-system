use std::path::PathBuf;

use jsx_marker::JSXMarkerOptions;
use swc_atoms::Atom;
use swc_ecma_parser::{Syntax, TsSyntax};
use swc_ecma_transforms_testing::test_fixture;
use testing::fixture;

fn ts_syntax() -> Syntax {
  Syntax::Typescript(TsSyntax {
    tsx: true,
    ..Default::default()
  })
}

#[fixture("tests/fixture/**/input.tsx")]
fn jsx_marker_fixture(input: PathBuf) {
  let output = input.parent().unwrap().join("output.tsx");

  let options = JSXMarkerOptions {
    library_name: "@chakra-ui/react".to_owned(),
    attribute_name: "data-uic".to_owned(),
    styled_function_name: "chakra".to_owned(),
  };

  test_fixture(
    ts_syntax(),
    &|tr| jsx_marker::jsx_marker(&options, tr.cm.clone(), tr.comments.as_ref().clone()),
    &input,
    &output,
    Default::default(),
  );
}

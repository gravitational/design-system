#![allow(clippy::not_unsafe_ptr_arg_deref)]

use styled_components::Config;
use swc_common::{SourceMapper, Spanned};
use swc_core::{
  ecma::ast::Program,
  plugin::{
    metadata::TransformPluginMetadataContextKind,
    plugin_transform,
    proxies::{PluginCommentsProxy, TransformPluginProgramMetadata},
  },
};

#[plugin_transform]
fn styled_components(mut program: Program, data: TransformPluginProgramMetadata) -> Program {
  let config = match data.get_transform_plugin_config() {
    Some(s) if !s.is_empty() => {
      serde_json::from_str::<Config>(&s).unwrap_or_else(|_| Config::default())
    }
    _ => Config::default(),
  };

  let file_name = data.get_context(&TransformPluginMetadataContextKind::Filename);

  let pos = data.source_map.lookup_char_pos(program.span().lo);
  let hash = pos.file.src_hash;

  program.mutate(styled_components::styled_components(
    file_name.as_deref(),
    hash,
    &config,
    PluginCommentsProxy,
  ));

  program
}

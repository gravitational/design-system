#!/usr/bin/env bash

set -e

rm -rf dist
mkdir -p dist

cargo build --release -p swc_plugin_styled_components --target wasm32-wasip1
cp ../../target/wasm32-wasip1/release/swc_plugin_styled_components.wasm dist
jq 'del(.publishConfig)' package.json > dist/package.json
cp README.md dist
cd dist && pnpm pack --out package.tgz

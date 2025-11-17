#!/usr/bin/env bash

set -e

rm -rf dist
mkdir -p dist

cargo build --release -p swc_plugin_jsx_marker --target wasm32-wasip1
cp ../../target/wasm32-wasip1/release/swc_plugin_jsx_marker.wasm dist
jq 'del(.publishConfig)' package.json > dist/package.json
cd dist && pnpm pack --out package.tgz

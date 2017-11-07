#!/bin/sh

PACKAGE_VERSION=$(
  cat package.json \
    | grep version \
    | head -1 \
    | awk -F: '{ print $2 }' \
    | sed 's/[\s",]//g' \
    | tr -d '[[:space:]]'
)

mkdir -p dist
node_modules/.bin/uglifyjs src/price-calculator.js \
  --mangle \
  --output "dist/price-calculator-$PACKAGE_VERSION.min.js"

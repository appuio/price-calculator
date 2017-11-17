const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const rimraf = require('rimraf');
const UglifyES = require('uglify-es');
const Sandbox = require('sandbox');
const pkg = require('../package.json');

const DATA_URL =
  'https://vshn-portal-vt-574-flexible-backend.appuioapp.ch' +
  '/openshift/products/appuio%20public/_flexible-prices.js';

const PROJECT_ROOT = path.join(__dirname, '..');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');
const DIST_DIR = path.join(PROJECT_ROOT, 'dist');

main().then(null, console.error);

async function main() {
  resetDist();
  const prices = await fetchAppuioPrices();
  assemble(prices);
}

async function fetchAppuioPrices() {
  const res = await fetch(DATA_URL).then(res => res.text());
  const resJsObject = await runJS(res);
  return await runJS(`JSON.stringify(${resJsObject}.prices)`);
}

function assemble(data) {
  let source = fs
    .readFileSync(path.join(SRC_DIR, 'price-calculator.js'))
    .toString();

  source = source.replace('/* DATA_PLACEHOLDER */ {}', `JSON.parse(${data})`);

  const code = source;
  //const { code } = UglifyES.minify(source, {
  //  mangle: true
  //});

  fs.writeFileSync(
    path.join(DIST_DIR, `price-calculator-${pkg.version}.min.js`),
    code
  );
}

function resetDist() {
  rimraf.sync(DIST_DIR);
  fs.mkdirSync(DIST_DIR);
}

function runJS(src) {
  return new Promise(resolve => {
    sandbox = new Sandbox();

    sandbox.run(src, ({ result }) => resolve(result));
  });
}

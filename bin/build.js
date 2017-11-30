const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
const rimraf = require('rimraf');
const UglifyES = require('uglify-es');
const Sandbox = require('sandbox');
const pkg = require('../package.json');

const DATA_SOURCES = [
  {
    key: 'appuio',
    url:
      'https://control.vshn.net' +
      '/openshift/products/appuio%20public/_flexible-prices.js'
  },
  {
    key: 'aws',
    url:
      'https://control.vshn.net' +
      '/openshift/products/appuio%20public/_flexible-prices.js'
  }
];

const PROJECT_ROOT = path.join(__dirname, '..');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');
const DIST_DIR = path.join(PROJECT_ROOT, 'dist');

main().then(null, console.error);

async function main() {
  resetDist();
  const prices = await fetchPrices();
  assemble(prices);
}

async function fetchPrices() {
  const sourcesPrices = await Promise.all(
    DATA_SOURCES.map(async src => {
      const sourcePrices = await fetchSourcePrices(src.url);
      return [src.key, JSON.parse(sourcePrices.slice(1, -1))];
    })
  );

  return sourcesPrices.reduce((prices, [key, sourcePrices]) => {
    prices[key] = sourcePrices;
    return prices;
  }, {});
}

async function fetchSourcePrices(url) {
  const res = await fetch(url).then(res => res.text());
  const resJsObject = await runJS(res);
  return await runJS(`JSON.stringify(${resJsObject}.prices)`);
}

function assemble(data) {
  let source = fs
    .readFileSync(path.join(SRC_DIR, 'price-calculator.js'))
    .toString();

  source = source.replace(
    '/* DATA_PLACEHOLDER */ {}',
    `JSON.parse('${JSON.stringify(data)}')`
  );

  const { code } = UglifyES.minify(source, {
    mangle: true
  });

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

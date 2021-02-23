/* eslint-disable import/no-commonjs */
/* eslint-env es6 */

const cleanup = require('rollup-plugin-cleanup');
const json = require('@rollup/plugin-json');
const resolve = require('@rollup/plugin-node-resolve').default;
const pkg = require('./package.json');

const inputJS = 'src/delegate.js';

const banner = `/*!
 * frcv.js v${pkg.version} Lukas Danckwerth
 */`;

module.exports = [
  // UMD builds
  // frcv.js
  {
    input: inputJS,
    plugins: [
      json(),
      resolve(),
      cleanup({
        sourcemap: true
      })
    ],
    output: {
      sourcemap: true,
      name: 'frcv',
      file: 'public/js/frcv.js',
      banner,
      format: 'umd',
      indent: false,
    },
  }
];

/* eslint-disable import/no-commonjs */
/* eslint-env es6 */

const cleanup = require('rollup-plugin-cleanup');
const json = require('@rollup/plugin-json');
const resolve = require('@rollup/plugin-node-resolve').default;
const terser = require('rollup-plugin-terser').terser;
const pkg = require('./package.json');

const inputJS = 'src/delegate.js';

const banner = `/*!
 * frcv.js v${pkg.version}
 * ${pkg.homepage}
 * (c) ${(new Date(process.env.SOURCE_DATE_EPOCH ? (process.env.SOURCE_DATE_EPOCH * 1000) : new Date().getTime())).getFullYear()} frcv.js Lukas Danckwerth
 * Released under the MIT License
 */`;

module.exports = [
  // UMD builds
  // dist/frcv.min.js
  // dist/frcv.js
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
  },
  {
    input: inputJS,
    plugins: [
      json(),
      resolve(),
      terser({
        output: {
          preamble: banner
        }
      })
    ],
    output: {
      sourcemap: true,
      name: 'frcv',
      file: 'public/js/frcv.min.js',
      format: 'umd',
      indent: false,
    },
  }
];

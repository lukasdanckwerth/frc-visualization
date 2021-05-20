/* eslint-disable import/no-commonjs */

const cleanup = require('rollup-plugin-cleanup');
const json = require('@rollup/plugin-json');
const resolve = require('@rollup/plugin-node-resolve').default;
const pkg = require('./package.json');
const banner = `/*!
 * frc.js v${pkg.version} Lukas Danckwerth
 */`;

module.exports = [
  // UMD builds
  // frcv.js
  {
    input: 'src/index.js',
    plugins: [
      json(),
      resolve(),
      cleanup({
        sourcemap: true
      })
    ],
    output: {
      sourcemap: true,
      name: 'frc',
      file: 'public/js/frc.js',
      banner,
      format: 'umd',
      indent: false,
    }
  }
];

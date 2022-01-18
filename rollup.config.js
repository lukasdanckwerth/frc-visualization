const resolve = require("@rollup/plugin-node-resolve").default;
const pkg = require("./package.json");
const banner = `/*!
 * frc.js v${pkg.version} Lukas Danckwerth
 */`;

module.exports = [
  // UMD builds
  {
    input: "src/index.js",
    plugins: [
      // Allow node_modules resolution, so d3 can be used
      // inside the resulting module.
      resolve(),
    ],
    output: {
      name: "frc",
      file: "public/js/lib/frc.js",
      banner,
      format: "umd",
      sourcemap: true,
    },
  },
];

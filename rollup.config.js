const pkg = require("./package.json");
const banner = `/*!
 * frc.js v${pkg.version} Lukas Danckwerth
 */`;

module.exports = [
  // UMD builds
  {
    input: "src/index.js",
    output: {
      sourcemap: true,
      name: "frc",
      file: "public/js/lib/frc.js",
      banner,
      format: "umd",
    },
  },
];

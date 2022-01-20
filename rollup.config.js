import resolve from "@rollup/plugin-node-resolve";
import * as pkg from "./package.json";

const banner = `/*!
 * ${pkg.name} ${pkg.version}
 * Copyright (c) ${new Date(new Date().getTime()).getFullYear()} ${pkg.author}
 * Released under ${pkg.license} License
 */`;

module.exports = [
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

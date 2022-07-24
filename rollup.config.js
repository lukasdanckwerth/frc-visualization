import resolve from "@rollup/plugin-node-resolve";
import * as meta from "./package.json";

const banner = `/*!
 * ${meta.name} ${meta.version}
 * Copyright (c) ${new Date(new Date().getTime()).getFullYear()} ${meta.author}
 * Released under ${meta.license} License
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
    onwarn(message, warn) {
      if (message.code === "CIRCULAR_DEPENDENCY") return;
      warn(message);
    },
  },
];

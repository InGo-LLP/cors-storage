import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";
import uglify from "rollup-plugin-uglify";
import inject from "rollup-plugin-inject";
import babel from "rollup-plugin-babel";

export default {
  input: "src/page.js",
  plugins: [
    nodeResolve({
      module: true,
      main: true
    }),
    commonjs({
      ignoreGlobal: true
    }),
    inject({
      // control which files this plugin applies to
      // with include/exclude
      include: "**/*.js",
      exclude: ["node_modules/pinkie-promise/**", "node_modules/unfetch/**", "node_modules/object-assign/**"],

      Promise: "pinkie-promise",
      fetch: "unfetch",
      "Object.assign": "object-assign"
    }),
    babel({
      presets: [
        [
          "env",
          {
            targets: {
              browsers: ["IE 10"]
            },
            loose: true,
            modules: false
          }
        ]
      ],
      exclude: ["node_modules/**"]
    }),
    uglify()
  ]
};

import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";
import uglify from "rollup-plugin-uglify";
import inject from "rollup-plugin-inject";
import babel from "rollup-plugin-babel";

const POLYFILLS = {
  Promise: "pinkie-promise",
  "Object.assign": "object-assign"
};

const INJECTIONS = Object.entries(POLYFILLS).map(([nativeObj, packageName]) =>
  inject({
    exclude: `./node_modules/${packageName}/**`,
    [nativeObj]: packageName
  })
);

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
    ...INJECTIONS,
    babel({
      exclude: ["node_modules/**"]
    }),
    uglify()
  ]
};

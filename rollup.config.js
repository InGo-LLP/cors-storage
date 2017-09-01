import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";
import uglify from "rollup-plugin-uglify";

export default {
  input: "src/page.js",
  plugins: [
    nodeResolve({
      module: true,
      jsnext: true,
      main: true
    }),
    commonjs({
      ignoreGlobal: true
    }),
    uglify()
  ]
};

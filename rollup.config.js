import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";
import uglify from "rollup-plugin-uglify";

export default {
  entry: "src/page.js",
  plugins: [
    nodeResolve({
      jsnext: true,
      main: true
    }),
    commonjs({
      ignoreGlobal: true
    }),
    uglify()
  ]
};

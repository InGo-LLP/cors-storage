import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";
import uglify from "rollup-plugin-uglify";
import babel from "rollup-plugin-babel";

export default {
  plugins: [
    nodeResolve({
      module: true,
      main: true
    }),
    commonjs({
      ignoreGlobal: true
    }),
    babel({
      exclude: ["node_modules/**"]
    }),
    uglify()
  ]
};

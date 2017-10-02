import babel from "rollup-plugin-babel";

export default {
  input: "src/page.js",
  plugins: [
    babel({
      exclude: ["node_modules/**"]
    })
  ]
};

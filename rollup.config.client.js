import babel from "rollup-plugin-babel";

export default {
  input: "src/page.js",
  plugins: [
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
    })
  ]
};

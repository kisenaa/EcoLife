/** @type {import('@babel/core').TransformOptions} */
module.exports = function (api) {
  api.cache(true)
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "react-native-reanimated/plugin",
        {
          processNestedWorklets: true,
        },
      ],
      ["react-native-paper/babel"],
    ],
  }
}

module.exports = {

  presets: ['@babel/preset-env'],

  plugins: [
    ['babel-plugin-transform-builtin-classes', {
      globals: ['LitElement']
    }],
    ["prismjs", {
      "languages": ["java", "css", "markup"],
      "plugins": ["line-numbers"],
      "theme": "twilight",
      "css": true
  }]
  ]

};
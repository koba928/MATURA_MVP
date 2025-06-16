// postcss.config.js
module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': require('tailwindcss/nesting'), // ←ここ！
    tailwindcss: {},
    autoprefixer: {},
  },
}





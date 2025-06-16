// postcss.config.js
module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': require('tailwindcss/nesting'), // ← 修正ポイント！
    tailwindcss: {},
    autoprefixer: {},
  },
};



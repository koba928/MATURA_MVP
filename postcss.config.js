// postcss.config.js
module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': require('tailwindcss/nesting'), // ← ここが超重要！
    tailwindcss: {},
    autoprefixer: {},
  },
};




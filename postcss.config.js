// postcss.config.js
module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': require('tailwindcss/nesting'), // ← これに修正
    tailwindcss: {},
    autoprefixer: {},
  },
};




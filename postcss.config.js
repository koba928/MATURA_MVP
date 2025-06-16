// postcss.config.js
module.exports = {
  plugins: {
    'tailwindcss/nesting': require('tailwindcss/nesting'), // ←必ず require を使う！
    tailwindcss: {},
    autoprefixer: {},
  },
};




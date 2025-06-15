// postcss.config.js
const tailwindcss = require('@tailwindcss/postcss')({ config: './tailwind.config.js' });

module.exports = {
  plugins: {
    [tailwindcss.name]: tailwindcss,
    autoprefixer: {},
  },
};

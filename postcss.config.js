module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': require('@tailwindcss/nesting'), // ← ここも修正！
    tailwindcss: {},
    autoprefixer: {},
  },
}







// postcss.config.js
module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': 'postcss-nesting', // ← ここ！プラグイン名を文字列で指定
    tailwindcss: {},
    autoprefixer: {},
  },
}








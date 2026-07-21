/**
 * Prettier — 针对 uni-app 微信小程序展示站
 * 目标：统一格式，少打扰业务（Vue SFC / JS / SCSS / JSON / MD）
 */
module.exports = {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'es5',
  bracketSpacing: true,
  arrowParens: 'always',
  endOfLine: 'lf',
  // Vue：script/style 不额外缩进一层，和常见 uni-app 写法一致
  vueIndentScriptAndStyle: false,
  htmlWhitespaceSensitivity: 'css',
  proseWrap: 'preserve',
}

module.exports = {
  bracketSpacing: true,
  endOfLine: 'auto',
  printWidth: 150,
  tabWidth: 2,
  singleQuote: true,
  trailingComma: 'es5',
  semi: false,
  bracketSameLine: true,
  overrides: [
    {
      files: '*.json',
      options: {
        semi: true,
        parser: 'json',
        tabWidth: 2,
        printWidth: 20,
      },
    },
  ],
}

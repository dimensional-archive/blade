module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module"
  },
  extends: [
    "plugin:@typescript-eslint/recommended"
  ],
  rules: {
    "@typescript-eslint/no-var-requires": 0,
    "@typescript-eslint/no-non-null-asserted-optional-chain": 0,
    "@typescript-eslint/no-non-null-assertion": 0,
    "@typescript-eslint/ban-types": 0
  }
}
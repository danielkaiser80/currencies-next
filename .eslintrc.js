module.exports = {
  extends: [
    "react-app",
    "airbnb",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  overrides: [
    {
      files: ["**/*.ts?(x)"],
      rules: {
        "react/jsx-filename-extension": [
          1,
          {
            extensions: [".tsx"],
          },
        ],
        "import/extensions": [
          "error",
          "ignorePackages",
          {
            ts: "never",
            tsx: "never",
          },
        ],
      },
    },
  ],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  rules: {
    "react/function-component-definition": [
      "error",
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ],
    "no-console": ["off"],
    // switch off as we have the immer library with redux; still we don't want this anywhere
    'no-param-reassign': ['off'],
  },
};

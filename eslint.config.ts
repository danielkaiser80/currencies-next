import js from "@eslint/js";
import { configs, plugins } from "eslint-config-airbnb-extended";
import prettier from "eslint-config-prettier";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([".next", "coverage", "next-env.d.ts"]),
  js.configs.recommended,
  plugins.stylistic,
  plugins.importX,
  configs.base.recommended,
  plugins.react,
  plugins.reactA11y,
  plugins.reactHooks,
  plugins.next,
  configs.next.recommended,
  plugins.typescriptEslint,
  configs.base.typescript,
  configs.next.typescript,
  {
    rules: {
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "arrow-function",
          unnamedComponents: "arrow-function",
        },
      ],
      "no-console": "off",
      "react/jsx-props-no-spreading": "off",
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/ban-ts-comment": "error",
      "no-param-reassign": [
        "error",
        { props: true, ignorePropertyModificationsFor: ["draft"] },
      ],
    },
  },
  prettier,
]);

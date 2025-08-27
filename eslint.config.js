import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactRefreshPlugin from "eslint-plugin-react-refresh";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
        React: "readable",
        NodeJS: "readable",
      },
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "@typescript-eslint": typescriptPlugin,
      "react-refresh": reactRefreshPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // React specific rules
      "react/prop-types": 0,
      "react/react-in-jsx-scope": 0,
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      // "react-refresh/only-export-components": ["warn", {allowConstantExport: true}],

      // TypeScript rules
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],

      // General rules
      "no-unused-vars": "off", // TypeScript rule handles this
      "no-undef": "error",
      "no-constant-binary-expression": "error",
      "no-dupe-keys": "error",
      "no-fallthrough": "error",
      "no-useless-catch": "warn",
    },
  },
  {
    ignores: ["node_modules/**", "dist/**", "build/**", "*.config.js", "public/**", "coverage/**"],
  },
];

import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import vueParser from "vue-eslint-parser";

export default [
  // Ignore build and config outputs
  {
    ignores: [
      "dist/**",
      "dist-electron/**",
      "release/**",
      "tailwind.config.js",
      "vite.config.ts",
      "*.config.*",
    ],
  },
  pluginJs.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  // Enable TypeScript rules and parsing for TS and Vue SFCs
  {
    files: ["**/*.ts", "**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",
        extraFileExtensions: [".vue"],
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      // Use TS plugin for unused vars; disable base rules that misreport in TS context
      "no-undef": "off",
      "no-unused-vars": "off",
      "vue/multi-word-component-names": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
];

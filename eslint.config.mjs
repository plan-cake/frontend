import nextPlugin from "@next/eslint-plugin-next";
import prettierPlugin from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";

const eslintConfig = [
  nextPlugin.configs.recommended,
  nextPlugin.configs["core-web-vitals"],

  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },

  eslintConfigPrettier,
];

export default eslintConfig;

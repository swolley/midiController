/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
    root: true,
    extends: [
        "plugin:vue/vue3-essential",
        "eslint:recommended",
        "@vue/eslint-config-typescript/recommended",
        "@vue/eslint-config-prettier",
        "plugin:sonarjs/recommended",
    ],
    plugins: ["sonarjs"],
    rules: {
        "no-console": [
            "warn",
            {
                allow: ["warn", "info", "error"],
            },
        ],
        "prettier/prettier": 2, // Means error
        "sonarjs/no-small-switch": "off",
    },
    env: {
        "vue/setup-compiler-macros": true,
    },
    ignorePatterns: ["commitlint.config.js", "postcss.config.js", "tailwind.config.js"],
    overrides: [
        {
            files: ["cypress/integration/**.spec.{js,ts,jsx,tsx}"],
            extends: ["plugin:cypress/recommended"],
        },
    ],
};

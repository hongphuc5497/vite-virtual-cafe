/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  ignorePatterns: ["!**/.server", "!**/.client", "build/"],

  // Base config
  extends: ["eslint:recommended"],

  overrides: [
    // React
    {
      files: ["**/*.{js,jsx}"],
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      plugins: ["react", "jsx-a11y", "import"],
      extends: [
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:import/recommended",
      ],
      settings: {
        react: {
          version: "detect",
        },
        formComponents: ["Form"],
        linkComponents: [
          { name: "Link", linkAttribute: "to" },
          { name: "NavLink", linkAttribute: "to" },
        ],
        "import/resolver": {
          node: {
            extensions: [".js", ".jsx"],
          },
          alias: {
            map: [["~", "./app"]],
            extensions: [".js", ".jsx"],
          },
        },
        "import/core-modules": ["node:path", "node:stream", "node:url"],
        "import/internal-regex": "^~/",
      },
      rules: {
        "react/prop-types": "off",
      },
    },

    // Node-powered app, config, and test files.
    {
      files: [
        "server.js",
        "vite.config.js",
        "tailwind.config.js",
        "playwright.config.js",
        "tests/**/*.js",
      ],
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
      env: {
        node: true,
      },
    },

    // Node
    {
      files: [".eslintrc.cjs", "server.js"],
      parserOptions: {
        ecmaVersion: 2022,
      },
      env: {
        node: true,
      },
    },
  ],
};

require("eslint-plugin-jsdoc");

module.exports = {
  env: {
    browser: false,
    es2021: true,
    node: true,
    jest: false
  },
  globals: {
    alert: true,
    console: true,
    document: true,
    setInterval: true,
    setTimeout: true,
    clearTimeout: true,
    Image: true,
    navigator: true,
    confirm: true,
    gtag: "readonly"
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:jsx-a11y/recommended",
    "plugin:@next/next/recommended",
    "next/core-web-vitals",
    "plugin:storybook/recommended",
    "plugin:jsdoc/recommended"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: "module"
  },
  plugins: [
    "react",
    "react-hooks",
    "@typescript-eslint",
    "prettier",
    "import",
    "jsx-a11y",
    "jsdoc"
  ],
  rules: {
    "no-console": "error",
    "default-case": "off",
    "no-throw-literal": "error",
    "prefer-promise-reject-errors": "error",
    "react/prop-types": "off",
    "prettier/prettier": "warn",
    "react/react-in-jsx-scope": "off",
    "react/jsx-filename-extension": "off",
    "import/no-unresolved": "error",
    "no-unreachable": "warn",
    "no-useless-constructor": "off",
    "no-unused-vars": "off",
    "array-callback-return": "warn",
    "max-lines": [
      "error",
      {
        max: 350,
        skipBlankLines: true,
        skipComments: true
      }
    ],
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: [
          "jest.setup.ts",
          "**/*.test.tsx",
          "**/*.spec.tsx",
          "**/*.test.ts",
          "**/*.spec.ts",
          "**/*.stories.tsx"
        ]
      }
    ],
    "no-restricted-imports": [
      "warn",
      {
        name: "lodash",
        message: "use specific lodash module, should be `lodash/[module]`"
      },
      {
        name: "date-fns",
        message: "use specific date-fns module, should be `date-fns/[module]`"
      },
      {
        name: "src/styles/theme",
        message: 'use useTheme from "@mui/material/styles"'
      },
      {
        name: "@mui/material",
        importNames: ["useTheme"],
        message: 'use useTheme from "@mui/material/styles"'
      }
    ],
    "jsdoc/require-description": "warn",
    "jsdoc/check-access": 1, // Recommended
    "jsdoc/check-alignment": 1, // Recommended
    "jsdoc/check-examples": 0,
    "jsdoc/check-indentation": 0,
    "jsdoc/check-line-alignment": 0,
    "jsdoc/check-param-names": 1, // Recommended
    "jsdoc/check-property-names": 1, // Recommended
    "jsdoc/check-syntax": 0,
    "jsdoc/check-tag-names": 1, // Recommended
    "jsdoc/check-types": 1, // Recommended
    "jsdoc/check-values": 1, // Recommended
    "jsdoc/empty-tags": 1, // Recommended
    "jsdoc/implements-on-classes": 1, // Recommended
    "jsdoc/informative-docs": 0,
    "jsdoc/match-description": 0,
    "jsdoc/multiline-blocks": 1, // Recommended
    "jsdoc/no-bad-blocks": 0,
    "jsdoc/no-blank-blocks": 0,
    "jsdoc/no-blank-block-descriptions": 0,
    "jsdoc/no-defaults": 0,
    "jsdoc/no-missing-syntax": 0,
    "jsdoc/no-multi-asterisks": 1, // Recommended
    "jsdoc/no-restricted-syntax": 0,
    "jsdoc/no-types": 0,
    "jsdoc/no-undefined-types": 1, // Recommended
    "jsdoc/require-asterisk-prefix": 0,
    "jsdoc/require-description": 0,
    "jsdoc/require-description-complete-sentence": 0,
    "jsdoc/require-example": 0,
    "jsdoc/require-file-overview": 0,
    "jsdoc/require-hyphen-before-param-description": 1,
    "jsdoc/require-jsdoc": 0, // Recommended - disabled because there are too many functions needing to be documented
    "jsdoc/require-param": 1, // Recommended
    "jsdoc/require-param-description": 0, // Recommended - disabled
    "jsdoc/require-param-name": 1, // Recommended
    "jsdoc/require-param-type": 0, // Recommended  - disabled to allow tsDocs style syntax
    "jsdoc/require-property": 1, // Recommended
    "jsdoc/require-property-description": 1, // Recommended
    "jsdoc/require-property-name": 1, // Recommended
    "jsdoc/require-property-type": 1, // Recommended
    "jsdoc/require-returns": 1, // Recommended
    "jsdoc/require-returns-check": 1, // Recommended
    "jsdoc/require-returns-description": 1, // Recommended
    "jsdoc/require-returns-type": 0, // Recommended - disabled to allow tsDocs style syntax
    "jsdoc/require-throws": 1,
    "jsdoc/require-yields": 1, // Recommended
    "jsdoc/require-yields-check": 1, // Recommended
    "jsdoc/sort-tags": [
      1,
      {
        reportIntraTagGroupSpacing: false,
        tagSequence: [{ tags: ["description", "param", "returns", "example", "see"] }]
      }
    ],
    "jsdoc/tag-lines": 0,
    "jsdoc/valid-types": 1 // Recommended
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx", ".storybook/*.ts", ".storybook/*.tsx"],
      parserOptions: {
        project: ["./tsconfig.json"]
      },
      rules: {
        "@typescript-eslint/no-use-before-define": ["warn"],
        "@typescript-eslint/no-namespace": "error",
        "@typescript-eslint/ban-types": "warn",
        "@typescript-eslint/ban-ts-comment": "warn",
        "@typescript-eslint/no-useless-constructor": "warn",
        "@typescript-eslint/no-floating-promises": "warn",
        "@typescript-eslint/restrict-template-expressions": ["warn", { allowNumber: true }],
        "@typescript-eslint/no-misused-promises": "warn",
        "@typescript-eslint/promise-function-async": "warn",
        "@typescript-eslint/require-await": "warn",
        "@typescript-eslint/no-unused-vars": [
          "warn",
          {
            ignoreRestSiblings: true,
            varsIgnorePattern: "[iI]gnored|_",
            argsIgnorePattern: "[iI]gnored|_"
          }
        ]
      }
    },
    {
      files: [
        "**/common/components/BivariateSection/BivariateHeatmap.tsx",
        "**/common/components/InvestigateMap/InvestigateMap.tsx",
        "**/common/components/KPI/KPI.stories.tsx",
        "**/common/components/Pdf/DhssLogoSvg.tsx",
        "**/common/components/Pdf/MhcLogoSvg.tsx",
        "**/common/components/charts/StackedColumnChart.stories.tsx",
        "**/modules/Resources/indicator-browser/components/KpiBrowser.tsx",
        "**/hospitalizations.tsx",
        "**/positive-cases.tsx",
        "**/vaccinations.tsx",
        "**/pages/portals/stories/naloxone.tsx"
      ],
      rules: { "max-lines": "off" }
    },
    {
      // or whatever matches stories specified in .storybook/main.js
      files: ["*.stories.@(ts|tsx|js|jsx|mjs|cjs)"],
      rules: {
        // example of overriding a rule
        "storybook/hierarchy-separator": "error",
        // example of disabling a rule
        "storybook/default-exports": "off"
      }
    }
  ],
  settings: {
    react: {
      version: "detect" // Tells eslint-plugin-react to automatically detect the version of React to use
    },
    "import/resolver": {
      // use <root>/tsconfig.json
      typescript: {
        project: "."
      }
    }
  }
};

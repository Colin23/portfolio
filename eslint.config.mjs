import prettier from "eslint-config-prettier";
import { fileURLToPath } from "node:url";
import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import svelte from "eslint-plugin-svelte";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tslint from "typescript-eslint";
import svelteConfig from "./svelte.config.js";
import jsdocPlugin from "eslint-plugin-jsdoc";

const gitignorePath = fileURLToPath(new URL("./.gitignore", import.meta.url));

export default defineConfig(
    includeIgnoreFile(gitignorePath),
    {
        ignores: ["build/", ".svelte-kit/", "node_modules/"]
    },
    js.configs.recommended,
    ...svelte.configs.recommended,
    prettier,
    ...svelte.configs.prettier,

    {
        languageOptions: {
            globals: { ...globals.browser, ...globals.node }
        },

        plugins: {
            jsdoc: jsdocPlugin
        },

        rules: {
            "jsdoc/require-jsdoc": "error",

            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/no-explicit-any": "off",

            "no-undef": "off",
            "svelte/no-navigation-without-resolve": "off",

            "array-callback-return": "warn",
            "no-await-in-loop": "warn",
            "no-constructor-return": "warn",
            "no-duplicate-imports": "error",
            "no-inner-declarations": "warn",
            "no-promise-executor-return": "error",
            "no-self-compare": "error",
            "no-template-curly-in-string": "warn",
            "no-unreachable-loop": "warn",
            "no-use-before-define": ["error", { functions: false }],
            "no-useless-assignment": "warn",
            "require-atomic-updates": "error",

            "block-scoped-var": "error",
            "camelcase": "error",
            "default-case": "error",
            "default-case-last": "error",
            "eqeqeq": "error",
            "max-depth": "warn",
            "max-lines": ["warn", 900],
            "max-nested-callbacks": ["warn", 5],
            "new-cap": "error",
            "no-eq-null": "error",
            "no-implicit-globals": "warn",
            "no-invalid-this": "error",
            "no-lone-blocks": "warn",
            "no-loop-func": "warn",
            "no-nested-ternary": "warn",
            "no-new": "warn",
            "no-new-func": "warn",
            "no-new-wrappers": "warn",
            "no-object-constructor": "warn",
            "no-octal-escape": "warn",
            "no-param-reassign": "error",
            "no-sequences": "warn",
            "no-throw-literal": "warn",
            "no-undef-init": "warn",
            "no-unused-expressions": "warn",
            "no-var": "warn",
            "no-void": "warn",
            "prefer-const": "warn",
            "require-await": "warn"
        }
    },

    ...tslint.configs.strict.map(config => ({
        ...config,
        files: ["**/*.ts", "**/*.tsx"]
    })),

    {
        files: ["**/*.ts", "**/*.tsx"],
        rules: {
            "@typescript-eslint/explicit-function-return-type": ["error", { allowExpressions: true }],
            "@typescript-eslint/no-explicit-any": "error"
        }
    },

    {
        files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],
        languageOptions: {
            parserOptions: {
                projectService: true,
                extraFileExtensions: [".svelte"],
                parser: tslint.parser,
                svelteConfig
            }
        }
    }
);

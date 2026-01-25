import prettier from "eslint-config-prettier";
import { fileURLToPath } from "node:url";
import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import svelte from "eslint-plugin-svelte";
import { defineConfig } from "eslint/config";
import globals from "globals";
import ts from "typescript-eslint";
import svelteConfig from "./svelte.config.js";

const gitignorePath = fileURLToPath(new URL("./.gitignore", import.meta.url));

export default defineConfig(
    includeIgnoreFile(gitignorePath),
    {
        ignores: ["build/", ".svelte-kit/", "node_modules/"]
    },
    js.configs.recommended,
    ...ts.configs.recommended,
    ...svelte.configs.recommended,
    prettier,
    ...svelte.configs.prettier,
    {
        languageOptions: { globals: { ...globals.browser, ...globals.node } },

        rules: {
            // typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
            // see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
            "no-undef": "off",
            "svelte/no-navigation-without-resolve": "off",

            // Default rules, see https://eslint.org/docs/latest/rules/#possible-problems
            // These rules are overridden. They were deactivated per default.
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

            // Suggested additional rules, see https://eslint.org/docs/latest/rules/#suggestions
            // They were all deactivated per default.
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
    {
        files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],

        languageOptions: {
            parserOptions: {
                projectService: true,
                extraFileExtensions: [".svelte"],
                parser: ts.parser,
                svelteConfig
            }
        }
    }
);

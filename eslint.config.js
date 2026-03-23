import eslintPluginSvelte from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import eslintPluginPrettier from 'eslint-plugin-prettier';

const svelteConfigs = eslintPluginSvelte.configs;

export default [
	...(svelteConfigs['flat/recommended'] || svelteConfigs.recommended),
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: tsParser
			}
		},
		rules: {
			'svelte/no-at-html-tags': 'off',
			'svelte/require-valid-properties': 'off',
			'a11y-invalid-attribute': 'off',
			'svelte/require-each-key': 'off',
			'svelte/no-navigation-without-resolve': 'off',
			'svelte/require-event-dispatcher-types': 'off'
		}
	},
	{
		files: ['**/*.ts'],
		ignores: ['playwright.config.ts'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: './tsconfig.json'
			}
		},
		plugins: {
			'@typescript-eslint': tsPlugin
		},
		rules: {
			...tsPlugin.configs.recommended.rules,
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
			],
			'@typescript-eslint/no-explicit-any': 'warn',
			'no-unused-vars': 'off'
		}
	},
	{
		files: ['**/*.js', '**/*.ts', '**/*.svelte'],
		plugins: {
			prettier: eslintPluginPrettier
		},
		rules: {
			'prettier/prettier': 'error'
		}
	},
	{
		ignores: [
			'node_modules/**',
			'.svelte-kit/**',
			'build/**',
			'.output/**',
			'static/**',
			'*.min.js',
			'dist/**'
		]
	}
];

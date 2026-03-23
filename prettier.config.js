import pluginSvelte from 'prettier-plugin-svelte';

export default {
	printWidth: 100,
	singleQuote: true,
	trailingComma: 'none',
	tabWidth: 4,
	useTabs: true,
	semi: true,
	plugins: [pluginSvelte],
	overrides: [
		{
			files: '*.svelte',
			options: {
				parser: 'svelte'
			}
		}
	]
};

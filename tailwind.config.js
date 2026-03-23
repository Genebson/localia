export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: '#1E3A5F',
					light: '#2D5A8E'
				},
				accent: {
					DEFAULT: '#E8A838',
					hover: '#D4962E'
				},
				surface: '#FFFFFF',
				background: '#F8F9FA',
				border: '#E5E7EB'
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
			}
		}
	},
	plugins: []
};

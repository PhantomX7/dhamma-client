// import containerQueries from '@tailwindcss/container-queries';
// import forms from '@tailwindcss/forms';
// import typography from '@tailwindcss/typography';
import flowbitePlugin from 'flowbite/plugin';

/** @type {import('tailwindcss').Config} */
export default {
	corePlugins: {
		// preflight: false
	},
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte-icons/**/*.{html,js,svelte,ts}'
	],

	theme: {
		extend: {
			spacing: {
				0.5: '0.125rem', // 2px
				1.5: '0.375rem', // 6px
				2.5: '0.625rem', // 10px
				3.5: '0.875rem' // 14px
			},
			colors: {
				primary: {
					50: '#f0f4fe',
					100: '#dde6fc',
					200: '#c2d4fb',
					300: '#98b9f8',
					400: '#6894f2',
					500: '#537aee',
					600: '#2f50e1',
					700: '#263ccf',
					800: '#2533a8',
					900: '#233085',
					950: '#1a2051',
					DEFAULT: '#98b9f8'
				},
				red: {
					50: '#fef2f2',
					100: '#fee2e2',
					200: '#fecaca',
					300: '#fca5a5',
					400: '#f87171',
					500: '#ef4444',
					600: '#dc2626',
					700: '#b91c1c',
					800: '#991b1b',
					900: '#7f1d1d'
				}
			}
		},
		container: {
			center: true,
			padding: '2rem'
		}
	},

	// plugins: [ typography, forms, containerQueries]
	plugins: [flowbitePlugin]
};

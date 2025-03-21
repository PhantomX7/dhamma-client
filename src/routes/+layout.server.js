import api from '$lib/api';

import { loadFlash } from 'sveltekit-flash-message/server';

export const load = loadFlash(async (event) => {
	let { locals } = event;
	let user = null;
	if (locals.token) {
		try {
			const response = await api.fetch('auth/me', {}, event);
			const { data } = await response.json();
			user = data;
		} catch (error) {
			// Handle connection errors
			if (error.cause.code === 'ECONNREFUSED') {
				return {
					error: true,
					errorType: 'connection',
					errorMessage: 'Unable to connect to the server. Please check your connection.'
				};
			}

			return {
				error: true,
				errorType: 'unknown',
				errorMessage: 'An unexpected error occurred'
			};
		}
	}

	return {
		tenant: locals.tenant,
		isAuthenticated: !!locals.token,
		user
	};
});

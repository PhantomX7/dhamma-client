import api from '$lib/api';
import { loadFlash } from 'sveltekit-flash-message/server';
import { runPromise } from '$lib/utils';

export const load = loadFlash(async (event) => {
	let { locals } = event;
	let user = null;
	if (locals.token) {
		const [response, fetchError] = await runPromise(api.fetch('auth/me', {}, event));
		
		if (fetchError) {
			// Handle connection errors
			if (fetchError.cause?.code === 'ECONNREFUSED') {
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
		
		if (response.ok) {
			user = response.data.data;
		}
	}

	return {
		tenant: locals.tenant,
		isAuthenticated: !!locals.token,
		user
	};
});

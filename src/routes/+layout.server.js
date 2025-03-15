import api from '$lib/api';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals }) {
	let user = null;
	if (locals.token) {
		try {
			api.setTenant(locals.tenant);
			const response = await api.fetch('auth/me', {}, locals.token);
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
}

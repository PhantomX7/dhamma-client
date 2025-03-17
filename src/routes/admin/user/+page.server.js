import api from '$lib/api';

export async function load({ locals }) {
	try {
		api.setTenant(locals.tenant);
		const response = await api.fetch('user', {}, locals.token);

		const { data, meta, status, message } = await response.json();

		if (!status) {
			throw new Error(message || 'Failed to fetch users');
		}

		return {
			users: data,
			meta
		};
	} catch (error) {
		console.error('User fetch error:', error);
		return {
			users: [],
			error: 'Failed to load users'
		};
	}
}

import api from '$lib/api';

export async function load(event) {
	try {
		const response = await api.fetch('user', {}, event);

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

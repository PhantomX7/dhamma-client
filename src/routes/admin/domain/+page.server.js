import api from '$lib/api';

export async function load({ locals }) {
	try {
		api.setTenant(locals.tenant);
		const response = await api.fetch('domain', {}, locals.token);

		const { data, meta, status, message } = await response.json();

		if (!status) {
			throw new Error(message || 'Failed to fetch domains');
		}

		return {
			domains: data,
			meta
		};
	} catch (error) {
		console.error('Domain fetch error:', error);
		return {
			domains: [],
			error: 'Failed to load domains'
		};
	}
}

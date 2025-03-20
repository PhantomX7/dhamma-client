import api from '$lib/api';
import { buildApiQuery } from '$lib/utils/filter';
import { redirect } from '@sveltejs/kit';

export async function load(event) {
	await event.parent();

	try {
		const { url } = event;

		const response = await api.fetch(`domain?${buildApiQuery(url)}`, {}, event);
		const { data, meta } = await response.json();

		if (!response.ok) {
			redirect(303, '/admin');
		}

		return {
			domains: data,
			meta
		};
	} catch (error) {
		console.error('Domain fetch error:', error);
		return {
			domains: [],
			meta: null,
			error: 'Failed to load domains'
		};
	}
}

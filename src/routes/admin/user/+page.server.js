import api from '$lib/api';
import { buildApiQuery } from '$lib/utils/filter';
import { redirect } from '@sveltejs/kit';

export async function load(event) {
	await event.parent();

	try {
		const { url } = event;

		const response = await api.fetch(`user?${buildApiQuery(url)}`, {}, event);
		const { data, meta } = await response.json();

		if (!response.ok) {
			throw redirect(303, `/admin`);
		}

		return {
			users: data,
			meta
		};
	} catch (error) {
		console.error('Failed to fetch users:', error);
		return {
			users: [],
			meta: null
		};
	}
}

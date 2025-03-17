import api from '$lib/api';
import { buildApiQuery } from '$lib/utils/filter';

export async function load(event) {
	await event.parent();

	try {
		const { url } = event;

		const response = await api.fetch(`user?${buildApiQuery(url)}`, {}, event);
		const { data, meta } = await response.json();

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

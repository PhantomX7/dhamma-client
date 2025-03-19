import { goto } from '$app/navigation';
import api from '$lib/api';
import { buildApiQuery } from '$lib/utils/filter';

export async function load(event) {
	await event.parent();

	try {
		const { url } = event;

		const response = await api.fetch(`user?${buildApiQuery(url)}`, {}, event);
		const { data, meta } = await response.json();

		if (!response.ok) {
			goto(`/admin`);
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

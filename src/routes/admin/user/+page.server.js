import api from '$lib/api';
import { getPaginationParams } from '$lib/utils/pagination';

export async function load(event) {
	try {
		let { url, locals } = event;
		const pagination = getPaginationParams(url);
		api.setTenant(locals.tenant);

		const response = await api.fetch(
			`user?${new URLSearchParams({
				limit: pagination.limit,
				offset: pagination.offset,
				sort: pagination.sort
			})}`,
			{},
			event
		);

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

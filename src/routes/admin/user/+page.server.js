import api from '$lib/api';
import { buildApiQuery } from '$lib/utils/filter';
import { redirect } from '@sveltejs/kit';
import { runPromise } from '$lib/utils';

export async function load(event) {
	await event.parent();

	const { url } = event;
	const [response, fetchError] = await runPromise(
		api.fetch(`user?${buildApiQuery(url)}`, {}, event)
	);
	
	if (fetchError) {
		console.error('Failed to fetch users:', fetchError);
		return {
			users: [],
			meta: null
		};
	}

	if (!response.ok) {
		throw redirect(303, `/admin`);
	}

	return {
		users: response.data.data,
		meta: response.data.meta
	};
}

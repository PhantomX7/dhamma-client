import api from '$lib/api';
import { buildApiQuery } from '$lib/utils/filter';
import { redirect } from '@sveltejs/kit';
import { runPromise } from '$lib/utils';

export async function load(event) {
	await event.parent();

	const { url } = event;
	const [response, fetchError] = await runPromise(
		api.fetch(`domain?${buildApiQuery(url)}`, {}, event)
	);
	
	if (fetchError) {
		console.error('Domain fetch error:', fetchError);
		return {
			domains: [],
			meta: null,
			error: 'Failed to load domains'
		};
	}

	if (!response.ok) {
		throw redirect(303, '/admin');
	}

	return {
		domains: response.data.data,
		meta: response.data.meta
	};
}

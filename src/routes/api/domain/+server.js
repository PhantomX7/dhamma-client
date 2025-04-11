import { json } from '@sveltejs/kit';
import { buildApiQuery } from '$lib/utils/filter';
import api from '$lib/api';
import { runPromise } from '$lib/utils';

export async function GET(event) {
	let { url } = event;

	const [response, fetchError] = await runPromise(
		api.fetch(`domain?${buildApiQuery(url)}`, {}, event)
	);

	if (fetchError) {
		console.error('Domain fetch error:', fetchError);
		return {
			domains: [],
			error: 'Failed to load domains'
		};
	}

	if (!response.ok) {
		json({
			data: null
		});
	}

	// Return filtered results from your API
	return json({
		data: response.data.data
	});
}

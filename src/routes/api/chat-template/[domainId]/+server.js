import api from '$lib/api';
import { json, error } from '@sveltejs/kit';
import { runPromise } from '$lib/utils';

/**
 * GET handler to fetch the default chat template for a specific domain
 * @param {import('./$types').RequestEvent} event
 */
export async function GET(event) {
	const { params } = event;
	const { domainId } = params;

	if (!domainId) {
		return error(400, 'Domain ID is required');
	}

	// Call API to get default chat template for the domain
	const [response, fetchError] = await runPromise(
		api.get(`chat-template/domain/${domainId}/default`, event)
	);

	if (fetchError) {
		console.error('Error fetching default chat template:', fetchError);
		return error(500, 'Failed to fetch default chat template');
	}

	if (!response.ok) {
		if (response.status === 404) {
			return error(404, 'Default chat template not found for this domain');
		}
		return error(response.status, 'Failed to fetch default chat template');
	}

	return json(response);
}
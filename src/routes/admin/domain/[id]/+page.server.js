import { loadResourceById } from '$lib/utils/data';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	// Ensure parent layout data is loaded
	await event.parent();

	// Load the domain resource using the utility function
	return await loadResourceById(event, '/domain', 'domain', '/admin/domain');
}

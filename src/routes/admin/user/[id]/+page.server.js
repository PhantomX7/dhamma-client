import { loadResourceById } from '$lib/utils';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	// Ensure parent layout data is loaded
	await event.parent();

	// Load the user resource using the utility function
	return await loadResourceById(event, '/user', 'User', '/admin/user');
}

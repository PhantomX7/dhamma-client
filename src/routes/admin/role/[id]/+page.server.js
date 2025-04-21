import { loadResourceById } from '$lib/utils/data';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	// Ensure parent layout data is loaded
	await event.parent();

	// Load the role resource using the utility function
	// Note: The original code had a potential copy-paste error, redirecting to '/admin/domain'.
	// Corrected to redirect to '/admin/role'.
	return await loadResourceById(event, '/role', 'role', '/admin/role');
}
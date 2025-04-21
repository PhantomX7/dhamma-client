import { loadResourceList } from '$lib/utils/data'; // Import the list loading utility

/**
 * Loads a list of roles using the reusable loadResourceList utility.
 * @param {import('./$types').PageServerLoadEvent} event - The SvelteKit load event.
 * @returns {Promise<object>} - An object containing the roles list and metadata.
 */
export async function load(event) {
	await event.parent();

	// Use the utility function to load the list of roles
	const { list: roles, meta } = await loadResourceList(event, 'role', 'roles', '/admin');

	return {
		roles, // Rename 'list' to 'roles' for the page component
		meta
	};
}
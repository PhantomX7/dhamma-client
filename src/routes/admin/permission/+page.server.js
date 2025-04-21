import { loadResourceList } from '$lib/utils/data'; // Import the list loading utility

/**
 * Loads a list of permissions using the reusable loadResourceList utility.
 * @param {import('./$types').PageServerLoadEvent} event - The SvelteKit load event.
 * @returns {Promise<object>} - An object containing the permissions list and metadata.
 */
export async function load(event) {
	await event.parent();

	// Use the utility function to load the list of permissions
	const { list: permissions, meta } = await loadResourceList(event, 'permission', 'permissions', '/admin');

	return {
		permissions, // Rename 'list' to 'permissions' for the page component
		meta
	};
}

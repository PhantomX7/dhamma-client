import { loadResourceList } from '$lib/utils/data';

/**
 * Loads a list of users using the reusable loadResourceList utility.
 * @param {import('./$types').PageServerLoadEvent} event - The SvelteKit load event.
 * @returns {Promise<object>} - An object containing the users list and metadata.
 */
export async function load(event) {
	// Ensure parent layout data is loaded
	await event.parent();

	// Use the utility function to load the list of users
	const { list: users, meta } = await loadResourceList(event, '/user', 'users', '/admin');

	// Return the fetched users and metadata for the page component
	return {
		users, // Rename 'list' to 'users' for clarity in the page component
		meta
	};
}

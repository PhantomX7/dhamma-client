import { loadResourceList } from '$lib/utils/data';

/**
 * Loads a list of followers using the reusable loadResourceList utility.
 * @param {import('./$types').PageServerLoadEvent} event - The SvelteKit load event.
 * @returns {Promise<object>} - An object containing the followers list and metadata.
 */
export async function load(event) {
	await event.parent();

	// Use the utility function to load the list of followers
	const { list: followers, meta } = await loadResourceList(event, 'follower', 'followers', '/admin');

	return {
		followers,
		meta
	};
}
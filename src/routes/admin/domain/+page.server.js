import { loadResourceList } from '$lib/utils/data'; // Import the new utility function

/**
 * Loads a list of domains using the reusable loadResourceList utility.
 * @param {import('./$types').PageServerLoadEvent} event - The SvelteKit load event.
 * @returns {Promise<object>} - An object containing the domains list and metadata.
 */
export async function load(event) {
	await event.parent();

	// Use the new utility function to load the list
	const { list: domains, meta } = await loadResourceList(event, 'domain', 'domains', '/admin');

	return {
		domains, 
		meta
	};
}

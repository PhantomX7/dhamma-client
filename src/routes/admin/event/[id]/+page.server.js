import { loadResourceById } from '$lib/utils/data';

/**
 * Loads a single event resource by its ID.
 * @param {import('./$types').PageServerLoadEvent} event - The SvelteKit load event.
 * @returns {Promise<object>} An object containing the event resource.
 */
export async function load(event) {
	await event.parent();
	// Load the event resource using the utility function
	return await loadResourceById(event, 'event', 'event', '/admin/event');
}
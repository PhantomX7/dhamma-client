import { loadResourceList } from '$lib/utils/data';

/**
 * Loads a list of events using the reusable loadResourceList utility.
 * @param {import('./$types').PageServerLoadEvent} event - The SvelteKit load event.
 * @returns {Promise<object>} - An object containing the events list and metadata.
 */
export async function load(event) {
	await event.parent();

	// Use the utility function to load the list of events
	const { list: events, meta } = await loadResourceList(event, 'event', 'events', '/admin');

	return {
		events,
		meta
	};
}
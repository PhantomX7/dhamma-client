import { loadResourceList, loadResourceById } from '$lib/utils/data';

/**
 * Loads event details and attendance data for the event.
 * @param {import('./$types').PageServerLoadEvent} event - The SvelteKit load event.
 * @returns {Promise<object>} The event data and attendance list.
 */
export async function load(event) {
    await event.parent();

    let eventId = event.params.id;

    const { event: eventDetail } = await loadResourceById(event, 'event', 'event', '/admin/event');

	// Use the utility function to load the list of events
	const { list: attendances, meta } =  await loadResourceList(event, 'event-attendance', 'events', '/admin', `event_id=eq:${eventId}`);

     return {
        event: eventDetail,
		attendances, // Rename 'list' to 'roles' for the page component
		meta
	};

	
}
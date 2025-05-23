import { loadResourceList, loadResourceById } from '$lib/utils/data';

/**
 * Loads follower details and attendance data for the follower.
 * @param {import('./$types').PageServerLoadEvent} event - The SvelteKit load event.
 * @returns {Promise<object>} The follower data and attendance list.
 */
export async function load(event) {
    await event.parent();

    let followerId = event.params.id;

    // Load follower details for display
    const { follower } = await loadResourceById(event, 'follower', 'follower', '/admin/follower');

    // Use the utility function to load the list of attendances for this follower
    const { list: attendances, meta } = await loadResourceList(
        event, 
        'event-attendance', 
        'events', 
        '/admin', 
        `follower_id=eq:${followerId}`
    );

    return {
        follower,
        attendances,
        meta,
    };
}
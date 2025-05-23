import { loadResourceList, loadResourceById } from '$lib/utils/data';

/**
 * Loads follower details and their point mutation history.
 * @param {import('./$types').PageServerLoadEvent} event - The SvelteKit load event.
 * @returns {Promise<object>} The follower data and point mutation list.
 */
export async function load(event) {
    await event.parent(); // Ensures layout data (like current user) is loaded

    const followerId = event.params.id;

    // Load follower details for display and context
    const { resource: follower } = await loadResourceById(
        event,
        'follower', // API resource type
        'follower', // Key for the follower data in the returned object
        `/admin/follower` // Fallback redirect path if follower not found
    );

    // Use the utility function to load the list of point mutations for this follower
    // Assuming the API endpoint for point mutations is '/api/point-mutation'
    // and it can be filtered by 'follower_id'
    const { list: pointMutations, meta } = await loadResourceList(
        event,
        'point-mutation', // API resource name for point mutations
        'pointMutations', // Key for the list in the returned data
        '/admin', // Base path for any potential redirects from loadResourceList
        `follower_id=eq:${followerId}` // Filter to get mutations for the specific follower
    );

    return {
        follower,
        pointMutations,
        meta,
        followerId // Pass followerId for breadcrumbs or links
    };
}
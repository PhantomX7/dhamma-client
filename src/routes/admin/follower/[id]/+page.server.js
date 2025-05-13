import { loadResourceById } from '$lib/utils/data';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	await event.parent();
	// Load the follower resource using the utility function
	return await loadResourceById(event, '/follower', 'follower', '/admin/follower');
}
import { loadResourceById } from '$lib/utils/data';

/**
 * Loads a single chat template resource by its ID.
 * @param {import('./$types').PageServerLoadEvent} event - The SvelteKit load event.
 * @returns {Promise<object>} An object containing the chat template resource.
 */
export async function load(event) {
	await event.parent();
	// Load the chat template resource using the utility function
	return await loadResourceById(event, 'chat-template', 'chatTemplate', '/admin/chat-template');
}
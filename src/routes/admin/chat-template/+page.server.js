import { loadResourceList } from '$lib/utils/data';

/**
 * Loads a list of chat templates using the reusable loadResourceList utility.
 * @param {import('./$types').PageServerLoadEvent} event - The SvelteKit load event.
 * @returns {Promise<object>} - An object containing the chat templates list and metadata.
 */
export async function load(event) {
	await event.parent();

	// Use the utility function to load the list of chat templates
	const { list: chatTemplates, meta } = await loadResourceList(event, 'chat-template', 'chat-templates', '/admin');

	return {
		chatTemplates,
		meta
	};
}
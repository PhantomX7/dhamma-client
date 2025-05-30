import { loadResourceById, updateResourceById } from '$lib/utils/data';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { chatTemplateSchema } from '$lib/schema/chat-template.js';

/**
 * Load function for chat template edit page
 * Loads the existing chat template data and initializes the form
 */
export async function load(event) {
	await event.parent();

	const { chatTemplate } = await loadResourceById(
		event,
		'chat-template',
		'chatTemplate',
		'/admin/chat-template'
	);

	// Initialize form with existing data
	const form = await superValidate(chatTemplate, zod(chatTemplateSchema));

	return {
		chatTemplate,
		form
	};
}

/**
 * Form action for updating chat template
 */
export const actions = {
	default: async (event) => {
		return await updateResourceById(
			event,
			'/chat-template', // Resource path (e.g., /api/event/:id)
			'chat template', // Resource name for messages
			chatTemplateSchema, // Zod schema for validation
			'/admin/chat-template' // Base path for success redirect (to list)
			// Detail page redirect is handled by updateResourceById by appending ID
		);
	}
};

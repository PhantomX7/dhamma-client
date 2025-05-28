import { loadResourceById, updateResource } from '$lib/api/resource';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { chatTemplateSchema } from '$lib/schema/chat-template.js';
import { fail } from '@sveltejs/kit';

/**
 * Load function for chat template edit page
 * Loads the existing chat template data and initializes the form
 */
export async function load({ params, locals }) {
	const { id } = params;

	// Load the existing chat template
	const chatTemplate = await loadResourceById(locals, 'chat-template', id);

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
	default: async ({ request, params, locals }) => {
		const { id } = params;
		const form = await superValidate(request, zod(chatTemplateSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			// Update the chat template
			await updateResource(locals, 'chat-template', id, form.data);
			return { form };
		} catch (error) {
			console.error('Error updating chat template:', error);
			return fail(500, {
				form,
				error: 'Failed to update chat template'
			});
		}
	}
};
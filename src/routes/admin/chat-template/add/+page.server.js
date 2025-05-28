import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { chatTemplateSchema } from '$lib/schema/chat-template';
import { createResource } from '$lib/utils/data';

/**
 * Loads initial data for the add chat template page.
 * @param {import('./$types').PageServerLoadEvent} event - The SvelteKit load event.
 * @returns {Promise<object>} - An object containing the form.
 */
export async function load(event) {
	await event.parent();
	let { user, tenant } = event.locals;

	// Initialize an empty form with default values from schema
	const form = await superValidate(zod(chatTemplateSchema));

	// Auto-populate domain_id for non-main tenants when user is not super admin
	if (tenant !== 'main') {
		form.data.domain_id = user.domain_id;
	}

	return {
		form,
		tenant,
	};
}

/**
 * Handles the default form submission for creating a new chat template.
 */
export const actions = {
	default: async (event) => {
		return await createResource(
			event,
			'/chat-template', // API path for chat templates
			'chat template', // Resource name for messages
			chatTemplateSchema, // Zod schema for validation
			'/admin/chat-template', // Fallback redirect path (list page)
			'/admin/chat-template' // Detail page base path (ID will be appended)
		);
	}
};
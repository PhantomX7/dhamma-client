import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { domainSchema } from '$lib/schema/domain';
import { createResource } from '$lib/utils/data';

/**
 * Loads initial data for the add domain page.
 * @param {import('./$types').PageServerLoadEvent} event - The SvelteKit load event.
 * @returns {Promise<object>} - An object containing the form.
 */
export async function load(event) {
	await event.parent();

	// Initialize an empty form
	const form = await superValidate(zod(domainSchema));

	// Set default values
	form.data.is_active = true;

	return {
		form
	};
}

/**
 * Handles the default form submission for creating a new domain.
 */
export const actions = {
	default: async (event) => {
		// Use the createResource utility function to handle creation
		return await createResource(
			event,
			'/domain', // API path for domains
			'domain', // Resource name for messages
			domainSchema, // Zod schema for validation
			'/admin/domain', // Fallback redirect path (list page)
			'/admin/domain' // Detail page base path (ID will be appended)
		);
	}
};

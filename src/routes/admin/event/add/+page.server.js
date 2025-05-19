import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { eventSchema } from '$lib/schema/event';
import { createResource } from '$lib/utils/data';

/**
 * Loads initial data for the add event page.
 * @param {import('./$types').PageServerLoadEvent} event - The SvelteKit load event.
 * @returns {Promise<object>} - An object containing the form.
 */
export async function load(event) {
	await event.parent();
	let { user } = event.locals;

	// Initialize an empty form with default values from schema
	const form = await superValidate(zod(eventSchema));

	if (user && !user.is_super_admin) {
		form.data.domain_id = user.domain_id;
	}
	
	return {
		form
	};
}

/**
 * Handles the default form submission for creating a new event.
 */
export const actions = {
	default: async (event) => {
		return await createResource(
			event,
			'/event', // API path for events
			'event', // Resource name for messages
			eventSchema, // Zod schema for validation
			'/admin/event', // Fallback redirect path (list page)
			'/admin/event' // Detail page base path (ID will be appended)
		);
	}
};
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { eventSchema } from '$lib/schema/event';
import { loadResourceById, updateResourceById } from '$lib/utils/data';

/**
 * Loads the event data for editing.
 * @param {import('./$types').PageServerLoadEvent} eventData - The SvelteKit load event.
 * @returns {Promise<object>} The event data and the form object.
 */
export async function load(eventData) {
	await eventData.parent();

	const { event } = await loadResourceById(eventData, 'event', 'event', '/admin/event');

	let form = await superValidate(event, zod(eventSchema));
	form.data._original = JSON.stringify(event); // For tracking changes

	return {
		event, // Pass original event data for display purposes if needed
		form
	};
}

export const actions = {
	/**
	 * Handles the default form submission for updating an event.
	 */
	default: async (event) => {
		return await updateResourceById(
			event,
			'event', // Resource path (e.g., /api/event/:id)
			'event', // Resource name for messages
			eventSchema, // Zod schema for validation
			'/admin/event' // Base path for success redirect (to list)
			// Detail page redirect is handled by updateResourceById by appending ID
		);
	}
};
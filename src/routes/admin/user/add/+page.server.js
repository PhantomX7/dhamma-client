import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { userSchema } from '$lib/schema/user';
import { createResource } from '$lib/utils/data';

/**
 * Loads initial data for the add user page.
 * @param {import('./$types').PageServerLoadEvent} event - The SvelteKit load event.
 * @returns {Promise<object>} - An object containing the form.
 */
export async function load(event) {
	await event.parent();

	// Initialize an empty form using the simplified user schema
	const form = await superValidate(zod(userSchema)); // Use createUserSchema

	return {
		form
	};
}

/**
 * Handles the default form submission for creating a new user.
 */
export const actions = {
	default: async (event) => {
		// Use the createResource utility function to handle user creation
		return await createResource(
			event,
			'/user', // API path for users
			'user', // Resource name for messages
			userSchema, // Zod schema for validation
			'/admin/user', // Redirect path on success (list page)
			'/admin/user' // No detail page redirect specified
		);
	}
};
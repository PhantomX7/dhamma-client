import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';

import { roleSchema } from '$lib/schema/role';
// Import the necessary utility functions
import { loadResourceById, updateResourceById } from '$lib/utils/data';

/**
 * Loads the role data for editing using the loadResourceById utility.
 * @param {import('./$types').PageServerLoadEvent} event - The SvelteKit load event.
 * @returns {Promise<object>} The role data and the form object.
 */
export async function load(event) {
	// Ensure parent layout data is loaded (if any)
	await event.parent();

	// Use loadResourceById to fetch the role
	const { role } = await loadResourceById(event, 'role', 'Role', '/admin/role');

	// Initialize the form with the fetched role data
	let form = await superValidate(role, zod(roleSchema));
	// Store the original data for change detection in actions
	form.data._original = JSON.stringify(role);

	return {
		role,
		form
	};
}

/**
 * Defines the server-side actions for the role edit page.
 */
export const actions = {
	/**
	 * Handles the default form submission (updating the role).
	 * Uses the updateResourceById utility function for consistency and maintainability.
	 * @param {import('./$types').RequestEvent} event - The SvelteKit request event.
	 * @returns {Promise<import('@sveltejs/kit').ActionResult>} The result of the action (fail or redirect).
	 */
	default: async (event) => {
		// Delegate the update logic to the reusable utility function
		return await updateResourceById(
			event,
			'/role', // Resource path (e.g., 'domain', 'role')
			'role', // Resource name
			roleSchema, // Zod schema for validation
			'/admin/role' // Base path for success redirect (ID will be appended)
		);
	}
};
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { roleSchema } from '$lib/schema/role';
import { createResource } from '$lib/utils/data';

/**
 * Loads initial data for the add role page.
 * @param {import('./$types').PageServerLoadEvent} event - The SvelteKit load event.
 * @returns {Promise<object>} - An object containing the form.
 */
export async function load(event) {
	await event.parent();
	let { user, tenant } = event.locals;

	// Initialize an empty form using the role schema
	const form = await superValidate(zod(roleSchema));

	// Set default values
	form.data.is_active = true;
	form.data.domain_id = null;

	// Auto-populate domain_id for non-main tenants when user is not super admin
	if (tenant.code !== 'main') {
		form.data.domain_id = user.domain_id;
	}

	return {
		form,
		tenant
	};
}

/**
 * Handles the default form submission for creating a new role.
 */
export const actions = {
	default: async (event) => {
		// Use the createResource utility function to handle role creation
		return await createResource(
			event,
			'/role', // API path for roles
			'role', // Resource name for messages
			roleSchema, // Use the updated Zod schema
			'/admin/role', // Redirect path on success (list page)
			'/admin/role' // Detail page base path (optional, adjust if needed)
		);
	}
};

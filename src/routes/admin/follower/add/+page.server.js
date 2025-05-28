import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { followerSchema } from '$lib/schema/follower';
import { createResource } from '$lib/utils/data';

/**
 * Loads initial data for the add follower page.
 * @param {import('./$types').PageServerLoadEvent} event - The SvelteKit load event.
 * @returns {Promise<object>} - An object containing the form.
 */
export async function load(event) {
	await event.parent();
	let { user, tenant } = event.locals;

	// Initialize an empty form with default values from schema
	const form = await superValidate(zod(followerSchema));
	form.data.is_blood_donor = false;
	form.data.is_youth = false;

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
 * Handles the default form submission for creating a new follower.
 */
export const actions = {
	default: async (event) => {		
		return await createResource(
			event,
			'/follower',      // API path for followers
			'follower',       // Resource name for messages
			followerSchema,   // Zod schema for validation
			'/admin/follower',// Fallback redirect path (list page)
			'/admin/follower' // Detail page base path (ID will be appended)
		);
	}
};
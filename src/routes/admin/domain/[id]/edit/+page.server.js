import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';

import { domainSchema } from '$lib/schema/domain';
import { loadResourceById, updateResourceById } from '$lib/utils/data'; // Import the new update function

/**
 * Loads the domain data for editing using a reusable utility function.
 * @param {import('./$types').PageServerLoadEvent} event - The SvelteKit load event.
 * @returns {Promise<object>} The domain data and the form object.
 */
export async function load(event) {
	await event.parent();

	// Use loadResourceById to fetch the domain
	const { domain } = await loadResourceById(event, 'domain', 'domain', '/admin/domain');

	// Initialize the form with the fetched domain data
	let form = await superValidate(domain, zod(domainSchema));
	// Store the original data for change detection in actions
	form.data._original = JSON.stringify(domain);

	return {
		domain, // Return the fetched domain data
		form // Return the initialized form
	};
}

export const actions = {
	/**
	 * Handles the default form submission for updating a domain.
	 * Uses the reusable updateResourceById utility function.
	 */
	default: async (event) => {
		return await updateResourceById(
			event,
			'/domain',         // Resource path (e.g., 'domain')
			'domain',         // Resource name 
			domainSchema,     // Zod schema for validation
			'/admin/domain'   // Base path for success redirect
		);
	}
};

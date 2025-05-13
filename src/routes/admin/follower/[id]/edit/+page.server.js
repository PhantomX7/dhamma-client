import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { followerSchema } from '$lib/schema/follower';
import { loadResourceById, updateResourceById } from '$lib/utils/data';

/**
 * Loads the follower data for editing.
 * @param {import('./$types').PageServerLoadEvent} event - The SvelteKit load event.
 * @returns {Promise<object>} The follower data and the form object.
 */
export async function load(event) {
	await event.parent();

	const { follower } = await loadResourceById(event, 'follower', 'follower', '/admin/follower');

	let form = await superValidate(follower, zod(followerSchema));
	form.data._original = JSON.stringify(follower);

	return {
		follower,
		form
	};
}

export const actions = {
	/**
	 * Handles the default form submission for updating a follower.
	 */
	default: async (event) => {
		return await updateResourceById(
			event,
			'/follower',      // Resource path
			'follower',       // Resource name
			followerSchema,   // Zod schema for validation
			'/admin/follower' // Base path for success redirect
		);
	}
};
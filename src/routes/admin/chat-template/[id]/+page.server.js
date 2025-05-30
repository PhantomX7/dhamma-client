import api from '$lib/api';
import { fail } from '@sveltejs/kit';
import { runPromise } from '$lib/utils';
import { loadResourceById } from '$lib/utils/data';
import { setFlash } from 'sveltekit-flash-message/server';


/**
 * Loads a single chat template resource by its ID.
 * @param {import('./$types').PageServerLoadEvent} event - The SvelteKit load event.
 * @returns {Promise<object>} An object containing the chat template resource.
 */
export async function load(event) {
	await event.parent();
	// Load the chat template resource using the utility function
	return await loadResourceById(event, 'chat-template', 'chatTemplate', '/admin/chat-template');
}

/**
 * Defines the server-side actions for the role permissions page.
 */
export const actions = {
	/**
	 * Assigns multiple permissions to the role.
	 */
	setDefault: async (event) => {
		const { params, cookies } = event;

		// Call API to assign multiple permissions to the role
		const [response, fetchError] = await runPromise(
			api.post(
				`chat-template/${params.id}/set-default`,
				{},
				event
			)
		);

		if (fetchError || !response.ok) {
			setFlash({ type: 'error', message: 'Failed to set chat template as default' }, cookies);
			return fail(400, { error: 'Failed to set chat template as default' });
		}

		setFlash({ type: 'success', message: 'Chat template set as default successfully' }, cookies);
		return { success: true, message: 'Chat template set as default successfully' };
	},
};
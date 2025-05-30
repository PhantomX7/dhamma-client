import { loadResourceList } from '$lib/utils/data';
import api from '$lib/api';
import { fail } from '@sveltejs/kit';
import { runPromise } from '$lib/utils';
import { setFlash } from 'sveltekit-flash-message/server';

/**
 * Loads a list of chat templates using the reusable loadResourceList utility.
 * @param {import('./$types').PageServerLoadEvent} event - The SvelteKit load event.
 * @returns {Promise<object>} - An object containing the chat templates list and metadata.
 */
export async function load(event) {
	await event.parent();

	// Use the utility function to load the list of chat templates
	const { list: chatTemplates, meta } = await loadResourceList(event, 'chat-template', 'chat-templates', '/admin');

	return {
		chatTemplates,
		meta
	};
}

/**
 * Defines the server-side actions for the chat template page.
 */
export const actions = {
	/**
	 * Sets a chat template as default.
	 */
	setDefault: async (event) => {
		const { request, cookies } = event;
		const formData = await request.formData();
		const templateId = formData.get('templateId');

		if (!templateId) {
			setFlash({ type: 'error', message: 'Template ID is required' }, cookies);
			return fail(400, { error: 'Template ID is required' });
		}

		// Call API to set chat template as default
		const [response, fetchError] = await runPromise(
			api.post(
				`chat-template/${templateId}/set-default`,
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
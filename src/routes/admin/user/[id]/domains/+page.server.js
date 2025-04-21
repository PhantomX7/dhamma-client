import { fail } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';

import api from '$lib/api';
import { runPromise } from '$lib/utils';
import { loadResourceById } from '$lib/utils/data';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	// Ensure parent layout data is loaded
	await event.parent();

	// Load the user resource using the utility function
	return await loadResourceById(event, '/user', 'user', '/admin/user');
}

// The server file needs an action to handle the form submission
export const actions = {
	addDomain: async (event) => {
		const { request, params, cookies } = event;

		// Extract the domain_id from the form submissio
		const formData = await request.formData();

		// Call your API to assign the domain
		const [response, fetchError] = await runPromise(
			api.fetch(
				`user/${params.id}/assign-domain`,
				{
					method: 'POST',

					body: formData
				},
				event
			)
		);

		if (fetchError || !response.ok) {
			setFlash({ type: 'error', message: 'Failed to add domain to user' }, cookies);
			return fail(400, { error: 'Failed to add domain' });
		}

		setFlash({ type: 'success', message: 'Domain successfully added to user' }, cookies);

		return { success: true };
	},

	removeDomain: async (event) => {
		const { request, params, cookies } = event;
		const formData = await request.formData();

		// Call your API to remove the domain from the user
		const [response, fetchError] = await runPromise(
			api.fetch(
				`user/${params.id}/remove-domain`,
				{
					method: 'POST',
					body: formData
				},
				event
			)
		);

		if (fetchError || !response.ok) {
			console.log(response);
			setFlash({ type: 'error', message: 'Failed to remove domain from user' }, cookies);
			return fail(400, { error: 'Failed to remove domain' });
		}

		setFlash({ type: 'success', message: 'Domain successfully removed from user' }, cookies);

		return { success: true };
	}
};

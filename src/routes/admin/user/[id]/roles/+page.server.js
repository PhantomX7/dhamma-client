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

// The server file needs actions to handle the form submissions
export const actions = {
	assignRole: async (event) => {
		const { request, params, cookies } = event;

		// Extract the role_id from the form submissio
		const formData = await request.formData();

		// Call your API to assign the role
		const [response, fetchError] = await runPromise(
			api.fetch(
				`user/${params.id}/assign-role`,
				{
					method: 'POST',

					body: formData
				},
				event
			)
		);

		if (fetchError || !response.ok) {
			setFlash({ type: 'error', message: 'Failed to add role to user' }, cookies);
			return fail(400, { error: 'Failed to add role' });
		}

		setFlash({ type: 'success', message: 'role successfully added to user' }, cookies);

		return { success: true };
	},

	removeRole: async (event) => {
		const { request, params, cookies } = event;
		const formData = await request.formData();

		// Call your API to remove the role from the user
		const [response, fetchError] = await runPromise(
			api.fetch(
				`user/${params.id}/remove-role`,
				{
					method: 'POST',
					body: formData
				},
				event
			)
		);

		if (fetchError || !response.ok) {
			setFlash({ type: 'error', message: 'Failed to remove role from user' }, cookies);
			return fail(400, { error: 'Failed to remove role' });
		}

		setFlash({ type: 'success', message: 'role successfully removed from user' }, cookies);

		return { success: true };
	}
};
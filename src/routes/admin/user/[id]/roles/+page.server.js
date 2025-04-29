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

		// Extract the form data
		const formData = await request.formData();
		const domainId = formData.get('domain_id');
		const roleId = formData.get('role_id');
		
		if (!domainId || !roleId) {
			setFlash({ type: 'error', message: 'Domain and role are required' }, cookies);
			return fail(400, { error: 'Domain and role are required' });
		}

		// Call API to assign the role
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
			setFlash({ type: 'error', message: 'Failed to assign role to user' }, cookies);
			return fail(400, { error: 'Failed to assign role' });
		}

		setFlash({ type: 'success', message: 'Role successfully assigned to user' }, cookies);

		return { success: true };
	},

	removeRole: async (event) => {
		const { request, params, cookies } = event;
		const formData = await request.formData();
		const userRoleId = formData.get('userRoleId');
		
		if (!userRoleId) {
			setFlash({ type: 'error', message: 'User role ID is required' }, cookies);
			return fail(400, { error: 'User role ID is required' });
		}

		// Call API to remove the role from the user
		const [response, fetchError] = await runPromise(
			api.fetch(
				`user/${params.id}/assign-role`,
				{
					method: 'DELETE'
				},
				event
			)
		);

		if (fetchError || !response.ok) {
			setFlash({ type: 'error', message: 'Failed to remove role from user' }, cookies);
			return fail(400, { error: 'Failed to remove role' });
		}

		setFlash({ type: 'success', message: 'Role successfully removed from user' }, cookies);

		return { success: true };
	}
};
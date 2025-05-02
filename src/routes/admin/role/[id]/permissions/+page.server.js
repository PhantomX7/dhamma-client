import { fail } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';

import api from '$lib/api';
import { runPromise } from '$lib/utils';
import { loadResourceById, loadData } from '$lib/utils/data';

/**
 * Loads the role details and all available permissions.
 * @param {import('./$types').PageServerLoadEvent} event - The SvelteKit load event.
 * @returns {Promise<object>} An object containing the role and all permissions.
 */
export async function load(event) {
	// Ensure parent layout data is loaded
	await event.parent();

	// Load the specific role by ID
	const { role } = await loadResourceById(event, '/role', 'role', '/admin/role');

	// Load the list of all available permissions
	const allPermissions = await loadData(event, 'permission?limit=1000');

	// Return the role object and all permissions
	return {
		role,
		allPermissions
	};
}

/**
 * Defines the server-side actions for the role permissions page.
 */
export const actions = {
	/**
	 * Assigns multiple permissions to the role.
	 */
	assignPermissions: async (event) => {
		const { request, params, cookies } = event;
		const formData = await request.formData();

		// Call API to assign multiple permissions to the role
		const [response, fetchError] = await runPromise(
			api.fetch(
				`role/${params.id}/add-permissions`,
				{
					method: 'POST',
					body: formData,
				},
				event
			)
		);

		if (fetchError || !response.ok) {
			setFlash({ type: 'error', message: 'Failed to assign permissions to role' }, cookies);
			return fail(400, { error: 'Failed to assign permissions' });
		}

		setFlash({ type: 'success', message: 'Permissions successfully assigned to role' }, cookies);
		return { success: true, message: 'Permissions assigned successfully' };
	},

	/**
	 * Removes multiple permissions from the role.
	 */
	removePermissions: async (event) => {
		const { request, params, cookies } = event;
		const formData = await request.formData();

		// Call API to remove multiple permissions from the role
		const [response, fetchError] = await runPromise(
			api.fetch(
				`role/${params.id}/delete-permissions`,
				{
					method: 'POST',
					body: formData,
				},
				event
			)
		);

		if (fetchError || !response.ok) {
			setFlash({ type: 'error', message: 'Failed to remove permissions from role' }, cookies);
			return fail(400, { error: 'Failed to remove permissions' });
		}

		setFlash({ type: 'success', message: 'Permissions successfully removed from role' }, cookies);
		return { success: true, message: 'Permissions removed successfully' };
	}
};
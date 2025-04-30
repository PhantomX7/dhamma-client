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

	// Create a map for quick lookup of permissions by their ID
	const permissionMap = new Map(allPermissions.map(p => [p.id, p]));

	// Replace permission IDs in the role object with full permission objects
	if (role && Array.isArray(role.permissions)) {
		// Map over the existing permission IDs and look them up in the map
		role.permissions = role.permissions
			.map(permissionId => permissionMap.get(permissionId))
			.filter(p => p !== undefined); // Filter out any permissions not found in the map
	} else {
		// Handle cases where role.permissions is missing or not an array
		role.permissions = [];
	}

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
	 * Assigns a single permission to the role.
	 */
	assignPermission: async (event) => {
		const { request, params, cookies } = event;
		const formData = await request.formData();
		const permissionId = formData.get('permission_id');

		if (!permissionId) {
			setFlash({ type: 'error', message: 'Permission ID is required' }, cookies);
			return fail(400, { error: 'Permission ID is required' });
		}

		// Call API to assign the permission to the role
		const [response, fetchError] = await runPromise(
			api.fetch(
				`role/${params.id}/assign-permission`,
				{
					method: 'POST',
					body: JSON.stringify({ permission_id: permissionId }),
					headers: {
						'Content-Type': 'application/json'
					}
				},
				event
			)
		);

		if (fetchError || !response.ok) {
			setFlash({ type: 'error', message: 'Failed to assign permission to role' }, cookies);
			return fail(400, { error: 'Failed to assign permission' });
		}

		setFlash({ type: 'success', message: 'Permission successfully assigned to role' }, cookies);
		return { success: true, message: 'Permission assigned successfully' };
	},

	/**
	 * Removes a single permission from the role.
	 */
	removePermission: async (event) => {
		const { request, params, cookies } = event;
		const formData = await request.formData();
		const permissionId = formData.get('permission_id');

		if (!permissionId) {
			setFlash({ type: 'error', message: 'Permission ID is required' }, cookies);
			return fail(400, { error: 'Permission ID is required' });
		}

		// Call API to remove the permission from the role
		const [response, fetchError] = await runPromise(
			api.fetch(
				`role/${params.id}/remove-permission`,
				{
					method: 'POST',
					body: JSON.stringify({ permission_id: permissionId }),
					headers: {
						'Content-Type': 'application/json'
					}
				},
				event
			)
		);

		if (fetchError || !response.ok) {
			setFlash({ type: 'error', message: 'Failed to remove permission from role' }, cookies);
			return fail(400, { error: 'Failed to remove permission' });
		}

		setFlash({ type: 'success', message: 'Permission successfully removed from role' }, cookies);
		return { success: true, message: 'Permission removed successfully' };
	},

	/**
	 * Assigns multiple permissions to the role.
	 */
	assignPermissions: async (event) => {
		const { request, params, cookies } = event;
		const formData = await request.formData();
		const permissionIds = formData.getAll('permission_ids');

		if (!permissionIds.length) {
			setFlash({ type: 'error', message: 'No permissions selected' }, cookies);
			return fail(400, { error: 'No permissions selected' });
		}

		// Call API to assign multiple permissions to the role
		const [response, fetchError] = await runPromise(
			api.fetch(
				`role/${params.id}/assign-permissions`,
				{
					method: 'POST',
					body: JSON.stringify({ permission_ids: permissionIds }),
					headers: {
						'Content-Type': 'application/json'
					}
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
		const permissionIds = formData.getAll('permission_ids');

		if (!permissionIds.length) {
			setFlash({ type: 'error', message: 'No permissions selected' }, cookies);
			return fail(400, { error: 'No permissions selected' });
		}

		// Call API to remove multiple permissions from the role
		const [response, fetchError] = await runPromise(
			api.fetch(
				`role/${params.id}/remove-permissions`,
				{
					method: 'POST',
					body: JSON.stringify({ permission_ids: permissionIds }),
					headers: {
						'Content-Type': 'application/json'
					}
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
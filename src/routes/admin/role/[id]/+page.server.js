import { loadResourceById, loadResourceList } from '$lib/utils/data'; // Corrected import path

/**
 * Loads the role details and associated full permission objects.
 * @param {import('./$types').PageServerLoadEvent} event - The SvelteKit load event.
 * @returns {Promise<object>} An object containing the role with its full permissions.
 */
export async function load(event) {
	// Ensure parent layout data is loaded
	await event.parent();

	// Load the specific role by ID
	const { role } = await loadResourceById(event, '/role', 'role', '/admin/role');

	// Load the list of all available permissions
	const { list: allPermissions } = await loadResourceList(event, 'permission', 'Permissions', '/admin');

	// Create a map for quick lookup of permissions by their code (or ID, adjust if necessary)
	const permissionMap = new Map(allPermissions.map(p => [p.code, p])); // Use p.id if matching by ID

	// Replace permission codes/IDs in the role object with full permission objects
	if (role && Array.isArray(role.permissions)) {
		// Map over the existing permission codes/IDs and look them up in the map
		role.permissions = role.permissions
			.map(permissionIdentifier => permissionMap.get(permissionIdentifier)) // Assumes permissionIdentifier is the code/ID
			.filter(p => p !== undefined); // Filter out any permissions not found in the map
	} else {
		// Handle cases where role.permissions is missing or not an array
		role.permissions = [];
	}

	// Return the role object, now containing full permission objects
	return {
		role,
	};
}
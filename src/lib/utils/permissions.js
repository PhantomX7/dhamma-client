/**
 * Checks if a user object contains a specific permission code.
 *
 * @param {object | null | undefined} user - The user object, expected to have a `permissions` array property.
 * @param {string} requiredPermission - The permission code string to check for (e.g., 'user/index').
 * @returns {boolean} True if the user has the permission, false otherwise.
 */
export function hasPermission(user, requiredPermission) {
    // check if user is super admin
    if (user && user.is_super_admin) {
		return true;
	}

	// Check if user and user.permissions are valid and if permissions is an array
	if (!user || !Array.isArray(user.permissions)) {
		return false;
	}

	// Check if the required permission exists in the user's permissions array
	return user.permissions.includes(requiredPermission);
}

/**
 * Checks if a user object contains at least one of the specified permissions.
 *
 * @param {object | null | undefined} user - The user object.
 * @param {string[]} requiredPermissions - An array of permission codes to check for.
 * @returns {boolean} True if the user has at least one of the permissions, false otherwise.
 */
export function hasAnyPermission(user, requiredPermissions) {
    // check if user is super admin
    if (user && user.is_super_admin) {
		return true;
	}

	if (!user || !Array.isArray(user.permissions) || !Array.isArray(requiredPermissions)) {
		return false;
	}
	return requiredPermissions.some(permission => user.permissions.includes(permission));
}

/**
 * Checks if a user object contains all of the specified permissions.
 *
 * @param {object | null | undefined} user - The user object.
 * @param {string[]} requiredPermissions - An array of permission codes to check for.
 * @returns {boolean} True if the user has all of the permissions, false otherwise.
 */
export function hasAllPermissions(user, requiredPermissions) {
    // check if user is super admin
    if (user && user.is_super_admin) {
		return true;
	}
    
	if (!user || !Array.isArray(user.permissions) || !Array.isArray(requiredPermissions)) {
		return false;
	}
	return requiredPermissions.every(permission => user.permissions.includes(permission));
}
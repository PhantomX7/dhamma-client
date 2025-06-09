/**
 * Table configuration utility for admin tables
 * Provides standardized configuration for admin tables across the application
 */

/**
 * Base column factory function
 * @param {string} key - The data key
 * @param {string} label - The column label
 * @param {string} type - Column type
 * @param {Object} options - Additional options
 * @returns {Object} Column configuration
 */
function createColumn(key, label, type, options = {}) {
	return {
		key,
		label,
		type,
		...options
	};
}

/**
 * Creates a standard ID column configuration
 * @returns {Object} Column configuration for ID field
 */
export const createIdColumn = () => createColumn('id', 'ID', 'text');

/**
 * Creates a standard date column configuration
 * @param {string} key - The data key for the date field
 * @param {string} label - The column label
 * @returns {Object} Column configuration for date field
 */
export const createDateColumn = (key, label) => createColumn(key, label, 'date');

/**
 * Creates a standard text column configuration
 * @param {string} key - The data key for the text field
 * @param {string} label - The column label
 * @returns {Object} Column configuration for text field
 */
export const createTextColumn = (key, label) => createColumn(key, label, 'text');

/**
 * Creates a standard badge column configuration
 * @param {string} key - The data key for the badge field
 * @param {string} label - The column label
 * @param {Function} formatter - Function to format the badge text
 * @param {string} color - Badge color
 * @param {Function} getColor - Function to dynamically determine badge color
 * @returns {Object} Column configuration for badge field
 */
export const createBadgeColumn = (key, label, formatter, color = 'gray', getColor = null) =>
	createColumn(key, label, 'badge', { formatter, color, getColor });

/**
 * Creates a flexible action configuration that can conditionally render as link or button
 * @param {string} label - The action label
 * @param {string} color - The button color
 * @param {Object} config - Configuration object
 * @param {string} config.permission - The permission required for the action
 * @param {string|Function} config.href - Static URL or function that returns URL based on item
 * @param {Function} config.onclick - Click handler function
 * @param {Function} config.condition - Function to determine if action should be link or button
 * @param {string} config.icon - Optional icon type
 * @returns {Object} Action configuration
 */
export const createFlexibleAction = (label, color, config) => {
	return {
		label,
		color,
		permission: config.permission,
		icon: config.icon,
		// Dynamic behavior based on item data
		getActionType: (item) => {
			if (config.condition) {
				return config.condition(item) ? 'link' : 'button';
			}
			return config.href ? 'link' : 'button';
		},
		// Dynamic href generation
		getHref: (item) => {
			if (typeof config.href === 'function') {
				return config.href(item);
			}
			return config.href?.replace('{id}', item.id);
		},
		onclick: config.onclick
	};
};

/**
 * Creates a standard view action configuration
 * @param {string} baseUrl - The base URL for the view action
 * @param {string} permission - The permission required for the view action
 * @returns {Object} Action configuration for view
 */
export const createViewAction = (baseUrl, permission) =>
	createFlexibleAction('View', 'alternative', {
		icon: 'view',
		href: `${baseUrl}/{id}`,
		permission
	});

/**
 * Creates a standard edit action configuration
 * @param {string} baseUrl - The base URL for the edit action
 * @param {string} permission - The permission required for the edit action
 * @returns {Object} Action configuration for edit
 */
export const createEditAction = (baseUrl, permission) =>
	createFlexibleAction('Edit', 'primary', {
		icon: 'edit',
		href: `${baseUrl}/{id}/edit`,
		permission
	});

/**
 * Simplified custom action that auto-detects behavior
 * @param {string} label - The action label
 * @param {string} color - The button color
 * @param {string|Function} urlOrCondition - URL string, URL function, or condition function
 * @param {string} permission - The permission required
 * @param {Function} onclick - Optional click handler
 * @returns {Object} Action configuration
 */
export const createSmartAction = (label, color, urlOrCondition, permission, onclick = null) => {
	const isFunction = typeof urlOrCondition === 'function';
	const isString = typeof urlOrCondition === 'string';

	return createFlexibleAction(label, color, {
		permission,
		href: isString ? urlOrCondition : null,
		onclick,
		condition: isFunction ? urlOrCondition : null
	});
};

/**
 * Creates a conditional column that only shows for super admins
 * @param {Object} column - The column configuration
 * @returns {Object} Column with super admin condition
 */
export const createSuperAdminColumn = (column) => ({
	...column,
	condition: (user) => user.is_super_admin
});

/**
 * Creates a domain column for super admin views
 * @returns {Object} Domain column configuration
 */
export const createDomainColumn = () => ({
	key: 'domain',
	label: 'Domain',
	type: 'custom',
	formatter: (item) =>
		item.domain?.name || '<span class="text-gray-400 dark:text-gray-500">N/A</span>'
});

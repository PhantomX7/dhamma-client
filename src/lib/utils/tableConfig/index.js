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
 * Base action factory function
 * @param {string} label - Action label
 * @param {Object} options - Action options
 * @returns {Object} Action configuration
 */
function createAction(label, options = {}) {
  return {
    label,
    ...options
  };
}

/**
 * Creates a standard view action configuration
 * @param {string} baseUrl - The base URL for the view action
 * @param {string} permission - The permission required for the view action
 * @returns {Object} Action configuration for view
 */
export const createViewAction = (baseUrl, permission) => 
  createAction('View', {
    icon: 'view',
    color: 'alternative',
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
  createAction('Edit', {
    icon: 'edit',
    color: 'primary',
    href: `${baseUrl}/{id}/edit`,
    permission
  });

/**
 * Creates a custom action configuration
 * @param {string} label - The action label
 * @param {string} color - The button color
 * @param {string} url - The action URL (optional if using onclick)
 * @param {string} permission - The permission required for the action
 * @param {string|Function} onclick - Optional onclick handler for form submissions
 * @returns {Object} Action configuration for custom action
 */
export const createCustomAction = (label, color, url, permission, onclick = null) => 
  createAction(label, {
    color,
    permission,
    ...(onclick ? { onclick } : { href: url })
  });

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
  formatter: (item) => item.domain?.name || '<span class="text-gray-400 dark:text-gray-500">N/A</span>'
});
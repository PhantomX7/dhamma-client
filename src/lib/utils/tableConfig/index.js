/**
 * Table configuration utility for admin tables
 * Provides standardized configuration for admin tables across the application
 */

/**
 * Creates a standard ID column configuration
 * @returns {Object} Column configuration for ID field
 */
export function createIdColumn() {
  return {
    key: 'id',
    label: 'ID',
    type: 'text'
  };
}

/**
 * Creates a standard date column configuration
 * @param {string} key - The data key for the date field
 * @param {string} label - The column label
 * @returns {Object} Column configuration for date field
 */
export function createDateColumn(key, label) {
  return {
    key,
    label,
    type: 'date'
  };
}

/**
 * Creates a standard badge column configuration
 * @param {string} key - The data key for the badge field
 * @param {string} label - The column label
 * @param {Function} formatter - Function to format the badge text
 * @param {string} color - Badge color
 * @param {Function} getColor - Function to dynamically determine badge color
 * @returns {Object} Column configuration for badge field
 */
export function createBadgeColumn(key, label, formatter, color = 'gray', getColor = null) {
  return {
    key,
    label,
    type: 'badge',
    formatter,
    color,
    getColor
  };
}

/**
 * Creates a standard text column configuration
 * @param {string} key - The data key for the text field
 * @param {string} label - The column label
 * @returns {Object} Column configuration for text field
 */
export function createTextColumn(key, label) {
  return {
    key,
    label,
    type: 'text'
  };
}

/**
 * Creates a standard view action configuration
 * @param {string} baseUrl - The base URL for the view action
 * @param {string} permission - The permission required for the view action
 * @returns {Object} Action configuration for view
 */
export function createViewAction(baseUrl, permission) {
  return {
    label: 'View',
    icon: 'view',
    color: 'alternative',
    href: `${baseUrl}/{id}`,
    permission
  };
}

/**
 * Creates a custom action configuration
 * @param {string} label - The action label
 * @param {string} color - The button color
 * @param {string} url - The action URL (optional if using onclick)
 * @param {string} permission - The permission required for the action
 * @param {string} onclick - Optional onclick handler for form submissions
 * @returns {Object} Action configuration for custom action
 */
export function createCustomAction(label, color, url, permission, onclick = null) {
  const action = {
    label,
    color,
    permission
  };
  
  if (onclick) {
    action.onclick = onclick;
  } else {
    action.href = url;
  }
  
  return action;
}

/**
 * Creates a standard edit action configuration
 * @param {string} baseUrl - The base URL for the edit action
 * @param {string} permission - The permission required for the edit action
 * @returns {Object} Action configuration for edit
 */
export function createEditAction(baseUrl, permission) {
  return {
    label: 'Edit',
    icon: 'edit',
    color: 'primary',
    href: `${baseUrl}/{id}/edit`,
    permission
  };
}

/**
 * Creates a conditional column that only shows for super admins
 * @param {Object} column - The column configuration
 * @returns {Object} Column with super admin condition
 */
export function createSuperAdminColumn(column) {
  return {
    ...column,
    condition: (user) => user.is_super_admin
  };
}
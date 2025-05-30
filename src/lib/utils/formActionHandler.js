/**
 * Generic form action handler for table actions
 * Provides standardized form submission with alert handling
 */

import { invalidateAll } from '$app/navigation';

/**
 * Creates a form action handler with alert management
 * @param {Object} options - Configuration options
 * @param {Function} options.setSuccessAlert - Function to set success alert state
 * @param {Function} options.setErrorAlert - Function to set error alert state
 * @param {Function} options.setAlertMessage - Function to set alert message
 * @param {number} options.alertTimeout - Timeout for auto-hiding alerts (default: 3000ms)
 * @returns {Function} Form action handler function
 */
export function createFormActionHandler({
	setSuccessAlert,
	setErrorAlert,
	setAlertMessage,
	alertTimeout = 3000
}) {
	/**
	 * Generic form action handler
	 * @param {Object} config - Action configuration
	 * @param {string} config.action - Form action name
	 * @param {string} config.method - HTTP method (default: 'POST')
	 * @param {Function} config.getFormData - Function to generate form data from item
	 * @param {Function} config.validateItem - Optional validation function
	 * @param {string} config.successMessage - Success message template
	 * @param {string} config.errorMessage - Error message template
	 * @param {string} config.validationErrorMessage - Validation error message
	 * @returns {Function} Action handler function
	 */
	return function createAction(config) {
		return async function(item) {
			// Validation check
			if (config.validateItem && !config.validateItem(item)) {
				setErrorAlert(true);
				setAlertMessage(config.validationErrorMessage || 'Invalid item for this action');
				setTimeout(() => setErrorAlert(false), alertTimeout);
				return;
			}

			// Generate form data
			const formData = config.getFormData(item);

			// Submit form action
			try {
				const response = await fetch(`?/${config.action}`, {
					method: config.method || 'POST',
					body: formData
				});

				const result = await response.json();
				
				if (result.type === 'success') {
					setSuccessAlert(true);
					setAlertMessage(result.data?.message || config.successMessage || 'Action completed successfully');
					await invalidateAll();
					setTimeout(() => setSuccessAlert(false), alertTimeout);
				} else {
					setErrorAlert(true);
					setAlertMessage(result.data?.message || config.errorMessage || 'Action failed');
					setTimeout(() => setErrorAlert(false), alertTimeout);
				}
			} catch (error) {
				setErrorAlert(true);
				setAlertMessage(config.errorMessage || 'An error occurred while performing the action:'+error);
				setTimeout(() => setErrorAlert(false), alertTimeout);
			}
		};
	};
}

/**
 * Common form action configurations
 */
export const commonActions = {
	/**
	 * Generic action configuration with customizable form data
	 * @param {string} actionName - Name of the action
	 * @param {Object} options - Configuration options
	 * @param {Object|Function} options.formFields - Object mapping field names to values, or function that returns such object
	 * @param {string} options.method - HTTP method (default: 'POST')
	 * @param {Function} options.validateItem - Optional validation function
	 * @param {string} options.itemType - Type of item for messages (default: 'item')
	 * @param {string} options.successMessage - Custom success message
	 * @param {string} options.errorMessage - Custom error message
	 * @param {string} options.validationErrorMessage - Custom validation error message
	 * @returns {Object} Action configuration
	 */
	generic: (actionName, options = {}) => ({
		action: actionName,
		method: options.method || 'POST',
		getFormData: (item) => {
			const formData = new FormData();
			const fields = typeof options.formFields === 'function' 
				? options.formFields(item) 
				: options.formFields || {};
			
			Object.entries(fields).forEach(([key, value]) => {
				formData.append(key, value);
			});
			
			return formData;
		},
		validateItem: options.validateItem,
		successMessage: options.successMessage || `${options.itemType || 'item'} ${actionName} completed successfully`,
		errorMessage: options.errorMessage || `Failed to ${actionName} ${options.itemType || 'item'}`,
		validationErrorMessage: options.validationErrorMessage
	}),
	/**
	 * Set default action configuration
	 * @param {string} itemType - Type of item (e.g., 'template', 'user')
	 * @returns {Object} Action configuration
	 */
	setDefault: (itemType = 'item') => ({
		action: 'setDefault',
		getFormData: (item) => {
			const formData = new FormData();
			formData.append('templateId', item.id);
			return formData;
		},
		validateItem: (item) => !item.is_default,
		successMessage: `${itemType} set as default successfully`,
		errorMessage: `Failed to set ${itemType} as default`,
		validationErrorMessage: `This ${itemType} is already set as default`
	}),

	/**
	 * Toggle status action configuration
	 * @param {string} itemType - Type of item
	 * @returns {Object} Action configuration
	 */
	toggleStatus: (itemType = 'item') => ({
		action: 'toggleStatus',
		getFormData: (item) => {
			const formData = new FormData();
			formData.append('id', item.id);
			return formData;
		},
		successMessage: `${itemType} status updated successfully`,
		errorMessage: `Failed to update ${itemType} status`
	}),

	/**
	 * Delete action configuration
	 * @param {string} itemType - Type of item
	 * @returns {Object} Action configuration
	 */
	delete: (itemType = 'item') => ({
		action: 'delete',
		method: 'DELETE',
		getFormData: (item) => {
			const formData = new FormData();
			formData.append('id', item.id);
			return formData;
		},
		successMessage: `${itemType} deleted successfully`,
		errorMessage: `Failed to delete ${itemType}`
	})
};
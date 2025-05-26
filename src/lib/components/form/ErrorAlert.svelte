<script>
	import { Alert, Button } from 'flowbite-svelte';
	import { ExclamationCircleOutline, XSolid } from 'flowbite-svelte-icons';

	/**
	 * Enhanced error alert component with better UX
	 * @prop {Object} errors - Error object from form validation
	 * @prop {boolean} [dismissible=true] - Whether the alert can be dismissed
	 * @prop {string} [title='Please fix the following errors:'] - Alert title
	 * @prop {Object} [fieldLabels={}] - Custom field label mappings (e.g., {name: 'Full Name', email: 'Email Address'})
	 * @prop {Function} [onDismiss] - Callback function when alert is dismissed
	 */
	let {
		errors = {},
		title = 'Please fix the following errors:',
		fieldLabels = {},
	} = $props();

	let dismissed = $state(false);

	/**
	 * Get user-friendly field names from custom labels or generate from field name
	 * @param {string} fieldName - The field name from the error object
	 * @returns {string} - User-friendly field label
	 */
	function getFieldLabel(fieldName) {
		// Use custom field label if provided, otherwise generate from field name
		if (fieldLabels[fieldName]) {
			return fieldLabels[fieldName];
		}
		
		// Convert snake_case or camelCase to Title Case
		return fieldName
			.replace(/[_-]/g, ' ') // Replace underscores and hyphens with spaces
			.replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before capital letters in camelCase
			.split(' ')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ');
	}

</script>

{#if Object.keys(errors).length > 0 && !dismissed}
	<Alert color="red" class="mb-6 border-l-4 border-red-500">
		<div class="flex items-start justify-between">
			<div class="flex items-start space-x-3">
				<ExclamationCircleOutline class="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
				<div class="flex-1">
					<h3 class="font-medium text-red-800 dark:text-red-200 mb-2">{title}</h3>
					<div class="space-y-2">
						{#each Object.entries(errors) as [field, fieldErrors]}
							{#if fieldErrors && fieldErrors.length > 0} 
								<div class="bg-red-50 dark:bg-red-900/20 rounded-md p-3 border border-red-200 dark:border-red-800">
									<div class="font-medium text-red-800 dark:text-red-200 text-sm mb-1">
										{getFieldLabel(field)}
									</div>
									<ul class="text-sm text-red-700 dark:text-red-300 space-y-1">
										{#each fieldErrors as error}
											<li class="flex items-start">
												<span class="inline-block w-1.5 h-1.5 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
												{error}
											</li>
										{/each}
									</ul>
								</div>
							{/if}
						{/each}
					</div>
				</div>
			</div>
		</div>
	</Alert>
{/if}
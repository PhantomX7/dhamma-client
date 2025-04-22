<script>
	import { Toggle, Label, Helper } from 'flowbite-svelte';

	/**
	 * Props for the FormToggle component.
	 * @prop {string} [id=''] - The ID for the toggle input and label association.
	 * @prop {string} [label=''] - The label text for the toggle.
	 * @prop {string} [name=''] - The name attribute for the toggle input.
	 * @prop {boolean} value - The bindable boolean value representing the toggle state.
	 * @prop {string} [helperText=''] - Optional helper text displayed below the toggle.
	 * @prop {string} [error=''] - Optional error message displayed below the toggle (takes precedence over helperText).
	 * @prop {boolean} [required=false] - Indicates if the field is required (adds an asterisk to the label).
	 */
	let {
		id = '',
		label = '',
		name = '',
		value = $bindable(), // Use $bindable for two-way binding
		helperText = '',
		error = '',
		required = false
	} = $props();
</script>

<div class="space-y-2">
	{#if label}
		<Label for={id} class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
			{label}{#if required}<span class="ml-1 text-red-500">*</span>{/if}
		</Label>
	{/if}

	<div class="flex items-center gap-2">
		<Toggle
			{id}
			{name}
			bind:checked={value}
			class="focus:ring-primary-500 dark:focus:ring-primary-600"
			color={error ? 'red' : 'primary'}
		>
			<!-- Label inside the toggle -->
			<span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
				{value ? 'Active' : 'Inactive'}
			</span>
		</Toggle>
	</div>

	{#if error}
		<Helper class="mt-2 text-xs text-red-600 dark:text-red-500">{error}</Helper>
	{:else if helperText}
		<Helper class="mt-2 text-xs text-gray-500 dark:text-gray-400">{helperText}</Helper>
	{/if}
</div>

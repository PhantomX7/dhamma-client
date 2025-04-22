<script>
	import { Textarea, Label, Helper } from 'flowbite-svelte';

	/**
	 * Props for the FormTextarea component.
	 * @prop {string} [id=''] - The ID for the textarea and label association.
	 * @prop {string} [label=''] - The label text for the textarea.
	 * @prop {string} [name=''] - The name attribute for the textarea.
	 * @prop {string} value - The bindable string value for the textarea.
	 * @prop {number} [rows=4] - The number of visible text lines for the control.
	 * @prop {string} [placeholder=''] - Placeholder text for the textarea.
	 * @prop {string} [error=''] - Optional error message displayed below the textarea.
	 * @prop {string} [helperText=''] - Optional helper text displayed below the textarea (ignored if error exists).
	 * @prop {boolean} [required=false] - Indicates if the field is required (adds asterisk to label).
	 */
	let {
		id = '',
		label = '',
		name = '',
		value = $bindable(),
		rows = 4,
		placeholder = '',
		error = '',
		helperText = '',
		required = false
	} = $props();
</script>

<div class="space-y-2">
	{#if label}
		<!-- Label with required indicator -->
		<Label for={id} class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
			{label}{#if required}<span class="ml-1 text-red-500">*</span>{/if}
		</Label>
	{/if}

	<!-- Textarea input -->
	<Textarea
		{id}
		{name}
		{rows}
		bind:value
		{placeholder}
		{required}
		color={error ? 'red' : 'base'}
	/>

	{#if error}
		<!-- Display error message -->
		<Helper class="mt-2 text-xs text-red-600 dark:text-red-500">{error}</Helper>
	{:else if helperText}
		<!-- Display helper text if no error -->
		<Helper class="mt-2 text-xs text-gray-500 dark:text-gray-400">{helperText}</Helper>
	{/if}
</div>
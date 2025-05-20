<script>
	import { Input, Label, Helper } from 'flowbite-svelte';

	/**
	 * Props for the FormInput component.
	 * @prop {string} [id=''] - The ID for the input and label association.
	 * @prop {string} [label=''] - The label text for the input.
	 * @prop {string} [type='text'] - The type of the input field (e.g., 'text', 'email', 'password').
	 * @prop {string} [name=''] - The name attribute for the input.
	 * @prop {string|number} value - The bindable value for the input.
	 * @prop {string} [placeholder=''] - Placeholder text for the input.
	 * @prop {string} [error=''] - Optional error message displayed below the input.
	 * @prop {string} [helperText=''] - Optional helper text displayed below the input (ignored if error exists).
	 * @prop {boolean} [required=false] - Indicates if the field is required (adds asterisk to label).
	 */
	let {
		id = '',
		label = '',
		type = 'text',
		name = '',
		value = $bindable(),
		placeholder = '',
		error = '',
		helperText = '',
		required = false,
		oninput = () => {}
	} = $props();

	// No need for event dispatcher in Svelte 5 - events are forwarded automatically
</script>

<div class="space-y-2">
	{#if label}
		<!-- Label with required indicator and dark mode support -->
		<Label for={id} class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
			{label}{#if required}<span class="ml-1 text-red-500">*</span>{/if}
		</Label>
	{/if}

	<!-- Input field with event forwarding -->
	<!-- In Svelte 5, events are automatically forwarded without needing a dispatcher -->
	<Input
		{id}
		{type}
		{name}
		bind:value
		{placeholder}
		{required}
		color={error ? 'red' : 'base'}
		on:input={oninput}
	/>

	{#if error}
		<!-- Display error message -->
		<Helper class="mt-2 text-xs text-red-600 dark:text-red-500">{error}</Helper>
	{:else if helperText}
		<!-- Display helper text if no error -->
		<Helper class="mt-2 text-xs text-gray-500 dark:text-gray-400">{helperText}</Helper>
	{/if}
</div>

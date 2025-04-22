<script>
	import { Button, Spinner } from 'flowbite-svelte';

	/**
	 * Props for the FormButton component.
	 * @prop {'submit' | 'button' | 'reset'} [type='submit'] - The button's type attribute.
	 * @prop {boolean} [loading=false] - If true, shows loading state (spinner and loadingText) and disables the button.
	 * @prop {string} [loadingText='Loading...'] - Text displayed next to the spinner when loading.
	 * @prop {string} [text='Submit'] - Text displayed on the button when not loading.
	 * @prop {import('flowbite-svelte').ButtonColor} [color='primary'] - The color theme of the button.
	 * @prop {boolean} [disabled=false] - Explicitly disables the button (in addition to loading state).
	 * @prop {string} [class=''] - Additional CSS classes to apply to the button.
	 */
	let {
		type = 'submit',
		loading = false,
		loadingText = 'Loading...',
		text = 'Submit',
		color = 'primary',
		disabled = false,
		class: className = '' // Renamed prop variable to avoid conflict with class keyword
	} = $props();
</script>

<Button
	{type}
	disabled={disabled || loading}
	{color}
	class="rounded-lg py-2.5 font-medium transition-colors {className}"
>
	{#if loading}
		<!-- Loading state content -->
		<div class="flex items-center justify-center gap-2">
			<Spinner size="4" color="white" class="me-2" /> 
			{loadingText}
		</div>
	{:else}
		{text}
	{/if}
</Button>
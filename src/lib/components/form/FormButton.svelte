<script>
	import { Button, Spinner } from 'flowbite-svelte';

	let { 
		type = 'submit', 
		loading = false, 
		loadingText = 'Loading...', 
		text = 'Submit',
		color = 'primary',
		disabled = false,
		class: className = ''
	} = $props();
</script>

<Button
	{type}
	disabled={disabled || loading}
	color={color}
	class="rounded-lg py-2.5 font-medium transition-colors {className}"
>
	{#if loading}
		<div class="flex items-center justify-center gap-2">
			{loadingText} <Spinner size="sm" color="white" />
		</div>
	{:else}
		{text}
	{/if}
</Button>
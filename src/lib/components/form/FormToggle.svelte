<script>
	import { Toggle, Label } from 'flowbite-svelte';

	let { id = '', label = '', name = '', checked = $bindable('') } = $props();
</script>

<div>
	{#if label}
		<Label>{label}</Label>
	{/if}
	<Toggle {name} bind:checked>
		{checked ? 'Active' : 'Inactive'}
	</Toggle>
</div>

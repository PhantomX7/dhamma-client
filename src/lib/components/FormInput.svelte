<script>
	import { Input, Label } from 'flowbite-svelte';

	let { id = '', label = '', type = 'text', name = '', value = '', placeholder = '', error = '' } = $props();
</script>

<div>
	<Label for={id} class="text-sm font-medium text-gray-700">{label}</Label>
	<Input
		{id}
		{type}
		{name}
		bind:value
		{placeholder}
		class="mt-1 block w-full rounded-lg focus:border-primary-500 focus:ring-primary-500"
		color={error ? 'red' : undefined}
	/>
	{#if error}
		<p class="mt-2 text-sm text-red-600">{error}</p>
	{/if}
</div>
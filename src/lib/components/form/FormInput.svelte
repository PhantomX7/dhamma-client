<script>
	import { Input, Label, Helper } from 'flowbite-svelte';

	let { 
		id = '', 
		label = '', 
		type = 'text', 
		name = '', 
		value = $bindable(), 
		placeholder = '', 
		error = '',
		helperText = '',
		required = false
	} = $props();
</script>

<div class="space-y-2">
	<div class="flex items-center justify-between">
		<Label for={id} class="text-sm font-medium text-gray-700">
			{label}{#if required}<span class="ml-1 text-red-500">*</span>{/if}
		</Label>
		{#if error}
			<span class="text-sm text-red-600">{error}</span>
		{/if}
	</div>
	
	<Input
		{id}
		{type}
		{name}
		bind:value
		{placeholder}
		{required}
		class="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-300"
		color={error ? 'red' : undefined}
	/>
	
	{#if helperText && !error}
		<Helper class="text-xs text-gray-500">{helperText}</Helper>
	{/if}
</div>
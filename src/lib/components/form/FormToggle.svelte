<script>
	import { Toggle, Label, Helper } from 'flowbite-svelte';

	let { 
		id = '', 
		label = '', 
		name = '', 
		value = $bindable(false),
		helperText = '',
		error = '',
		required = false
	} = $props();
</script>

<div class="space-y-2">
	<div class="flex items-center justify-between">
		{#if label}
			<Label for={id} class="text-sm font-medium text-gray-700">
				{label}{#if required}<span class="ml-1 text-red-500">*</span>{/if}
			</Label>
		{/if}
		{#if error}
			<span class="text-sm text-red-600">{error}</span>
		{/if}
	</div>

	<div class="flex items-center gap-2">
		<Toggle 
			{id} 
			{name} 
			checked={value} 
			class="focus:ring-2 focus:ring-primary-300"
			color={error ? 'red' : undefined}
		>
			{value ? 'Active' : 'Inactive'}
		</Toggle>
	</div>
	
	{#if helperText && !error}
		<Helper class="text-xs text-gray-500">{helperText}</Helper>
	{/if}
	{#if error}
		<Helper class="text-xs text-red-500">{error}</Helper>
	{/if}
</div>

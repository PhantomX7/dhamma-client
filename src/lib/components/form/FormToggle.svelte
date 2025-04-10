<script>
	import { Toggle, Label, Helper } from 'flowbite-svelte';

	let { 
		id = '', 
		label = '', 
		name = '', 
		checked = $bindable(''),
		helperText = ''
	} = $props();
</script>

<div class="space-y-2">
	<div class="flex items-center gap-2">
		<Toggle 
			{id} 
			{name} 
			bind:checked 
			class="focus:ring-2 focus:ring-primary-300"
		>
			{checked ? 'Active' : 'Inactive'}
		</Toggle>
		
		{#if label}
			<Label for={id} class="text-sm font-medium text-gray-700">{label}</Label>
		{/if}
	</div>
	
	{#if helperText}
		<Helper class="text-xs text-gray-500">{helperText}</Helper>
	{/if}
</div>

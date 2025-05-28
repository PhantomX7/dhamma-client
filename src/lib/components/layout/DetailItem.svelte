<script>
	// Define props for the component using Svelte 5 runes
	let { label = '', value = undefined, class: className = '', size = 'md', children } = $props();
</script>

<!-- Enhanced DetailItem component with improved UI and flexible content handling -->
<div class="group rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 {className}">
	<!-- Label with improved typography -->
	<dt class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</dt>
	
	<!-- Content area with conditional rendering for value prop or children -->
	<dd class="{size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'} font-medium text-gray-900 dark:text-white">
		{#if value !== undefined}
			<!-- Display value prop if provided -->
			<span class="break-words">{value}</span>
		{:else if children}
			<!-- Render children if no value prop -->
			{@render children()}
		{:else}
			<!-- Fallback for empty content -->
			<span class="text-gray-400 dark:text-gray-500 italic">N/A</span>
		{/if}
	</dd>
</div>
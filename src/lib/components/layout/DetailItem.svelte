<script>
	// Define props for the component using Svelte 5 runes
	let { label = '', class: className = '', children } = $props();
</script>

<!-- Reusable component structure using Card for consistent styling -->
<div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 {className}">
	<!-- Label for the detail item -->
	<h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</h3>
	<!-- Slot for the value/content, allowing flexible content like text, badges, etc. -->
	<div class="mt-1">
		{@render children()}
	</div>
</div>
<!-- Container.svelte -->
<script>
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	// Accept children components
	let { breadcrumb = null, children } = $props();
</script>

<div class="min-h-screen p-4 md:p-6 dark:bg-gray-900">
	{#if breadcrumb}
		<!-- Breadcrumb navigation -->
		<Breadcrumb class="mb-6" items={breadcrumb} />
	{/if}

	{@render children?.()}
</div>

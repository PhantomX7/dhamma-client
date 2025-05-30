<!-- Container.svelte -->
<script>
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { Alert } from 'flowbite-svelte';

	// Accept children components, title, and slots
	let {
		breadcrumb = null,
		title = '', // New title prop
		children,
		headerActions = null, // Slot for header actions/buttons, now expecting a snippet
		// Alert props
		showSuccessAlert = false,
		showErrorAlert = false,
		alertMessage = '',
		onCloseSuccessAlert = null,
		onCloseErrorAlert = null
	} = $props();

	/**
	 * Handles closing success alert
	 */
	function handleCloseSuccessAlert() {
		if (onCloseSuccessAlert) {
			onCloseSuccessAlert();
		}
	}

	/**
	 * Handles closing error alert
	 */
	function handleCloseErrorAlert() {
		if (onCloseErrorAlert) {
			onCloseErrorAlert();
		}
	}
</script>

<div class="min-h-screen p-4 md:p-6">
	{#if breadcrumb}
		<!-- Breadcrumb navigation -->
		<Breadcrumb class="mb-6" items={breadcrumb} />
	{/if}

	{#if title || headerActions}
		<div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
			{#if title}
				<h1 class="text-2xl font-semibold text-gray-900 dark:text-white">{title}</h1>
			{/if}
			{#if headerActions}
				<div class="flex items-center gap-2">
					{@render headerActions()}
				</div>
			{/if}
		</div>
	{/if}

	<!-- Alert messages -->
	{#if showSuccessAlert}
		<Alert color="green" class="mb-4" dismissable onclick={handleCloseSuccessAlert}>
			<span class="font-medium">Success!</span>
			{alertMessage}
		</Alert>
	{/if}

	{#if showErrorAlert}
		<Alert color="red" class="mb-4" dismissable onclick={handleCloseErrorAlert}>
			<span class="font-medium">Error!</span>
			{alertMessage}
		</Alert>
	{/if}

	{@render children?.()}
</div>

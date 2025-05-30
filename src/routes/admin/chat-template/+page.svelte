<script>
	import { Button, Alert } from 'flowbite-svelte';
	import { PlusOutline } from 'flowbite-svelte-icons';
	import DataTable from '$lib/components/DataTable.svelte';
	import AdminTable from '$lib/components/AdminTable.svelte';
	import { FilterType } from '$lib/utils/filter';
	import { getContext } from 'svelte';
	import { Container } from '$lib/components/layout';
	import { hasPermission } from '$lib/utils/permissions';
	import { getChatTemplateTableConfig } from '$lib/utils/tableConfig/chatTemplate.js';
	import { invalidateAll } from '$app/navigation';

	const currentUser = getContext('user');

	// Component props
	let { data } = $props();

	// Breadcrumb items definition
	const breadcrumbItems = $derived([{ label: 'Chat Templates', href: '/admin/chat-template' }]);

	// Configuration for the DataTable filter component
	const filterConfig = $derived({
		name: {
			type: FilterType.STRING,
			label: 'Name'
		},
		...(currentUser()?.is_super_admin && {
			domain_name: {
				type: FilterType.STRING,
				label: 'Domain Name'
			}
		}),
		description: {
			type: FilterType.STRING,
			label: 'Description'
		},
		is_default: {
			type: FilterType.BOOL,
			label: 'Default Template'
		},
		is_active: {
			type: FilterType.BOOL,
			label: 'Status Active'
		},
		created_at: {
			type: FilterType.DATE,
			label: 'Created Date'
		},
	});

	// Table configuration with setDefault action handler
	const tableConfig = $derived({
		...getChatTemplateTableConfig(currentUser()?.is_super_admin),
		actions: getChatTemplateTableConfig(currentUser()?.is_super_admin).actions.map(action => {
			if (action.onclick === 'setDefault') {
				return { ...action, onclick: setDefault };
			}
			return action;
		})
	});

	// Alert state
	let showSuccessAlert = $state(false);
	let showErrorAlert = $state(false);
	let alertMessage = $state('');

	/**
	 * Sets a chat template as default
	 * @param {Object} item - The template item
	 */
	async function setDefault(item) {
		if (item.is_default) {
			// Already default, show message
			showErrorAlert = true;
			alertMessage = 'This template is already set as default';
			setTimeout(() => {
				showErrorAlert = false;
			}, 3000);
			return;
		}

		// Create form data
		const formData = new FormData();
		formData.append('templateId', item.id);

		// Submit using fetch to avoid page refresh
		try {
			const response = await fetch('?/setDefault', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();
			
			if (result.type === 'success') {
				showSuccessAlert = true;
				alertMessage = result.data?.message || 'Template set as default successfully';
				await invalidateAll();
				setTimeout(() => {
					showSuccessAlert = false;
				}, 3000);
			} else {
				showErrorAlert = true;
				alertMessage = result.data?.message || 'Failed to set template as default';
				setTimeout(() => {
					showErrorAlert = false;
				}, 3000);
			}
		} catch (error) {
			showErrorAlert = true;
			alertMessage = 'An error occurred while setting template as default';
			setTimeout(() => {
				showErrorAlert = false;
			}, 3000);
		}
	}



	/**
	 * Extract template variables from content using regex
	 * @param {string} content - Template content
	 * @returns {string[]} Array of variable names
	 */
	function extractTemplateVariables(content) {
		if (!content) return [];
		const regex = /\{\{\s*([^}]+)\s*\}\}/g;
		const variables = [];
		let match;
		while ((match = regex.exec(content)) !== null) {
			variables.push(match[1].trim());
		}
		return [...new Set(variables)]; // Remove duplicates
	}

	/**
	 * Get preview of template content with highlighted variables
	 * @param {string} content - Template content
	 * @returns {string} Truncated content for preview
	 */
	function getContentPreview(content) {
		if (!content) return 'No content';
		return content.length > 100 ? content.substring(0, 100) + '...' : content;
	}

	const tableColspan = $derived(currentUser().is_super_admin ? 12 : 11);
</script>

<!-- Use Container component -->
<Container breadcrumb={breadcrumbItems} title="Chat Templates">
	{#snippet headerActions()}
		{#if hasPermission(currentUser(), 'chat-template/create')}
			<Button href="/admin/chat-template/add">
				<PlusOutline class="me-2 h-4 w-4" /> Add New Template
			</Button>
		{/if}
	{/snippet}

	<!-- Alert messages -->
	{#if showSuccessAlert}
		<Alert color="green" class="mb-4" dismissable on:close={() => (showSuccessAlert = false)}>
			<span class="font-medium">Success!</span>
			{alertMessage}
		</Alert>
	{/if}

	{#if showErrorAlert}
		<Alert color="red" class="mb-4" dismissable on:close={() => (showErrorAlert = false)}>
			<span class="font-medium">Error!</span>
			{alertMessage}
		</Alert>
	{/if}

	<!-- DataTable component wrapping the AdminTable -->
	<DataTable data={data.chatTemplates} meta={data.meta} {filterConfig}>
		<AdminTable data={data.chatTemplates} config={tableConfig} />
	</DataTable>
</Container>
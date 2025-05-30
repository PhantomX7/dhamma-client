<script>
	import { Button } from 'flowbite-svelte';
	import { PlusOutline } from 'flowbite-svelte-icons';
	import DataTable from '$lib/components/DataTable.svelte';
	import AdminTable from '$lib/components/AdminTable.svelte';
	import { FilterType } from '$lib/utils/filter';
	import { getContext } from 'svelte';
	import { Container } from '$lib/components/layout';
	import { hasPermission } from '$lib/utils/permissions';
	import { getChatTemplateTableConfig } from '$lib/utils/tableConfig/chatTemplate.js';
	import { createFormActionHandler, commonActions } from '$lib/utils/formActionHandler.js';

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

	// Alert state
	let showSuccessAlert = $state(false);
	let showErrorAlert = $state(false);
	let alertMessage = $state('');

	// Create form action handler
	const actionHandler = createFormActionHandler({
		setSuccessAlert: (value) => showSuccessAlert = value,
		setErrorAlert: (value) => showErrorAlert = value,
		setAlertMessage: (value) => alertMessage = value
	});

	// Create setDefault action
	const setDefault = actionHandler(commonActions.setDefault('template'));

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
<Container
	breadcrumb={[
		{ name: 'Dashboard', href: '/admin' },
		{ name: 'Chat Templates', href: '/admin/chat-template' }
	]}
	title="Chat Templates"
	{showSuccessAlert}
	{showErrorAlert}
	{alertMessage}
	onCloseSuccessAlert={() => (showSuccessAlert = false)}
	onCloseErrorAlert={() => (showErrorAlert = false)}
>
	{#snippet headerActions()}
		{#if hasPermission(currentUser(), 'chat-template/create')}
			<Button href="/admin/chat-template/add">
				<PlusOutline class="me-2 h-4 w-4" /> Add New Template
			</Button>
		{/if}
	{/snippet}

	<!-- DataTable component wrapping the AdminTable -->
	<DataTable data={data.chatTemplates} meta={data.meta} {filterConfig}>
		<AdminTable data={data.chatTemplates} config={tableConfig} />
	</DataTable>
</Container>
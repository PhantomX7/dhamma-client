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
	import { createSmartAction } from '$lib/utils/tableConfig/index.js';

	const currentUser = getContext('user');

	// Component props
	let { data } = $props();

	// Breadcrumb items definition
	const breadcrumbItems = $derived([{ label: 'Chat Templates', href: '/admin/chat-template' }]);

	// Configuration for the DataTable filter component
	const filterConfig = $derived({
		name: { type: FilterType.STRING, label: 'Name' },
		...(currentUser()?.is_super_admin && {
			domain_name: { type: FilterType.STRING, label: 'Domain Name' }
		}),
		description: { type: FilterType.STRING, label: 'Description' },
		is_default: { type: FilterType.BOOL, label: 'Default Template' },
		is_active: { type: FilterType.BOOL, label: 'Status Active' },
		created_at: { type: FilterType.DATE, label: 'Created Date' }
	});

	// Alert state
	let showSuccessAlert = $state(false);
	let showErrorAlert = $state(false);
	let alertMessage = $state('');

	// Create form action handler
	const actionHandler = createFormActionHandler({
		setSuccessAlert: (value) => (showSuccessAlert = value),
		setErrorAlert: (value) => (showErrorAlert = value),
		setAlertMessage: (value) => (alertMessage = value)
	});

	// Create setDefault action using the simplified approach
	const setDefault = actionHandler(commonActions.createTableAction('setDefault', 'template'));

	// Simplified table configuration
	const tableConfig = $derived({
		...getChatTemplateTableConfig(currentUser()?.is_super_admin),
		actions: [
			...getChatTemplateTableConfig(currentUser()?.is_super_admin).actions,
			createSmartAction('Set Default', 'green', null, 'chat-template/set-as-default', setDefault)
		]
	});
</script>

<!-- Use Container component -->
<Container
	breadcrumb={breadcrumbItems}
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

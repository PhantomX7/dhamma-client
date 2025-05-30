<script>
	import { Button } from 'flowbite-svelte';
	// Added icons for buttons
	import { PlusOutline } from 'flowbite-svelte-icons';
	import DataTable from '$lib/components/DataTable.svelte';
	import AdminTable from '$lib/components/AdminTable.svelte';
	import { FilterType } from '$lib/utils/filter';
	import { Container } from '$lib/components/layout';
	import { getDomainTableConfig } from '$lib/utils/tableConfig/domain.js';

	// Component props
	let { data } = $props();

	// Breadcrumb items definition
	const breadcrumbItems = $derived([{ label: 'Domains', href: '/admin/domain' }]);

	// Configuration for the DataTable filter component
	const filterConfig = $derived({
		id: {
			type: FilterType.ID,
			label: 'ID'
		},
		name: {
			type: FilterType.STRING,
			label: 'Name'
		},
		code: {
			type: FilterType.STRING,
			label: 'Code'
		},
		is_active: {
			type: FilterType.BOOL,
			label: 'Status Active'
		},
		created_at: {
			type: FilterType.DATE,
			label: 'Created Date'
		}
	});

	// Table configuration for domains
	const tableConfig = $derived(getDomainTableConfig());
</script>

<Container breadcrumb={breadcrumbItems} title="Domains">
	{#snippet headerActions()}
		<Button href="/admin/domain/add">
			<PlusOutline class="me-2 h-4 w-4" /> Add New Domain
		</Button>
	{/snippet}

	<!-- DataTable component wrapping the generic AdminTable -->
	<DataTable data={data.domains} meta={data.meta} {filterConfig}>
		<AdminTable data={data.domains} config={tableConfig} />
	</DataTable>
</Container>

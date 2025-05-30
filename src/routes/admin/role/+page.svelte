<script>
	import { Badge, Button } from 'flowbite-svelte';
	// Added icons
	import { PlusOutline } from 'flowbite-svelte-icons';
	import { formatDate } from '$lib/utils';
	import DataTable from '$lib/components/DataTable.svelte';
	import AdminTable from '$lib/components/AdminTable.svelte';
	import { Container } from '$lib/components/layout'; // Import Container
	import { getContext } from 'svelte';
	import { FilterType } from '$lib/utils/filter';
	import { getRoleTableConfig } from '$lib/utils/tableConfig/role.js';

	// Component props
	let { data } = $props();
	const currentUser = getContext('user');
	import { hasPermission } from '$lib/utils/permissions';

	// Breadcrumb items definition
	const breadcrumbItems = $derived([{ label: 'Roles', href: '/admin/role' }]);

	// Configuration for the DataTable filter component
	const filterConfig = $derived({
		...(currentUser().is_super_admin && {
			domain_name: {
				type: FilterType.STRING,
				label: 'Domain Name'
			}
		}),
		name: {
			type: FilterType.STRING,
			label: 'Role Name'
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

	// Table configuration
	const tableConfig = getRoleTableConfig(currentUser().is_super_admin);
</script>

<!-- Use Container component -->
<Container breadcrumb={breadcrumbItems} title="Roles">
	{#snippet headerActions()}
		<!-- Add Role button with icon -->
		{#if hasPermission(currentUser(), 'role/create')}
			<Button href="/admin/role/add">
				<PlusOutline class="me-2 h-4 w-4" /> Add New Role
			</Button>
		{/if}
	{/snippet}

	<!-- DataTable component wrapping the AdminTable -->
	<DataTable data={data.roles} meta={data.meta} {filterConfig}>
		<AdminTable data={data.roles} config={tableConfig} />
	</DataTable>
</Container>

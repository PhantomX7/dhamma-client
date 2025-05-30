<script>
	import { Badge, Button } from 'flowbite-svelte';
	// Added icons
	import { PlusOutline } from 'flowbite-svelte-icons';
	import { formatDate } from '$lib/utils';
	import DataTable from '$lib/components/DataTable.svelte';
	import AdminTable from '$lib/components/AdminTable.svelte';
	import { getContext } from 'svelte';
	import { Container } from '$lib/components/layout'; // Import Container
	import { FilterType } from '$lib/utils/filter';
	import { getPermissionTableConfig } from '$lib/utils/tableConfig/permission.js';

	// Component props
	let { data } = $props();
	// Get current user context (not used directly here, but kept for consistency)
	const currentUser = getContext('user');

	// Breadcrumb items definition
	const breadcrumbItems = $derived([{ label: 'Permissions', href: '/admin/permission' }]);

	// Configuration for the DataTable filter component
	// Use $derived for reactive configuration if it depends on other reactive state,
	// or keep as const if static. For consistency with other refactored files, using $derived.
	const filterConfig = $derived({
		name: {
			type: FilterType.STRING,
			label: 'Name'
		},
		code: {
			type: FilterType.STRING,
			label: 'Code'
		},
		type: {
			type: FilterType.ENUM,
			label: 'Type',
			enumValues: ['API', 'WEB']
		}
		// Add other relevant filters like 'object', 'action', 'is_domain_specific' if needed.
	});

	// Table configuration
	const tableConfig = getPermissionTableConfig(currentUser().is_super_admin);
</script>

<!-- Use Container component -->
<Container breadcrumb={breadcrumbItems} title="Permissions">
	{#snippet headerActions()}
		<!-- Add Permission button with icon -->
		<Button href="/admin/permission/add">
			<PlusOutline class="me-2 h-4 w-4" /> Add New Permission
		</Button>
	{/snippet}

	<!-- DataTable component wrapping the AdminTable -->
	<DataTable data={data.permissions} meta={data.meta} {filterConfig}>
		<AdminTable data={data.permissions} config={tableConfig} />
	</DataTable>
</Container>

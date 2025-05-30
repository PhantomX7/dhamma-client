<script>
	import { Button } from 'flowbite-svelte';
	// Added icons
	import { PlusOutline } from 'flowbite-svelte-icons';
	import { getContext } from 'svelte';
	import DataTable from '$lib/components/DataTable.svelte';
	import AdminTable from '$lib/components/AdminTable.svelte';
	import { FilterType } from '$lib/utils/filter';
	import { Container } from '$lib/components/layout';
	import { hasPermission } from '$lib/utils/permissions';
	import { getUserTableConfig } from '$lib/utils/tableConfig/user.js';

	// Component props
	let { data } = $props();
	// Get current user context (assuming it provides user details like is_super_admin)
	const currentUser = getContext('user');

	// Breadcrumb items definition
	const breadcrumbItems = $derived([{ label: 'Users', href: '/admin/user' }]);

	// Configuration for the DataTable filter component
	const filterConfig = $derived({
		username: {
			type: FilterType.STRING,
			label: 'Username'
		},
		is_active: {
			type: FilterType.BOOL,
			label: 'Status Active'
		},
		created_at: {
			type: FilterType.DATE,
			label: 'Created Date'
		}
		// Add other relevant filters like 'is_super_admin' if needed
	});

	// Table configuration
	const tableConfig = $derived(getUserTableConfig(currentUser()?.is_super_admin));
</script>

<!-- Main page container with Container component -->
<Container breadcrumb={breadcrumbItems} title="Users">
	{#snippet headerActions()}
		<!-- Add User button with icon and link -->
		{#if hasPermission(currentUser(), 'user/create')}
			<Button href="/admin/user/add">
				<PlusOutline class="me-2 h-4 w-4" /> Add User
			</Button>
		{/if}
	{/snippet}

	<!-- DataTable component wrapping the AdminTable -->
	<DataTable data={data.users} meta={data.meta} {filterConfig}>
		<AdminTable data={data.users} config={tableConfig} />
	</DataTable>
</Container>

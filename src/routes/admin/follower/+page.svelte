<script>
	import { Button } from 'flowbite-svelte';
	import { PlusOutline } from 'flowbite-svelte-icons';
	import DataTable from '$lib/components/DataTable.svelte';
	import AdminTable from '$lib/components/AdminTable.svelte';
	import { FilterType } from '$lib/utils/filter';
	import { getContext } from 'svelte';
	import { Container } from '$lib/components/layout';
	import { hasPermission } from '$lib/utils/permissions';
	import { getFollowerTableConfig } from '$lib/utils/tableConfig/follower.js';

	const currentUser = getContext('user');

	// Component props
	let { data } = $props();

	// Breadcrumb items definition
	const breadcrumbItems = $derived([{ label: 'Followers', href: '/admin/follower' }]);

	// Configuration for the DataTable filter component
	const filterConfig = $derived({
		name: {
			type: FilterType.STRING,
			label: 'Name'
		},
		...(currentUser()?.is_super_admin && { // Conditionally add domain_name filter for super admins
			domain_name: {
				type: FilterType.STRING,
				label: 'Domain Name'
			}
		}),
		phone: {
			type: FilterType.STRING,
			label: 'Phone'
		},
		is_youth: {
			type: FilterType.BOOL,
			label: 'Muda Mudi'
		},
		created_at: {
			type: FilterType.DATE,
			label: 'Created Date'
		}
	});

	// Table configuration
	const tableConfig = $derived(getFollowerTableConfig(currentUser()?.is_super_admin));
</script>

<!-- Use Container component -->
<Container breadcrumb={breadcrumbItems} title="Followers">
	{#snippet headerActions()}
		{#if hasPermission(currentUser(), 'follower/create')}
			<Button href="/admin/follower/add">
				<PlusOutline class="me-2 h-4 w-4" /> Add Follower
			</Button>
		{/if}
	{/snippet}

	<!-- DataTable component wrapping the AdminTable -->
	<DataTable data={data.followers} meta={data.meta} {filterConfig}>
		<AdminTable data={data.followers} config={tableConfig} />
	</DataTable>
</Container>

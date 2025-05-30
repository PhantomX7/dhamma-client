<script>
	import { Button } from 'flowbite-svelte';
	import { PlusOutline } from 'flowbite-svelte-icons';
	import DataTable from '$lib/components/DataTable.svelte';
	import AdminTable from '$lib/components/AdminTable.svelte';
	import { FilterType } from '$lib/utils/filter';
	import { Container } from '$lib/components/layout';
	import { hasPermission } from '$lib/utils/permissions';
	import { getContext } from 'svelte';
	import { getEventTableConfig } from '$lib/utils/tableConfig/event.js';

	const currentUser = getContext('user');

	// Component props
	let { data } = $props(); // Contains events and meta from load function

	// Breadcrumb items definition
	const breadcrumbItems = $derived([{ label: 'Events', href: '/admin/event' }]);

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
		points_awarded: {
			type: FilterType.NUMBER,
			label: 'Points Awarded'
		},
		created_at: {
			type: FilterType.DATE,
			label: 'Created Date'
		}
	});

	// Table configuration
	const tableConfig = $derived(getEventTableConfig(currentUser()?.is_super_admin));
</script>

<!-- Use Container component -->
<Container breadcrumb={breadcrumbItems} title="Events">
	{#snippet headerActions()}
		{#if hasPermission(currentUser(), 'event/create')}
			<Button href="/admin/event/add">
				<PlusOutline class="me-2 h-4 w-4" /> Add Event
			</Button>
		{/if}
	{/snippet}

	<!-- DataTable component wrapping the AdminTable -->
	<DataTable data={data.events} meta={data.meta} {filterConfig}>
		<AdminTable data={data.events} config={tableConfig} />
	</DataTable>
</Container>
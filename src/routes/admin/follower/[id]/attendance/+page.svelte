<script>
	import { Button, Card, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
	import { ArrowLeftOutline } from 'flowbite-svelte-icons';
	import { formatDateTime } from '$lib/utils';
	import { Container } from '$lib/components/layout'; // Import Container
	import DataTable from '$lib/components/DataTable.svelte';
	import { FilterType } from '$lib/utils/filter';

	// Component props
	let { data } = $props();
	const follower = $derived(data.follower);
	const attendanceList = $derived(data.attendances);

	// Breadcrumb items
	const breadcrumbItems = $derived([
		{ href: '/admin/follower', label: 'Followers' },
		{
			href: `/admin/follower/${follower?.id}`,
			label: follower?.name || `Follower ${follower?.id}`
		},
		{ label: 'Attendance' }
	]);

	// Filter configuration for the DataTable
	const filterConfig = $derived({
		event_name: {
			type: FilterType.STRING,
			label: 'Event Name'
		},
		created_at: {
			type: FilterType.DATE,
			label: 'Attended At'
		}
	});
</script>

<!-- Use Container component -->
<Container
	breadcrumb={breadcrumbItems}
	title={`Attendance for: ${follower?.name || 'Follower'}`}
>
	{#snippet headerActions()}
		{#if follower?.id}
			<Button color="alternative" href={`/admin/follower/${follower?.id}`}>
				<ArrowLeftOutline class="me-2 h-4 w-4" /> Back to Follower Details
			</Button>
		{/if}
	{/snippet}

	<Card size="xl" class="mb-8 p-4">
		<h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Attendance List</h2>

		<DataTable data={attendanceList} meta={data.meta} {filterConfig}>
			{#if attendanceList && attendanceList.length > 0}
				<Table hoverable={true} class="w-full">
				<TableHead>
					<TableHeadCell>Event Name</TableHeadCell>
					<TableHeadCell>Attended Time</TableHeadCell>
				</TableHead>
				<TableBody class="divide-y divide-gray-200 dark:divide-gray-700">
					{#each attendanceList as attendance (attendance.id)}
						<TableBodyRow>
							<TableBodyCell class="font-medium text-gray-900 dark:text-white">
								{attendance.event?.name || 'Unknown'}
							</TableBodyCell>
							<TableBodyCell>
								{formatDateTime(attendance.attended_at)}
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				</TableBody>
				</Table>
			{:else}
				<div class="p-4 text-center text-gray-500 dark:text-gray-400">
					No attendance records found for this follower.
				</div>
			{/if}
		</DataTable>
	</Card>
</Container>
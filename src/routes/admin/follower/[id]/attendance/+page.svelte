<script>
	import { Button, Card, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
	import { ArrowLeftOutline } from 'flowbite-svelte-icons';
	import { formatDateTime } from '$lib/utils';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
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
			href: `/admin/follower/${data.follower?.id}`,
			label: data.follower?.name || `Follower ${data.follower?.id}`
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

<div class="min-h-screen p-4 md:p-6 dark:bg-gray-900">
	<Breadcrumb class="mb-6" items={breadcrumbItems} />

	<div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">
			Attendance for: {follower?.name || 'Follower'}
		</h1>
		{#if follower?.id}
			<Button color="alternative" href={`/admin/follower/${follower.id}`}>
				<ArrowLeftOutline class="me-2 h-4 w-4" />
				Back to Follower Details
			</Button>
		{/if}
	</div>

	<Card padding="lg" size="xl" class="mb-8">
		<h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Attendance List</h2>
		
		<DataTable data={attendanceList} meta={data.meta} {filterConfig}>
		{#if attendanceList && attendanceList.length > 0}
			<Table hoverable={true} class="w-full">
				<TableHead>
					<TableHeadCell>Event Name</TableHeadCell>
					<TableHeadCell>Attended Time</TableHeadCell>
				</TableHead>
				<TableBody class="divide-y">
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
</div>
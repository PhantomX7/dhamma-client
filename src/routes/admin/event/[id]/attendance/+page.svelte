<script>
	import {
		Button,
		Card,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { ArrowLeftOutline } from 'flowbite-svelte-icons';
	import { formatDateTime } from '$lib/utils';
	import { Container } from '$lib/components/layout';
	import DataTable from '$lib/components/DataTable.svelte';
	import { FilterType } from '$lib/utils/filter';

	// Component props
	let { data } = $props();
	const event = $derived(data.event);
	const attendanceList = $derived(data.attendances);

	// Breadcrumb items
	const breadcrumbItems = $derived([
		{ href: '/admin/event', label: 'Events' },
		{
			href: `/admin/event/${event.id}`, // Use derived eventId
			label: event?.name || `Event ${event.id}` // Use derived event and eventId
		},
		{ label: 'Attendance' }
	]);

	const filterConfig = $derived({
		follower_name: {
			type: FilterType.STRING,
			label: 'Follower Name'
		},
		created_at: {
			type: FilterType.DATE,
			label: 'Attended At'
		}
	});
</script>

<Container breadcrumb={breadcrumbItems} title={`Attendance for: ${event?.name || 'Event'}`}>
	{#snippet headerActions()}
		<Button color="alternative" href={`/admin/event/${event.id}`}>
			<ArrowLeftOutline class="me-2 h-4 w-4" />
			Back to Event Details
		</Button>
	{/snippet}

	<Card size="xl" class="mb-8 p-4">
		<h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Attendance List</h2>
		<DataTable data={attendanceList} meta={data.meta} {filterConfig}>
			{#if attendanceList && attendanceList.length > 0}
				<Table hoverable={true} class="w-full">
					<TableHead>
						<TableHeadCell>Follower Name</TableHeadCell>
						<TableHeadCell>Attended Time</TableHeadCell>
					</TableHead>
					<TableBody class="divide-y">
						{#each attendanceList as attendance (attendance.id)}
							<TableBodyRow>
								<TableBodyCell class="font-medium text-gray-900 dark:text-white">
									{attendance.follower?.name || 'Unknown'}
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
					No attendance records found for this event.
				</div>
			{/if}
		</DataTable>
	</Card>
</Container>

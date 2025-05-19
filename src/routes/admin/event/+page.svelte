<script>
	import {
		Button,
		Table,
		TableBody,
		TableBodyRow,
		TableBodyCell,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { PlusOutline, EyeOutline, EditOutline } from 'flowbite-svelte-icons';
	import { formatDate } from '$lib/utils';
	import DataTable from '$lib/components/DataTable.svelte';
	import { FilterType } from '$lib/utils/filter';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { getContext } from 'svelte';

	const currentUser = getContext('user');

	// Component props
	let { data } = $props(); // Contains events and meta from load function

	// Breadcrumb items definition
	const breadcrumbItems = $derived([{ label: 'Events' }]);

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
</script>

<!-- Main page container -->
<div class="min-h-screen p-4 md:p-6 dark:bg-gray-900">
	<!-- Breadcrumb navigation -->
	<Breadcrumb class="mb-6" items={breadcrumbItems} />

	<!-- Page header -->
	<div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Events</h1>
		<Button href="/admin/event/add">
			<PlusOutline class="me-2 h-4 w-4" /> Add Event
		</Button>
	</div>

	<!-- DataTable component -->
	<DataTable data={data.events} meta={data.meta} {filterConfig}>
		<Table hoverable={true} shadow divClass="relative max-h-[70vh] overflow-x-auto overflow-y-auto">
			<TableHead
				class="sticky top-0 z-10 bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400"
			>
				<TableHeadCell>ID</TableHeadCell>
				{#if currentUser()?.is_super_admin}
					<TableHeadCell>Domain</TableHeadCell>
				{/if}
				<TableHeadCell>Name</TableHeadCell>
				<TableHeadCell>Points Awarded</TableHeadCell>
				<TableHeadCell>Created At</TableHeadCell>
				<TableHeadCell>Actions</TableHeadCell>
			</TableHead>
			<TableBody class="divide-y divide-gray-200 dark:divide-gray-700">
				{#each data.events as event (event.id)}
					<TableBodyRow class="bg-white dark:bg-gray-800">
						<TableBodyCell
							class="px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white"
							>{event.id}</TableBodyCell
						>
						{#if currentUser()?.is_super_admin}
							<TableBodyCell>{event.domain?.name || 'N/A'}</TableBodyCell>
						{/if}
						<TableBodyCell>{event.name}</TableBodyCell>
						<TableBodyCell>{event.points_awarded}</TableBodyCell>
						<TableBodyCell>{formatDate(event.created_at)}</TableBodyCell>
						<TableBodyCell class="flex space-x-2">
							<Button
								size="sm"
								color="alternative"
								href={`/admin/event/${event.id}`}
								aria-label="View event"
							>
								<EyeOutline class="h-4 w-4" />
							</Button>
							<Button
								size="sm"
								color="blue"
								href={`/admin/event/${event.id}/edit`}
								aria-label="Edit event"
							>
								<EditOutline class="h-4 w-4" />
							</Button>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</DataTable>
</div>
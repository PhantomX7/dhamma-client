<script>
	import {
		Button,
		Badge,
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
	let { data } = $props();

	// Breadcrumb items definition
	const breadcrumbItems = [{ label: 'Followers' }];

	// Configuration for the DataTable filter component
	const filterConfig = {
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
	};
</script>

<!-- Main page container -->
<div class="min-h-screen p-4 md:p-6 dark:bg-gray-900">
	<!-- Breadcrumb navigation -->
	<Breadcrumb class="mb-6" items={breadcrumbItems} />

	<!-- Page header -->
	<div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Followers</h1>
		<Button href="/admin/follower/add">
			<PlusOutline class="me-2 h-4 w-4" /> Add Follower
		</Button>
	</div>

	<!-- DataTable component -->
	<DataTable data={data.followers} meta={data.meta} {filterConfig}>
		<Table hoverable={true} shadow divClass="relative max-h-[70vh] overflow-x-auto overflow-y-auto">
			<TableHead
				class="sticky top-0 z-10 bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400"
			>
				<TableHeadCell>ID</TableHeadCell>
				{#if currentUser().is_super_admin}
					<TableHeadCell>Domain</TableHeadCell>
				{/if}
				<TableHeadCell>Name</TableHeadCell>
				<TableHeadCell>Phone</TableHeadCell>
				<TableHeadCell>Points</TableHeadCell>
				<TableHeadCell>Blood Donor</TableHeadCell>
				<TableHeadCell>Muda Mudi</TableHeadCell>
				<TableHeadCell>Created At</TableHeadCell>
				<TableHeadCell>Actions</TableHeadCell>
			</TableHead>
			<TableBody class="divide-y divide-gray-200 dark:divide-gray-700">
				{#each data.followers as follower (follower.id)}
					<TableBodyRow class="bg-white dark:bg-gray-800">
						<TableBodyCell
							class="px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white"
							>{follower.id}</TableBodyCell
						>
						<TableBodyCell>{follower.domain.name}</TableBodyCell>
						<TableBodyCell>{follower.name}</TableBodyCell>
						<TableBodyCell>{follower.phone || 'N/A'}</TableBodyCell>
						<TableBodyCell>{follower.points}</TableBodyCell>
						<TableBodyCell>
							<Badge large rounded color={follower.is_blood_donor ? 'green' : 'red'}>
								{follower.is_blood_donor ? 'Yes' : 'No'}
							</Badge>
						</TableBodyCell>
						<TableBodyCell>
							<Badge large rounded color={follower.is_youth ? 'green' : 'red'}>
								{follower.is_youth ? 'Yes' : 'No'}
							</Badge>
						</TableBodyCell>
						<TableBodyCell>{formatDate(follower.created_at)}</TableBodyCell>
						<TableBodyCell>
							<div class="flex space-x-2">
								<Button size="xs" color="alternative" href="/admin/follower/{follower.id}">
									<EyeOutline class="me-1.5 h-3.5 w-3.5" /> View
								</Button>
								<Button size="xs" color="primary" href="/admin/follower/{follower.id}/edit">
									<EditOutline class="me-1.5 h-3.5 w-3.5" /> Edit
								</Button>
							</div>
						</TableBodyCell>
					</TableBodyRow>
				{:else}
					<TableBodyRow>
						<TableBodyCell colspan="9" class="text-center">No followers found.</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</DataTable>
</div>

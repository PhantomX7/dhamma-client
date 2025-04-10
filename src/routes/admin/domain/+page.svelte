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
	import { getContext } from 'svelte';
	import { formatDate } from '$lib/utils';
	import DataTable from '$lib/components/DataTable.svelte';
	import { FilterType } from '$lib/utils/filter';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	let { data } = $props();

	const breadcrumbItems = [
		{ label: 'Domains' }
	];

	const filterConfig = {
		id: {
			type: FilterType.ID,
			label: 'ID'
		},
		name: {
			type: FilterType.STRING,
			label: 'Name'
		},
		code: {
			type: FilterType.STRING,
			label: 'Code'
		},
		is_active: {
			type: FilterType.BOOL,
			label: 'Status Active'
		},
		created_at: {
			type: FilterType.DATE,
			label: 'Created Date'
		}
	};
</script>

<div class="p-4">
	<Breadcrumb items={breadcrumbItems} />
	
	<div class="mb-4 flex items-center justify-between">
		<h2 class="text-xl font-bold">Domains</h2>
		<Button color="blue">Add Domain</Button>
	</div>

	<DataTable data={data.domains} meta={data.meta} {filterConfig}>
		<Table hoverable={true} divClass="max-h-[70vh] overflow-y-auto">
			<TableHead class="sticky top-0 z-10 bg-white shadow-sm">
				<TableHeadCell>ID</TableHeadCell>
				<TableHeadCell>Name</TableHeadCell>
				<TableHeadCell>Code</TableHeadCell>
				<TableHeadCell>Status</TableHeadCell>
				<TableHeadCell>Description</TableHeadCell>
				<TableHeadCell>Created At</TableHeadCell>
				<TableHeadCell>Actions</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each data.domains as domain}
					<TableBodyRow>
						<TableBodyCell>{domain.id}</TableBodyCell>
						<TableBodyCell>{domain.name}</TableBodyCell>
						<TableBodyCell>{domain.code}</TableBodyCell>
						<TableBodyCell>
							<Badge rounded color={domain.is_active ? 'green' : 'red'}>
								{domain.is_active ? 'Active' : 'Inactive'}
							</Badge>
						</TableBodyCell>
						<TableBodyCell>{domain.description}</TableBodyCell>
						<TableBodyCell>{formatDate(domain.created_at)}</TableBodyCell>
						<TableBodyCell>
							<div class="flex gap-2">
								<Button size="xs" color="green" href="/admin/domain/{domain.id}">View</Button>
								<Button size="xs" color="blue" href="/admin/domain/{domain.id}/edit">Edit</Button>
							</div>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</DataTable>
</div>

<script>
	import { Badge, Button } from 'flowbite-svelte';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { formatDate } from '$lib/utils';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import DataTable from '$lib/components/DataTable.svelte';
	import { getContext } from 'svelte';
	import { FilterType } from '$lib/utils/filter';

	let { data } = $props();
	const currentUser = getContext('user');

	const breadcrumbItems = [{ label: 'Roles' }];

	const filterConfig = {
		name: {
			type: FilterType.STRING,
			label: 'Name'
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

	<div class="mb-6 flex items-center justify-between">
		<h2 class="text-xl font-bold">Roles</h2>
		<div class="flex gap-2">
			<Button href="/admin/role/add">Add New Role</Button>
		</div>
	</div>

	<DataTable data={data.roles} meta={data.meta} {filterConfig}>
		<Table>
			<TableHead>
				<TableHeadCell>ID</TableHeadCell>
				<TableHeadCell>Name</TableHeadCell>
				<TableHeadCell>Description</TableHeadCell>
				<TableHeadCell>Active</TableHeadCell>
				<TableHeadCell>Created At</TableHeadCell>
				<TableHeadCell>Actions</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each data.roles as role}
					<TableBodyRow>
						<TableBodyCell>{role.id}</TableBodyCell>
						<TableBodyCell>{role.name}</TableBodyCell>
						<TableBodyCell>{role.description || '-'}</TableBodyCell>
						<TableBodyCell>
							<Badge rounded color={role.is_active ? 'blue' : 'gray'}>
								{role.is_active ? 'Yes' : 'No'}
							</Badge>
						</TableBodyCell>
						<TableBodyCell>{formatDate(role.created_at)}</TableBodyCell>
						<TableBodyCell>
							<div class="flex gap-2">
								<Button size="xs" color="green" href="/admin/role/{role.id}"
									>View</Button
								>
								<Button
									size="xs"
									class="bg-primary-600 hover:bg-primary-700 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
									href="/admin/role/{role.id}/edit">Edit</Button
								>
							</div>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</DataTable>
</div>
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

	const breadcrumbItems = [{ label: 'Permissions' }];

	const filterConfig = {
		name: {
			type: FilterType.STRING,
			label: 'Name'
		},
		code: {
			type: FilterType.STRING,
			label: 'Code'
		},
		type: {
			type: FilterType.ENUM,
			label: 'Type',
			enumValues: ['API', 'WEB']
		}
	};
</script>

<div class="p-4">
	<Breadcrumb items={breadcrumbItems} />

	<div class="mb-6 flex items-center justify-between">
		<h2 class="text-xl font-bold">Permissions</h2>
		<div class="flex gap-2">
			<Button href="/admin/permission/add">Add New Permission</Button>
		</div>
	</div>

	<DataTable data={data.permissions} meta={data.meta} {filterConfig}>
		<Table hoverable={true} divClass="max-h-[70vh] overflow-y-auto">
			<TableHead class="sticky top-0 z-10 shadow-sm">
				<TableHeadCell>ID</TableHeadCell>
				<TableHeadCell>Name</TableHeadCell>
				<TableHeadCell>Code</TableHeadCell>
				<TableHeadCell>Object</TableHeadCell>
				<TableHeadCell>Action</TableHeadCell>
				<TableHeadCell>Type</TableHeadCell>
				<TableHeadCell>Domain Specific</TableHeadCell>
				<TableHeadCell>Created At</TableHeadCell>
				<TableHeadCell>Actions</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each data.permissions as permission}
					<TableBodyRow>
						<TableBodyCell>{permission.id}</TableBodyCell>
						<TableBodyCell>{permission.name}</TableBodyCell>
						<TableBodyCell>{permission.code}</TableBodyCell>
						<TableBodyCell>{permission.object}</TableBodyCell>
						<TableBodyCell>{permission.action}</TableBodyCell>
						<TableBodyCell>{permission.type}</TableBodyCell>
						<TableBodyCell>
							<Badge rounded color={permission.is_domain_specific ? 'blue' : 'gray'}>
								{permission.is_domain_specific ? 'Yes' : 'No'}
							</Badge>
						</TableBodyCell>
						<TableBodyCell>{formatDate(permission.created_at)}</TableBodyCell>
						<TableBodyCell>
							<div class="flex gap-2">
								<Button size="xs" color="green" href="/admin/permission/{permission.id}"
									>View</Button
								>
								<Button
									size="xs"
									class="bg-primary-600 hover:bg-primary-700 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
									href="/admin/permission/{permission.id}/edit">Edit</Button
								>
							</div>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</DataTable>
</div>

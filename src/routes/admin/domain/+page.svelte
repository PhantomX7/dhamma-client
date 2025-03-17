<script>
	import {
		Card,
		Button,
		Badge,
		Table,
		TableBody,
		TableBodyRow,
		TableBodyCell,
		TableHead,
		TableHeadCell,
		TableSearch,
		Pagination
	} from 'flowbite-svelte';

	let { data } = $props();
	
	import { formatDate } from '$lib/utils';
</script>

<div class="p-4">
	<div class="mb-4 flex items-center justify-between">
		<h2 class="text-xl font-bold">Domains</h2>
		<Button color="blue">Add Domain</Button>
	</div>

	<Table striped={true}>
		<TableHead>
			<TableHeadCell>Name</TableHeadCell>
			<TableHeadCell>Code</TableHeadCell>
			<TableHeadCell>Status</TableHeadCell>
			<TableHeadCell>Created At</TableHeadCell>
			<TableHeadCell>Updated At</TableHeadCell>
			<TableHeadCell>Actions</TableHeadCell>
		</TableHead>
		<TableBody>
			{#each data.domains as domain}
				<TableBodyRow>
					<TableBodyCell>{domain.name}</TableBodyCell>
					<TableBodyCell>{domain.code}</TableBodyCell>
					<TableBodyCell>
						<Badge rounded color={domain.is_active ? 'green' : 'red'}
							>{domain.is_active ? 'Active' : 'Inactive'}</Badge
						>
					</TableBodyCell>
					<TableBodyCell>{formatDate(domain.created_at)}</TableBodyCell>
					<TableBodyCell>{formatDate(domain.updated_at)}</TableBodyCell>
					<TableBodyCell>
						<div class="flex gap-2">
							<Button size="xs" color="blue">Edit</Button>
							<Button size="xs" color="red">Delete</Button>
						</div>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>

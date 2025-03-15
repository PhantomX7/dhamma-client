<script>
	import {
		Card,
		Button,
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

	// State declarations
	let currentPage = $state(1);
	let pageSize = $state(10);
	let totalPages = $state(0);
	let filteredDomains = $state([]);
	let paginatedDomains = $state([]);
	let searchTerm = $state('');

	$effect(() => {
		totalPages = Math.ceil(data.domains.length / pageSize);
	});

	$effect(() => {
		filteredDomains = data.domains.filter(
			(domain) =>
				domain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				domain.code.toLowerCase().includes(searchTerm.toLowerCase())
		);
	});

	$effect(() => {
		paginatedDomains = filteredDomains.slice((currentPage - 1) * pageSize, currentPage * pageSize);
	});

	// Format date
	function formatDate(dateString) {
		return new Date(dateString).toLocaleDateString();
	}
</script>

<div class="p-4">
	<Card>
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-xl font-bold">Domains</h2>
			<Button color="blue">Add Domain</Button>
		</div>

		<TableSearch bind:searchTerm placeholder="Search domains..." />

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
				{#each paginatedDomains as domain}
					<TableBodyRow>
						<TableBodyCell>{domain.name}</TableBodyCell>
						<TableBodyCell>{domain.code}</TableBodyCell>
						<TableBodyCell>
							<span class={domain.is_active ? 'text-green-600' : 'text-red-600'}>
								{domain.is_active ? 'Active' : 'Inactive'}
							</span>
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

		<div class="mt-4 flex justify-center">
			<Pagination {totalPages} bind:currentPage showPrevNext={true} activeClass="bg-blue-600" />
		</div>
	</Card>
</div>

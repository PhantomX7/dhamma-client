<script>
	import {
		Button,
		Checkbox,
		Table,
		TableBody,
		TableBodyRow,
		TableBodyCell,
		TableHead,
		TableHeadCell,
		Badge,
		Modal,
		Search,
		Spinner
	} from 'flowbite-svelte';

	let {
		open =  $bindable(false),
		allDomains = [],
		userDomainIds = new Set(),
		selectedDomains = new Set(),
		userId
	} = $props();

	let searchTerm = $state('');
	let isSearching = $state(false);

	// Derived state for search results
	let searchResults = $derived(
		isSearching ? [] : 
		searchTerm.trim() === '' 
			? allDomains.filter(d => !userDomainIds.has(d.id))
			: allDomains.filter(d => 
				!userDomainIds.has(d.id) && 
				(d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
				d.code.toLowerCase().includes(searchTerm.toLowerCase()))
			)
	);

	$effect(() => {
		if (open) {
			searchTerm = '';
		}
	});

	function toggleDomain(domainId) {
		selectedDomains.has(domainId) 
			? selectedDomains.delete(domainId)
			: selectedDomains.add(domainId);
	}
	
	function handleSearch() {
		isSearching = true;
		setTimeout(() => isSearching = false, 300);
	}
</script>

<!-- Template remains exactly the same -->
<Modal bind:open size="lg" title="Add Domains" autoclose>
	<div class="mb-4">
		<Search bind:value={searchTerm} on:input={handleSearch} placeholder="Search domains by name or code..." />
	</div>
	
	{#if isSearching}
		<div class="flex justify-center py-8">
			<Spinner size="8" />
		</div>
	{:else if searchResults.length === 0}
		<div class="py-8 text-center text-gray-500">
			No domains found matching your search.
		</div>
	{:else}
		<Table hoverable={true}>
			<TableHead>
				<TableHeadCell class="w-4">
					<Checkbox />
				</TableHeadCell>
				<TableHeadCell>Name</TableHeadCell>
				<TableHeadCell>Code</TableHeadCell>
				<TableHeadCell>Status</TableHeadCell>
				<TableHeadCell>Action</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each searchResults as domain}
					<TableBodyRow>
						<TableBodyCell class="w-4">
							<Checkbox
								on:change={() => toggleDomain(domain.id)}
								checked={selectedDomains.has(domain.id)}
							/>
						</TableBodyCell>
						<TableBodyCell>{domain.name}</TableBodyCell>
						<TableBodyCell>{domain.code}</TableBodyCell>
						<TableBodyCell>
							<Badge color={domain.is_active ? 'green' : 'red'}>
								{domain.is_active ? 'Active' : 'Inactive'}
							</Badge>
						</TableBodyCell>
						<TableBodyCell>
							<form method="POST" action="?/addDomain">
								<input type="hidden" name="domain_id" value={domain.id} />
								<Button type="submit" size="xs" color="green">Add</Button>
							</form>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	{/if}
	
	<svelte:fragment slot="footer">
		<div class="flex w-full justify-between">
			<Button color="alternative" on:click={() => open = false}>Cancel</Button>
			{#if selectedDomains.size > 0}
				<form method="POST" action="?/addMultipleDomains">
					{#each [...selectedDomains] as domainId}
						<input type="hidden" name="domain_ids" value={domainId} />
					{/each}
					<Button type="submit" color="green">Add Selected ({selectedDomains.size})</Button>
				</form>
			{/if}
		</div>
	</svelte:fragment>
</Modal>
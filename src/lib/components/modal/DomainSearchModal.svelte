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
	// Remove api import since we'll use default fetch
	import { runPromise } from '$lib/utils';

	let {
		open = $bindable(false),
		userDomainIds = new Set(),
		selectedDomains = new Set(),
		userId
	} = $props();

	let searchTerm = $state('');
	let isSearching = $state(false);
	let searchResults = $state([]);
	let error = $state(null);

	$effect(() => {
		if (open) {
			searchTerm = '';
			fetchDomains();
		}
	});

	async function fetchDomains(search = '') {
		isSearching = true;
		error = null;

		// Build query parameters for server-side filtering
		const params = new URLSearchParams();
		params.set('limit', '20');
		
		if (search) {
			params.set('code', search);
		}

		try {
			// Use default fetch instead of api.fetch
			const response = await fetch(`/api/domain?${params.toString()}`);

			if (!response.ok) {
				throw new Error('Failed to load domains');
			}

			const data = await response.json();
			searchResults = data.data;
		} catch (err) {
			console.error('Failed to fetch domains:', err);
			error = 'Failed to load domains. Please try again.';
			searchResults = [];
		}

		isSearching = false;
	}

	function handleSearch() {
		fetchDomains(searchTerm);
	}

	function toggleDomain(domainId) {
		selectedDomains.has(domainId) 
			? selectedDomains.delete(domainId)
			: selectedDomains.add(domainId);
	}
</script>

<Modal bind:open size="lg" title="Add Domains" autoclose>
	<div class="mb-4">
		<Search 
			bind:value={searchTerm} 
			on:input={() => {
				// Debounce search input
				clearTimeout(window.searchTimeout);
				window.searchTimeout = setTimeout(handleSearch, 500);
			}}
			placeholder="Search domains by name or code..." 
		/>
	</div>
	
	{#if isSearching}
		<div class="flex justify-center py-8">
			<Spinner size="8" />
		</div>
	{:else if error}
		<div class="py-8 text-center text-red-500">
			{error}
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
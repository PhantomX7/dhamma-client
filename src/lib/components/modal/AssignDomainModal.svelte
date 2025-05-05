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
	import { enhance } from '$app/forms';

	let {
		open = $bindable(false),
		userDomainIds = new Set(),
		userId,
		handleSubmit = () => {}
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

		const params = new URLSearchParams();
		params.set('limit', '20');
		if (search) params.set('code', `like:${search}`);

		try {
			const response = await fetch(`/api/domain?${params.toString()}`);
			if (!response.ok) throw new Error('Failed to load domains');

			// Filter out domains that the user already has
			const allDomains = (await response.json()).data;
			searchResults = allDomains.filter((domain) => !userDomainIds.has(domain.id));
		} catch (err) {
			console.error('Failed to fetch domains:', err);
			error = 'Failed to load domains. Please try again.';
			searchResults = [];
		} finally {
			isSearching = false;
		}
	}

	function handleSearch() {
		clearTimeout(window.searchTimeout);
		window.searchTimeout = setTimeout(() => fetchDomains(searchTerm), 500);
	}
</script>

<Modal bind:open size="lg" title="Add Domains" autoclose={false}>
	<div class="mb-4">
		<Search
			bind:value={searchTerm}
			on:input={handleSearch}
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
			No domains found matching your search or all domains are already assigned to this user.
		</div>
	{:else}
		<Table hoverable>
			<TableHead>
				<TableHeadCell>Name</TableHeadCell>
				<TableHeadCell>Code</TableHeadCell>
				<TableHeadCell>Status</TableHeadCell>
				<TableHeadCell>Action</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each searchResults as domain}
					<TableBodyRow>
						<TableBodyCell>{domain.name}</TableBodyCell>
						<TableBodyCell>{domain.code}</TableBodyCell>
						<TableBodyCell>
							<Badge color={domain.is_active ? 'green' : 'red'}>
								{domain.is_active ? 'Active' : 'Inactive'}
							</Badge>
						</TableBodyCell>
						<!-- In the table body cell -->
						<TableBodyCell>
							<form method="POST" action="?/addDomain" use:enhance={handleSubmit}>
								<input type="hidden" name="domain_id" value={domain.id} />
								<Button class="cursor-pointer" type="submit" size="xs" color="green">Add</Button>
							</form>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	{/if}

	<svelte:fragment slot="footer">
		<Button class="cursor-pointer" color="alternative" on:click={() => (open = false)}
			>Cancel</Button
		>
	</svelte:fragment>
</Modal>

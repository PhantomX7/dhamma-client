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

<Modal bind:open size="lg" title="Add Domains" autoclose={false} closeBtnClass="cursor-pointer">
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
		<div class="relative max-h-[60vh] overflow-auto shadow-md sm:rounded-lg">
			<Table hoverable={true} striped={true}>
				<TableHead class="sticky top-0 bg-gray-50 text-sm dark:bg-gray-700">
					<TableHeadCell class="p-3">Name</TableHeadCell>
					<TableHeadCell class="p-3">Code</TableHeadCell>
					<TableHeadCell class="p-3">Status</TableHeadCell>
					<TableHeadCell class="p-3"><span class="sr-only">Action</span></TableHeadCell>
				</TableHead>
				<TableBody class="divide-y divide-gray-200 dark:divide-gray-700">
					{#each searchResults as domain (domain.id)}
						<TableBodyRow>
							<TableBodyCell class="p-3 font-medium whitespace-nowrap text-gray-900 dark:text-white"
								>{domain.name}</TableBodyCell
							>
							<TableBodyCell class="p-3 text-gray-600 dark:text-gray-400"
								>{domain.code}</TableBodyCell
							>
							<TableBodyCell class="p-3">
								<Badge color={domain.is_active ? 'green' : 'red'}>
									{domain.is_active ? 'Active' : 'Inactive'}
								</Badge>
							</TableBodyCell>
							<TableBodyCell class="p-3">
								<form method="POST" action="?/addDomain" use:enhance={handleSubmit}>
									<input type="hidden" name="user_id" value={userId} />
									<input type="hidden" name="domain_id" value={domain.id} />
									<Button class="cursor-pointer" type="submit" size="xs" color="green">Add</Button>
								</form>
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				</TableBody>
			</Table>
		</div>
	{/if}

	{#snippet footer()}
		<Button class="cursor-pointer" color="alternative" on:click={() => (open = false)}
			>Cancel</Button
		>
	{/snippet}
</Modal>

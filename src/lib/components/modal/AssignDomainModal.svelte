<script>
	import {
		Button,
		Table,
		TableBody,
		TableBodyRow,
		TableBodyCell,
		TableHead,
		TableHeadCell,
		Modal,
		Search,
		Spinner,
		Badge,
		Alert
	} from 'flowbite-svelte';
	import { enhance } from '$app/forms';
	import { UserAddOutline, SearchOutline, ExclamationCircleOutline } from 'flowbite-svelte-icons';

	/**
	 * Props for the AssignDomainModal component
	 * @param {boolean} open - Controls modal visibility
	 * @param {Set} userDomainIds - Set of domain IDs already assigned to user
	 * @param {string} userId - The user ID for domain assignment
	 * @param {Function} handleSubmit - Callback function for form submission
	 */
	let {
		open = $bindable(false),
		userDomainIds = new Set(),
		userId,
		handleSubmit = () => {}
	} = $props();

	// Component state
	let searchTerm = $state('');
	let isSearching = $state(false);
	let searchResults = $state([]);
	let error = $state(null);
	let searchTimeout = $state(null);
	let hasSearched = $state(false);
	let isSubmitting = $state(false);

	/**
	 * Effect to reset search when modal opens/closes
	 */
	$effect(() => {
		if (open) {
			// Reset state when modal opens
			searchTerm = '';
			searchResults = [];
			error = null;
			hasSearched = false;
			isSearching = false;
			isSubmitting = false;
			// Fetch all domains initially
			fetchDomains();
		} else {
			// Clear timeout when modal closes
			if (searchTimeout) {
				clearTimeout(searchTimeout);
				searchTimeout = null;
			}
		}
	});

	/**
	 * Fetches domains based on search term
	 * @param {string} search - The search term for domain codes
	 */
	async function fetchDomains(search = '') {
		isSearching = true;
		error = null;
		hasSearched = search.length > 0;

		const params = new URLSearchParams();
		params.set('limit', '20');
		if (search.trim().length > 0) {
			params.set('code', `like:${search}`);
		}

		try {
			const response = await fetch(`/api/domain?${params.toString()}`);
			if (!response.ok) throw new Error('Failed to load domains');

			const data = await response.json();
			// Filter out domains that the user already has
			const allDomains = data.data || [];
			searchResults = allDomains.filter((domain) => !userDomainIds.has(domain.id));
		} catch (err) {
			console.error('Failed to fetch domains:', err);
			error = 'Failed to load domains. Please try again.';
			searchResults = [];
		} finally {
			isSearching = false;
		}
	}

	/**
	 * Handles search input with debouncing
	 */
	function handleSearch() {
		// Clear existing timeout
		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}

		// Set new timeout
		searchTimeout = setTimeout(() => {
			fetchDomains(searchTerm);
		}, 300);
	}

	/**
	 * Handle input changes with proper debouncing
	 */
	function onSearchInput(event) {
		searchTerm = event.target.value;
		handleSearch();
	}
</script>

<Modal
	bind:open
	size="xl"
	title="Assign Domains"
	autoclose={false}
	closeBtnClass="cursor-pointer"
	class="min-h-[500px]"
>
	<!-- Header with improved styling -->
	<div class="mb-6">
		<div class="mb-3 flex items-center gap-2">
			<UserAddOutline class="h-5 w-5 text-blue-600 dark:text-blue-400" />
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Add Domains to User</h3>
		</div>
		<p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
			Search and select domains to assign to this user. Only unassigned domains will be shown.
		</p>

		<!-- Enhanced Search Input -->
		<div class="relative">
			<Search
				bind:value={searchTerm}
				oninput={onSearchInput}
				size="lg"
				placeholder="Search by domain code or name..."
			></Search>
		</div>
	</div>

	<!-- Content Area with minimum height -->
	<div class="flex min-h-[300px] flex-col">
		{#if isSearching}
			<!-- Loading State -->
			<div class="flex flex-1 flex-col items-center justify-center py-12">
				<Spinner size="8" class="mb-4" />
				<p class="font-medium text-gray-600 dark:text-gray-400">Searching domains...</p>
				<p class="mt-1 text-sm text-gray-500 dark:text-gray-500">
					Please wait while we find matching results
				</p>
			</div>
		{:else if error}
			<!-- Error State -->
			<div class="flex flex-1 items-center justify-center py-12">
				<Alert color="red" class="w-full max-w-md">
					<ExclamationCircleOutline slot="icon" class="h-5 w-5" />
					<span class="font-medium">Search Error</span>
					<p class="mt-1 text-sm">{error}</p>
					<div class="mt-3">
						<Button size="xs" color="red" onclick={() => fetchDomains(searchTerm)}>
							Try Again
						</Button>
					</div>
				</Alert>
			</div>
		{:else if searchResults.length === 0 && hasSearched}
			<!-- No Results State -->
			<div class="flex flex-1 flex-col items-center justify-center py-12">
				<div
					class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
				>
					<SearchOutline class="h-8 w-8 text-gray-400" />
				</div>
				<h4 class="mb-2 text-lg font-medium text-gray-900 dark:text-white">No domains found</h4>
				<p class="max-w-sm text-center text-gray-600 dark:text-gray-400">
					{#if searchTerm.length > 0}
						No domains match your search for <strong>"{searchTerm}"</strong>.
					{:else}
						All domains are already assigned to this user.
					{/if}
					Try adjusting your search terms.
				</p>
			</div>
		{:else if searchResults.length > 0}
			<!-- Results Table -->
			<div class="flex-1">
				<div class="mb-3 flex items-center justify-between">
					<Badge color="blue" class="text-xs">
						{searchResults.length} domain{searchResults.length !== 1 ? 's' : ''} available
					</Badge>
					{#if searchTerm.length > 0}
						<p class="text-xs text-gray-500 dark:text-gray-400">
							Showing results for "{searchTerm}"
						</p>
					{/if}
				</div>

				<div
					class="relative max-h-[400px] overflow-auto rounded-lg border border-gray-200 dark:border-gray-700"
				>
					<Table hoverable={true} class="relative">
						<TableHead class="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700">
							<TableHeadCell class="px-4 py-3 font-semibold">Domain</TableHeadCell>
							<TableHeadCell class="px-4 py-3 font-semibold">Code</TableHeadCell>
							<TableHeadCell class="px-4 py-3 font-semibold">Status</TableHeadCell>
							<TableHeadCell class="px-4 py-3 text-center font-semibold">Action</TableHeadCell>
						</TableHead>
						<TableBody class="divide-y divide-gray-200 dark:divide-gray-700">
							{#each searchResults as domain (domain.id)}
								<TableBodyRow class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
									<TableBodyCell class="px-4 py-4">
										<div class="flex items-center space-x-3">
											<div
												class="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900"
											>
												<span class="text-sm font-semibold text-purple-600 dark:text-purple-400">
													{domain.name.charAt(0).toUpperCase()}
												</span>
											</div>
											<div>
												<p class="font-medium text-gray-900 dark:text-white">{domain.name}</p>
												{#if domain.description}
													<p class="text-xs text-gray-500 dark:text-gray-400">
														{domain.description}
													</p>
												{/if}
											</div>
										</div>
									</TableBodyCell>
									<TableBodyCell class="px-4 py-4">
										<div class="text-sm">
											<p class="font-medium text-gray-900 dark:text-white">{domain.code}</p>
										</div>
									</TableBodyCell>
									<TableBodyCell class="px-4 py-4">
										<Badge color={domain.is_active ? 'green' : 'red'} class="text-xs">
											{domain.is_active ? 'Active' : 'Inactive'}
										</Badge>
									</TableBodyCell>
									<TableBodyCell class="px-4 py-4 text-center">
										<form method="POST" action="?/addDomain" use:enhance={handleSubmit}>
											<input type="hidden" name="user_id" value={userId} />
											<input type="hidden" name="domain_id" value={domain.id} />
											<Button
												type="submit"
												size="sm"
												color="green"
												class="min-w-[80px] cursor-pointer"
												disabled={isSubmitting}
											>
												{#if isSubmitting}
													<Spinner size="4" class="mr-2" />
												{/if}
												Assign
											</Button>
										</form>
									</TableBodyCell>
								</TableBodyRow>
							{/each}
						</TableBody>
					</Table>
				</div>
			</div>
		{:else}
			<!-- Initial State -->
			<div class="flex flex-1 flex-col items-center justify-center py-12">
				<div
					class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-50 dark:bg-purple-900/20"
				>
					<SearchOutline class="h-8 w-8 text-purple-500 dark:text-purple-400" />
				</div>
				<h4 class="mb-2 text-lg font-medium text-gray-900 dark:text-white">Search for Domains</h4>
				<p class="max-w-sm text-center text-gray-600 dark:text-gray-400">
					Enter a domain code or name to find and assign domains to this user.
				</p>
			</div>
		{/if}
	</div>

	{#snippet footer()}
		<div class="flex w-full items-center justify-between">
			<div class="text-xs text-gray-500 dark:text-gray-400">
				{#if searchResults.length > 0}
					Found {searchResults.length} available domain{searchResults.length !== 1 ? 's' : ''}
				{:else if hasSearched}
					No results found
				{:else}
					Ready to search
				{/if}
			</div>
			<div class="flex gap-2">
				<Button color="alternative" onclick={() => (open = false)} disabled={isSubmitting}>
					Cancel
				</Button>
			</div>
		</div>
	{/snippet}
</Modal>

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
	 * Props for the ManualAttendModal component
	 * @param {boolean} open - Controls modal visibility
	 * @param {string} eventId - The event ID for attendance
	 * @param {Function} handleSubmit - Callback function for form submission
	 */
	let { open = $bindable(false), eventId, domainId, handleSubmit = () => {} } = $props();

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
		} else {
			// Clear timeout when modal closes
			if (searchTimeout) {
				clearTimeout(searchTimeout);
				searchTimeout = null;
			}
		}
	});

	/**
	 * Fetches followers based on search term
	 * @param {string} search - The search term for follower names
	 */
	async function fetchFollowers(search = '') {
		// Don't search if term is too short
		if (search.trim().length < 2) {
			searchResults = [];
			hasSearched = false;
			return;
		}

		isSearching = true;
		error = null;
		hasSearched = true;

		const params = new URLSearchParams();
		params.set('limit', '20');
		params.set('search', `like:${search}`);
		params.set('domain_id', `eq:${domainId}`);

		try {
			const response = await fetch(`/api/follower?${params.toString()}`);
			if (!response.ok) throw new Error('Failed to load followers');

			const data = await response.json();
			searchResults = data.data || [];
		} catch (err) {
			console.error('Failed to fetch followers:', err);
			error = 'Failed to load followers. Please try again.';
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
			fetchFollowers(searchTerm);
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
	title="Manual Attendance"
	autoclose={false}
	closeBtnClass="cursor-pointer"
	class="min-h-[500px]"
>
	<!-- Header with improved styling -->
	<div class="mb-6">
		<div class="mb-3 flex items-center gap-2">
			<UserAddOutline class="h-5 w-5 text-blue-600 dark:text-blue-400" />
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Add Follower to Event</h3>
		</div>
		<p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
			Search and select followers to manually add them to this event.
		</p>

		<!-- Enhanced Search Input -->
		<div class="relative">
			<Search
				bind:value={searchTerm}
				oninput={onSearchInput}
				placeholder="Search by name, phone number, or email..."
				size="md"
			>
			</Search>
			{#if searchTerm.length > 0 && searchTerm.length < 2}
				<div
					class="absolute top-full right-0 left-0 mt-1 rounded-md border border-yellow-200 bg-yellow-50 p-2 text-xs text-yellow-700 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
				>
					Please enter at least 2 characters to search
				</div>
			{/if}
		</div>
	</div>

	<!-- Content Area with minimum height -->
	<div class="flex min-h-[300px] flex-col">
		{#if isSearching}
			<!-- Loading State -->
			<div class="flex flex-1 flex-col items-center justify-center py-12">
				<Spinner size="8" class="mb-4" />
				<p class="font-medium text-gray-600 dark:text-gray-400">Searching followers...</p>
				<p class="mt-1 text-sm text-gray-500 dark:text-gray-500">
					Please wait while we find matching results
				</p>
			</div>
		{:else if error}
			<!-- Error State -->
			<div class="flex flex-1 items-center justify-center py-12">
				<Alert color="red" class="w-full max-w-md">
					<ExclamationCircleOutline class="h-5 w-5" />
					<span class="font-medium">Search Error</span>
					<p class="mt-1 text-sm">{error}</p>
					<div class="mt-3">
						<Button size="xs" color="red" onclick={() => fetchFollowers(searchTerm)}>
							Try Again
						</Button>
					</div>
				</Alert>
			</div>
		{:else if hasSearched && searchTerm.length >= 2 && searchResults.length === 0}
			<!-- No Results State -->
			<div class="flex flex-1 flex-col items-center justify-center py-12">
				<div
					class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
				>
					<SearchOutline class="h-8 w-8 text-gray-400" />
				</div>
				<h4 class="mb-2 text-lg font-medium text-gray-900 dark:text-white">No followers found</h4>
				<p class="max-w-sm text-center text-gray-600 dark:text-gray-400">
					No followers match your search for <strong>"{searchTerm}"</strong>. Try adjusting your
					search terms.
				</p>
			</div>
		{:else if searchResults.length > 0}
			<!-- Results Table -->
			<div class="flex-1">
				<div class="mb-3 flex items-center justify-between">
					<Badge color="blue" class="text-xs">
						{searchResults.length} follower{searchResults.length !== 1 ? 's' : ''} found
					</Badge>
					<p class="text-xs text-gray-500 dark:text-gray-400">
						Showing results for "{searchTerm}"
					</p>
				</div>

				<div
					class="relative max-h-[400px] overflow-auto rounded-lg border border-gray-200 dark:border-gray-700"
				>
					<Table hoverable={true} striped={true} class="relative">
						<TableHead class="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700">
							<TableHeadCell class="px-4 py-3 font-semibold">Follower</TableHeadCell>
							<TableHeadCell class="px-4 py-3 font-semibold">Contact</TableHeadCell>
							<TableHeadCell class="px-4 py-3 text-center font-semibold">Action</TableHeadCell>
						</TableHead>
						<TableBody class="divide-y divide-gray-200 dark:divide-gray-700">
							{#each searchResults as follower (follower.id)}
								<TableBodyRow class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800">
									<TableBodyCell class="px-4 py-4">
										<div class="flex items-center space-x-3">
											<div
												class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900"
											>
												<span class="text-sm font-semibold text-blue-600 dark:text-blue-400">
													{follower.name.charAt(0).toUpperCase()}
												</span>
											</div>
											<div>
												<p class="font-medium text-gray-900 dark:text-white">{follower.name}</p>
												{#if follower.email}
													<p class="text-xs text-gray-500 dark:text-gray-400">{follower.email}</p>
												{/if}
											</div>
										</div>
									</TableBodyCell>
									<TableBodyCell class="px-4 py-4">
										<div class="text-sm">
											{#if follower.phone}
												<p class="font-medium text-gray-900 dark:text-white">{follower.phone}</p>
											{:else}
												<span class="text-gray-400 italic">No phone</span>
											{/if}
										</div>
									</TableBodyCell>
									<TableBodyCell class="px-4 py-4 text-center">
										<form method="POST" action="?/attendById" use:enhance={handleSubmit}>
											<input type="hidden" name="follower_id" value={follower.id} />
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
												Attend
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
					class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20"
				>
					<SearchOutline class="h-8 w-8 text-blue-500 dark:text-blue-400" />
				</div>
				<h4 class="mb-2 text-lg font-medium text-gray-900 dark:text-white">Search for Followers</h4>
				<p class="max-w-sm text-center text-gray-600 dark:text-gray-400">
					Enter a follower's name or phone number to find and add them to this event.
				</p>
			</div>
		{/if}
	</div>

	{#snippet footer()}
		<div class="flex w-full items-center justify-between">
			<div class="text-xs text-gray-500 dark:text-gray-400">
				{#if searchResults.length > 0}
					Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
				{:else if hasSearched && searchTerm.length >= 2}
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

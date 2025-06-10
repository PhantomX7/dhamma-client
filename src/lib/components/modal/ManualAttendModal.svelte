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
		Spinner
	} from 'flowbite-svelte';
	import { enhance } from '$app/forms';

	/**
	 * Props for the ManualAttendModal component
	 * @param {boolean} open - Controls modal visibility
	 * @param {string} eventId - The event ID for attendance
	 * @param {Function} handleSubmit - Callback function for form submission
	 */
	let {
		open = $bindable(false),
		eventId,
		domainId,
		handleSubmit = () => {}
	} = $props();

	// Component state
	let searchTerm = $state('');
	let isSearching = $state(false);
	let searchResults = $state([]);
	let error = $state(null);

	/**
	 * Effect to reset search when modal opens
	 */
	$effect(() => {
		if (open) {
			searchTerm = '';
			fetchFollowers();
		}
	});

	/**
	 * Fetches followers based on search term
	 * @param {string} search - The search term for follower names
	 */
	async function fetchFollowers(search = '') {
		isSearching = true;
		error = null;

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
		console.log('Search term:', searchTerm);
		clearTimeout(window.searchTimeout);
		window.searchTimeout = setTimeout(() => fetchFollowers(searchTerm), 500);
	}
</script>

<Modal bind:open size="lg" title="Manual Attendance" autoclose={false} closeBtnClass="cursor-pointer">
	<div class="mb-4">
		<Search 
			bind:value={searchTerm} 
			onchange={handleSearch} 
			placeholder="Search followers by name or phone number..."
		>
			<Button class="me-1">Search</Button>
		</Search>
	</div>

	{#if isSearching}
		<div class="flex justify-center py-8">
			<Spinner size="8" />
		</div>
	{:else if error}
		<div class="py-8 text-center text-red-500">
			{error}
		</div>
	{:else if searchTerm && searchResults.length === 0}
		<div class="py-8 text-center text-gray-500">
			No followers found matching your search.
		</div>
	{:else if searchResults.length > 0}
		<div class="relative max-h-[60vh] overflow-auto shadow-md sm:rounded-lg">
			<Table hoverable={true} striped={true}>
				<TableHead class="sticky top-0 bg-gray-50 text-sm dark:bg-gray-700">
					<TableHeadCell class="p-3">Name</TableHeadCell>
					<TableHeadCell class="p-3">Phone Number</TableHeadCell>
					<TableHeadCell class="p-3"><span class="sr-only">Action</span></TableHeadCell>
				</TableHead>
				<TableBody class="divide-y divide-gray-200 dark:divide-gray-700">
					{#each searchResults as follower (follower.id)}
						<TableBodyRow>
							<TableBodyCell class="p-3 font-medium whitespace-nowrap text-gray-900 dark:text-white">
								{follower.name}
							</TableBodyCell>
							<TableBodyCell class="p-3 text-gray-600 dark:text-gray-400">
								{follower.phone || 'N/A'}
							</TableBodyCell>
							<TableBodyCell class="p-3">
								<form 
									method="POST" 
									action="?/attendById" 
									use:enhance={handleSubmit}
								>
									<input type="hidden" name="follower_id" value={follower.id} />
									<Button 
										class="cursor-pointer" 
										type="submit" 
										size="xs" 
										color="green"
									>
										Attend
									</Button>
								</form>
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				</TableBody>
			</Table>
		</div>
	{:else}
		<div class="py-8 text-center text-gray-500">
			Start typing to search for followers.
		</div>
	{/if}

	{#snippet footer()}
		<Button class="cursor-pointer" color="alternative" onclick={() => (open = false)}>
			Cancel
		</Button>
	{/snippet}
</Modal>
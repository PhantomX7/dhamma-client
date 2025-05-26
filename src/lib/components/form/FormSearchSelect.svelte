<script>
	// Import Table components
	import {
		Label,
		Input,
		Helper,
		Modal,
		Search,
		Spinner,
		Button,
		Table,
		TableHead,
		TableBody,
		TableHeadCell,
		TableBodyRow,
		TableBodyCell
	} from 'flowbite-svelte';
	import { ChevronDownOutline, CloseOutline } from 'flowbite-svelte-icons';
	import { onMount, onDestroy } from 'svelte';

	/**
	 * @module FormSearchSelect
	 * @description A modal-based search and select component that fetches options from an API endpoint.
	 * The component displays a read-only input field that, when clicked, opens a modal with search functionality.
	 * Selected values are stored in a hidden input for form submission.
	 *
	 * @component
	 * @example
	 * <FormSearchSelect
	 *   label="Domain"
	 *   id="domain_id"
	 *   name="domain_id"
	 *   bind:value={formData.domain_id}
	 *   error={errors.domain_id?.join(', ')}
	 *   required
	 *   placeholder="Click to select Domain"
	 *   apiPath="/api/domain"
	 *   displayField="name"
	 *   valueField="id"
	 *   helperText="Select the domain this item belongs to."
	 * />
	 */
	let {
		id = '',
		label = '',
		name = '',
		value = $bindable(),
		initialDisplayValue = '',
		error = '',
		helperText = '',
		required = false,
		placeholder = 'Click to select...',
		apiPath,
		searchParam = 'name',
		displayField = 'name',
		valueField = 'id',
		limit = 10
	} = $props();

	// --- Component State ---
	let displayValue = $state(initialDisplayValue);
	let results = $state([]);
	let isLoading = $state(false);
	let isModalOpen = $state(false);
	let modalSearchTerm = $state('');
	let modalFetchError = $state(null);
	let showCodeColumn = $state(false);

	// Use regular variables to avoid reactivity issues
	let searchTimeout = null;
	let hasInitiallyFetched = $state(false);
	let lastFetchedValue = null;
	let lastSearchTerm = '';

	// --- Lifecycle ---
	onMount(() => {
		// Component is ready
	});

	onDestroy(() => {
		// Clean up any pending timeouts
		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}
	});

	// --- Effects ---
	// Handle value changes - clear display value when value is cleared
	$effect(() => {
		if (!value) {
			// Clear display value if bound value becomes null/undefined
			displayValue = '';
			lastFetchedValue = null;
		}
	});

	// Handle modal search with debouncing - using untrack to prevent loops
	$effect(() => {
		if (!isModalOpen) return;

		// Only proceed if search term actually changed
		if (modalSearchTerm === lastSearchTerm) return;

		lastSearchTerm = modalSearchTerm;

		// Clear existing timeout
		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}

		// Set up debounced search
		searchTimeout = setTimeout(() => {
			fetchModalData(modalSearchTerm);
		}, 300);
	});

	// Determine if code column should be shown
	$effect(() => {
		showCodeColumn =
			results.length > 0 &&
			results.some((item) => item.code !== undefined && item.code !== null && item.code !== '');
	});

	// --- Functions ---

	/**
	 * Fetches data for the modal based on the search term.
	 */
	async function fetchModalData(term = '') {
		if (!apiPath) {
			modalFetchError = 'API path is not configured.';
			results = [];
			return;
		}

		isLoading = true;
		modalFetchError = null;

		try {
			const params = new URLSearchParams();
			params.set('limit', limit.toString());
			params.set('is_active', 'true');

			if (term.trim()) {
				params.set(searchParam, `like:${term.trim()}`);
			}

			const url = `${apiPath}?${params.toString()}`;
			const response = await fetch(url);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const responseData = await response.json();
			results = Array.isArray(responseData?.data) ? responseData.data : [];
			hasInitiallyFetched = true;
		} catch (err) {
			console.error('Failed to fetch modal data:', err);
			modalFetchError = 'Failed to load data. Please try again.';
			results = [];
		} finally {
			isLoading = false;
		}
	}

	/**
	 * Handles selecting an item from the modal's results list.
	 */
	function handleSelect(item) {
		const newValue = item[valueField];
		const newDisplayValue = item[displayField];

		// Update values
		value = newValue;
		displayValue = newDisplayValue;
		lastFetchedValue = newValue;

		// Close modal and reset states
		closeModal();
	}

	/**
	 * Opens the selection modal.
	 */
	function openModal() {
		isModalOpen = true;
		hasInitiallyFetched = false;
		lastSearchTerm = ''; // Reset to ensure initial fetch works

		// Trigger initial fetch immediately
		fetchModalData('');
	}

	/**
	 * Closes the modal and resets modal states.
	 */
	function closeModal() {
		isModalOpen = false;
		modalSearchTerm = '';
		modalFetchError = null;
		results = [];
		hasInitiallyFetched = false;
		lastSearchTerm = '';

		// Clear any pending search timeout
		if (searchTimeout) {
			clearTimeout(searchTimeout);
			searchTimeout = null;
		}
	}

	/**
	 * Clears the selected value.
	 */
	function clearSelection(event) {
		event?.stopPropagation();
		value = null;
		displayValue = '';
		lastFetchedValue = null;
	}

	/**
	 * Handle keyboard navigation in results
	 */
	function handleKeyPress(event, item) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleSelect(item);
		}
	}
</script>

<div class="space-y-2">
	{#if label}
		<Label for={id || name} class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
			{label}{#if required}<span class="ml-1 text-red-500">*</span>{/if}
		</Label>
	{/if}

	<!-- Hidden input to store the actual selected value -->
	<input type="hidden" {name} bind:value />

	<!-- Visible input-like element -->
	<div class="relative">
		<Input
			type="text"
			{id}
			readonly
			bind:value={displayValue}
			{placeholder}
			onclick={openModal}
			color={error ? 'red' : 'base'}
			class="cursor-pointer pr-16"
		/>
		<div class="absolute inset-y-0 end-0 flex items-center space-x-2 pe-3">
			<!-- Clear Button -->
			{#if value !== null && value !== undefined && value !== ''}
				<button
					type="button"
					onclick={clearSelection}
					class="-m-6 cursor-pointer p-1 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
					aria-label="Clear selection"
				>
					<CloseOutline class="h-4 w-4" />
				</button>
			{/if}
			<!-- Dropdown Icon -->
			<button
				type="button"
				onclick={openModal}
				class="-m-1 p-1 text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
				aria-label="Open selection modal"
			>
				<ChevronDownOutline class="h-4 w-4" />
			</button>
		</div>
	</div>

	<!-- Error/Helper Text -->
	{#if error}
		<Helper class="mt-2 text-xs text-red-600 dark:text-red-500">{error}</Helper>
	{:else if helperText}
		<Helper class="mt-2 text-xs text-gray-500 dark:text-gray-400">{helperText}</Helper>
	{/if}

	<!-- Selection Modal -->
	<Modal
		bind:open={isModalOpen}
		size="lg"
		title={`Select ${label || 'Item'}`}
		autoclose={false}
		closeBtnClass="cursor-pointer"
	>
		<div class="mb-4">
			<Search bind:value={modalSearchTerm} placeholder={`Search by ${searchParam}`} class="w-full">
				<Button class="me-1" disabled={isLoading}>
					{isLoading ? 'Searching...' : 'Search'}
				</Button>
			</Search>
		</div>

		<!-- Results Table -->
		<div class="rounded-lg border border-gray-200 dark:border-gray-700">
			<Table
				hoverable={true}
				striped={true}
				divClass="relative max-h-[60vh] overflow-x-auto overflow-y-auto"
			>
				{#if isLoading}
					<!-- Loading State -->
					<TableBody>
						<TableBodyRow>
							<TableBodyCell colspan={showCodeColumn ? 2 : 1} class="py-8 text-center">
								<div class="flex items-center justify-center">
									<Spinner size="6" />
									<span class="ml-3 text-gray-500 dark:text-gray-400">Loading...</span>
								</div>
							</TableBodyCell>
						</TableBodyRow>
					</TableBody>
				{:else if modalFetchError}
					<!-- Error State -->
					<TableBody>
						<TableBodyRow>
							<TableBodyCell colspan={showCodeColumn ? 2 : 1} class="py-8 text-center">
								<div class="text-red-500 dark:text-red-400">
									<p class="font-medium">Error loading data</p>
									<p class="mt-1 text-sm">{modalFetchError}</p>
								</div>
							</TableBodyCell>
						</TableBodyRow>
					</TableBody>
				{:else if results.length === 0 && hasInitiallyFetched}
					<!-- Empty State -->
					<TableBody>
						<TableBodyRow>
							<TableBodyCell colspan={showCodeColumn ? 2 : 1} class="py-8 text-center">
								<div class="text-gray-500 dark:text-gray-400">
									{#if modalSearchTerm.trim()}
										<p class="font-medium">No results found</p>
										<p class="mt-1 text-sm">No items match "{modalSearchTerm}"</p>
									{:else}
										<p class="font-medium">No items available</p>
									{/if}
								</div>
							</TableBodyCell>
						</TableBodyRow>
					</TableBody>
				{:else if results.length === 0 && !hasInitiallyFetched}
					<!-- Initial State -->
					<TableBody>
						<TableBodyRow>
							<TableBodyCell colspan={showCodeColumn ? 2 : 1} class="py-8 text-center">
								<div class="text-gray-500 dark:text-gray-400">
									<p>Start typing to search for items</p>
								</div>
							</TableBodyCell>
						</TableBodyRow>
					</TableBody>
				{:else}
					<!-- Results -->
					<TableHead class="sticky top-0 bg-gray-50 dark:bg-gray-700">
						<TableHeadCell class="px-4 py-3 font-medium">Name</TableHeadCell>
						{#if showCodeColumn}
							<TableHeadCell class="px-4 py-3 font-medium">Code</TableHeadCell>
						{/if}
					</TableHead>
					<TableBody class="divide-y divide-gray-200 dark:divide-gray-700">
						{#each results as item (item[valueField])}
							<TableBodyRow
								class="cursor-pointer transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none dark:hover:bg-gray-700 dark:focus:bg-gray-700"
								onclick={() => handleSelect(item)}
								onkeypress={(e) => handleKeyPress(e, item)}
								tabindex="0"
								role="button"
								aria-label={`Select ${item[displayField]}`}
							>
								<TableBodyCell class="px-4 py-3 font-medium text-gray-900 dark:text-white">
									{item[displayField] || 'N/A'}
								</TableBodyCell>
								{#if showCodeColumn}
									<TableBodyCell class="px-4 py-3 text-gray-600 dark:text-gray-400">
										{item.code || '-'}
									</TableBodyCell>
								{/if}
							</TableBodyRow>
						{/each}
					</TableBody>
				{/if}
			</Table>
		</div>

		{#snippet footer()}
			<div class="flex justify-end space-x-2">
				<Button color="alternative" onclick={closeModal}>Cancel</Button>
			</div>
		{/snippet}
	</Modal>
</div>

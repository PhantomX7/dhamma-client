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
	import { onMount } from 'svelte';

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
	 *
	 * @property {string} [id=''] - The ID for the input and label association
	 * @property {string} [label=''] - The label text for the input
	 * @property {string} [name=''] - The name attribute for the hidden input holding the selected value
	 * @property {string|number|null} value - The bindable selected value (typically an ID)
	 * @property {string} [initialDisplayValue=''] - Optional initial display text if known (prevents extra API call)
	 * @property {string} [error=''] - Optional error message displayed below the input
	 * @property {string} [helperText=''] - Optional helper text displayed below the input (ignored if error exists)
	 * @property {boolean} [required=false] - Indicates if the field is required (adds asterisk to label)
	 * @property {string} [placeholder='Click to select...'] - Placeholder text for the input
	 * @property {string} apiPath - The API endpoint path to fetch data from (e.g., '/api/domain')
	 * @property {string} [searchParam='name'] - The query parameter name used for searching (e.g., 'name', 'code')
	 * @property {string} [displayField='name'] - The field from the API response to display in the input and dropdown
	 * @property {string} [valueField='id'] - The field from the API response to use as the actual selected value
	 * @property {number} [limit=10] - The maximum number of results to fetch
	 *
	 * @fires {Event} input - When the value changes
	 * @fires {Event} change - When a selection is made
	 */
	let {
		id = '',
		label = '',
		name = '',
		value = $bindable(), // The actual selected value (ID)
		initialDisplayValue = '', // Optional: Pass initial display text if known
		error = '',
		helperText = '',
		required = false,
		placeholder = 'Click to select...', // Updated placeholder
		apiPath,
		searchParam = 'name',
		displayField = 'name',
		valueField = 'id',
		limit = 10
	} = $props();

	// --- Component State ---
	let displayValue = $state(initialDisplayValue); // Text shown in the input field
	let results = $state([]); // Array of items fetched from the API for the modal
	let isLoading = $state(false); // Loading state for modal search
	let isModalOpen = $state(false);
	let modalSearchTerm = $state(''); // Search term used inside the modal
	let modalFetchError = $state(null);
	let modalSearchTimeout = $state(null);
	let modalHasFetchedOnce = $state(false); // Track if initial fetch happened in modal
	let userChangedSearch = $state(false); // Track if search term was changed by user
	let showCodeColumn = $state(false); // Dynamically decide if 'code' column is needed

	// --- Effects ---
	// Effect to fetch the display name when the component mounts if a value exists but no initialDisplayValue was provided
	$effect(() => {
		if (value && !displayValue && apiPath) {
			fetchItemById(value);
		} else if (!value) {
			displayValue = ''; // Clear display value if bound value becomes null/undefined
		}
	});

	// Effect to fetch data within the modal based on modalSearchTerm (debounced)
	$effect(() => {
		// Only run if modal is open and search term was changed by user input
		if (!isModalOpen || !userChangedSearch) {
			return;
		}

		// Reset the flag
		userChangedSearch = false;

		// Capture current search term to avoid reactivity issues
		const currentSearchTerm = modalSearchTerm;

		// Clear any existing timeout
		clearTimeout(modalSearchTimeout);

		// Set a new timeout for debouncing
		modalSearchTimeout = setTimeout(() => {
			fetchModalData(currentSearchTerm);
		}, 300); // 300ms debounce

		// Cleanup function
		return () => {
			clearTimeout(modalSearchTimeout);
		};
	});

	// Effect to determine if the 'code' column should be shown based on results
	$effect(() => {
		if (results.length > 0) {
			// Check if at least one item has a 'code' property
			showCodeColumn = results.some((item) => item.code !== undefined && item.code !== null);
		} else {
			showCodeColumn = false; // Hide column if no results
		}
	});

	// --- Functions ---

	/**
	 * Fetches a single item by its ID to get the display value.
	 * @param {string | number} itemId - The ID of the item to fetch.
	 */
	async function fetchItemById(itemId) {
		// Avoid fetching if apiPath is not set or itemId is invalid
		if (!apiPath || !itemId) return;

		// Construct URL for fetching a single item (adjust API pattern if needed)
		const url = `${apiPath}/${itemId}`;
		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const responseData = await response.json();
			// Assuming the API returns the item directly or within a 'data' field
			const item = responseData?.data ?? responseData;
			if (item && item[displayField]) {
				displayValue = item[displayField];
			} else {
				console.warn(
					`Item with ID ${itemId} found, but display field "${displayField}" is missing.`
				);
				displayValue = `ID: ${itemId}`; // Fallback display
			}
		} catch (err) {
			console.error(`Failed to fetch item by ID from ${url}:`, err);
			// Keep existing displayValue or show an error indicator? For now, do nothing.
		}
	}

	/**
	 * Fetches data for the modal based on the modal's search term.
	 * @param {string} term - The search term from the modal input.
	 */
	async function fetchModalData(term = '') {
		if (!apiPath) {
			modalFetchError = 'API path is not configured.';
			results = [];
			return;
		}
		isLoading = true;
		modalFetchError = null;

		const params = new URLSearchParams();
		params.set('limit', limit.toString());
		if (term) {
			params.set(searchParam, `like:${term}`);
		}
		params.set('is_active', 'true'); // Assuming you still want active items

		const url = `${apiPath}?${params.toString()}`;

		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const responseData = await response.json();
			results = responseData?.data ?? [];
		} catch (err) {
			console.error(`Failed to fetch modal data from ${url}:`, err);
			modalFetchError = 'Failed to load data. Please try again.';
			results = [];
		} finally {
			isLoading = false;
			modalHasFetchedOnce = true; // Mark that a fetch attempt has been made
		}
	}

	/**
	 * Handles selecting an item from the modal's results list.
	 * @param {object} item - The selected item object from the results.
	 */
	function handleSelect(item) {
		value = item[valueField]; // Update the bound value (ID)
		displayValue = item[displayField]; // Update the text shown in the input
		isModalOpen = false; // Close modal
		results = []; // Clear modal results
		modalSearchTerm = ''; // Reset modal search term
		modalFetchError = null;
		modalHasFetchedOnce = false; // Reset fetch status for next modal open
	}

	/**
	 * Opens the selection modal.
	 */
	function openModal() {
		isModalOpen = true;
		// Fetch initial data directly if it hasn't been fetched yet for this modal instance
		if (!modalHasFetchedOnce) {
			fetchModalData('');
		}
	}

	/**
	 * Clears the selected value.
	 */
	function clearSelection(event) {
		event.stopPropagation(); // Prevent opening the modal when clearing
		value = null;
		displayValue = '';
		results = [];
		modalSearchTerm = '';
		modalFetchError = null;
		// Keep modalHasFetchedOnce as is, no need to reset here
	}

	/**
	 * Handles search input changes in the modal.
	 */
	function handleSearchInput(event) {
		modalSearchTerm = event.target.value;
		userChangedSearch = true; // Set flag to indicate user changed the search
	}
</script>

<div class="space-y-2">
	{#if label}
		<Label for={id || name} class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
			{label}{#if required}<span class="ml-1 text-red-500">*</span>{/if}
		</Label>
	{/if}

	<!-- Hidden input to store the actual selected value (ID) for form submission -->
	<input type="hidden" {name} bind:value />

	<!-- Visible input-like element to display value and trigger modal -->
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
					class="-m-1 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
					aria-label="Clear selection"
				>
					<CloseOutline class="h-4 w-4" />
				</button>
			{/if}
			<!-- Dropdown Icon -->
			<button
				type="button"
				onclick={openModal}
				class="-m-1 p-1 text-gray-500 dark:text-gray-400"
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
	<Modal bind:open={isModalOpen} size="lg" title={`Select ${label || 'Item'}`} autoclose={false}>
		<div class="mb-4">
			<Search bind:value={modalSearchTerm} placeholder="Search..." oninput={handleSearchInput} />
		</div>

		<!-- Use Table for results -->
		<div>
            <Table hoverable={true} shadow divClass="relative max-h-[70vh] overflow-x-auto overflow-y-auto">
				{#if isLoading}
					<!-- Loading State -->
					<TableBody>
						<TableBodyRow>
							<TableBodyCell colspan={showCodeColumn ? 2 : 1} class="text-center">
								<div class="flex items-center justify-center p-4">
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
							<TableBodyCell colspan={showCodeColumn ? 2 : 1} class="text-center">
								<div class="p-4 text-red-500">{modalFetchError}</div>
							</TableBodyCell>
						</TableBodyRow>
					</TableBody>
				{:else if results.length === 0 && modalHasFetchedOnce}
					<!-- Empty State (after search/fetch) -->
					<TableBody>
						<TableBodyRow>
							<TableBodyCell colspan={showCodeColumn ? 2 : 1} class="text-center">
								<div class="p-4 text-gray-500 dark:text-gray-400">
									{#if modalSearchTerm}
										No results found for "{modalSearchTerm}".
									{:else}
										No items available.
									{/if}
								</div>
							</TableBodyCell>
						</TableBodyRow>
					</TableBody>
				{:else if results.length === 0 && !modalHasFetchedOnce}
					<!-- Initial Empty State (before search/fetch) -->
					<TableBody>
						<TableBodyRow>
							<TableBodyCell colspan={showCodeColumn ? 2 : 1} class="text-center">
								<div class="p-4 text-gray-500 dark:text-gray-400">Start typing to search.</div>
							</TableBodyCell>
						</TableBodyRow>
					</TableBody>
				{:else}
					<!-- Results Table -->
					<TableHead class="sticky top-0 bg-gray-50 dark:bg-gray-700">
						<TableHeadCell class="p-3">Name</TableHeadCell>
						{#if showCodeColumn}
							<TableHeadCell class="p-3">Code</TableHeadCell>
						{/if}
					</TableHead>
					<TableBody class="divide-y dark:divide-gray-700">
						{#each results as item (item[valueField])}
							<TableBodyRow
								class="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
								onclick={() => handleSelect(item)}
								onkeypress={(e) => e.key === 'Enter' && handleSelect(item)}
								tabindex="0"
							>
								<TableBodyCell class="whitespace-nowrap p-3 font-medium text-gray-900 dark:text-white">
									{item[displayField]}
								</TableBodyCell>
								{#if showCodeColumn}
									<TableBodyCell class="p-3 text-gray-600 dark:text-gray-400">
										{item.code ?? ''}
									</TableBodyCell>
								{/if}
							</TableBodyRow>
						{/each}
					</TableBody>
				{/if}
			</Table>
		</div>

		<svelte:fragment slot="footer">
			<Button class="cursor-pointer" color="alternative" onclick={() => (isModalOpen = false)}>Cancel</Button>
		</svelte:fragment>
	</Modal>
</div>

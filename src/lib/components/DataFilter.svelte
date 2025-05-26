<script>
	// Import necessary components from flowbite-svelte
	import { Select, Input, Button, Card } from 'flowbite-svelte'; // Added Card import
	// Import filter utilities
	import { FilterType, FilterOperator } from '$lib/utils/filter';

	// Define component props using Svelte 5 $props rune
	let {
		filterConfig,
		initialFilters = {},
		onFilterChange = () => {},
		onApply = () => {}
	} = $props();

	// Reactive state for active filters and visibility
	let activeFilters = $state({ ...initialFilters });
	let isFilterVisible = $state(false);

	// Define available filter operators based on filter type
	const operatorsByType = {
		[FilterType.ID]: [
			{ value: FilterOperator.EQUALS, label: 'Equals' },
			{ value: FilterOperator.NOT_EQUALS, label: 'Not Equals' },
			{ value: FilterOperator.IN, label: 'In' },
			{ value: FilterOperator.BETWEEN, label: 'Between' }
		],
		[FilterType.STRING]: [
			{ value: FilterOperator.EQUALS, label: 'Equals' },
			{ value: FilterOperator.LIKE, label: 'Contains' }
		],
		[FilterType.DATE]: [
			{ value: FilterOperator.EQUALS, label: 'Equals' },
			// { value: FilterOperator.GT, label: 'After' },
			// { value: FilterOperator.LT, label: 'Before' },
			{ value: FilterOperator.BETWEEN, label: 'Between' }
		],
		[FilterType.BOOL]: [{ value: FilterOperator.EQUALS, label: 'Equals' }],
		[FilterType.ENUM]: [
			{ value: FilterOperator.EQUALS, label: 'Equals' },
			{ value: FilterOperator.IN, label: 'In' }
		]
	};

	/**
	 * Handles changes to a specific filter field.
	 * @param {string} field - The field being filtered.
	 * @param {string} operator - The filter operator selected.
	 * @param {any} value - The filter value entered.
	 */
	function handleFilterChange(field, operator, value) {
		activeFilters[field] = { operator, value };
		onFilterChange(activeFilters);
	}

	/**
	 * Clears all active filters.
	 */
	function clearFilters() {
		activeFilters = {};
		onFilterChange(activeFilters);
	}

	/**
	 * Applies the current set of active filters.
	 */
	function applyFilters() {
		onApply(activeFilters);
	}
</script>

<div class="space-y-4">
	<div class="flex justify-end">
		<!-- Button to toggle filter visibility -->
		<Button color="light" onclick={() => (isFilterVisible = !isFilterVisible)}>
			{isFilterVisible ? 'Hide Filters' : 'Show Filters'}
		</Button>
	</div>

	{#if isFilterVisible}
		<!-- Use Card component for the filter section -->
		<Card class="p-5" size="xl">
			<!-- Grid layout for filter inputs -->
			<div class="mb-4 grid gap-4">
				{#each Object.entries(filterConfig) as [field, config]}
					<div class="grid grid-cols-[8rem_10rem_1fr] items-center gap-4">
						<!-- Filter label -->
						<span class="text-sm font-medium text-gray-700 dark:text-gray-300"
							>{config.label || field}</span
						>

						<!-- Operator selection dropdown -->
						<Select
							class="w-full"
							value={activeFilters[field]?.operator || ''}
							onchange={(e) => {
								handleFilterChange(field, e.target.value, activeFilters[field]?.value);
							}}
						>
							<option value="" disabled>Select Operator</option>
							{#each operatorsByType[config.type] || [] as op}
								<option value={op.value}>{op.label}</option>
							{/each}
						</Select>

						<!-- Input field based on filter type -->
						{#if config.type === FilterType.ENUM}
							<Select
								class="w-full"
								value={activeFilters[field]?.value || ''}
								onchange={(e) =>
									handleFilterChange(field, activeFilters[field]?.operator, e.target.value)}
							>
								<option value="" disabled>Select Value</option>
								{#each config.enumValues || [] as value}
									<option {value}>{value}</option>
								{/each}
							</Select>
						{:else if config.type === FilterType.BOOL}
							<Select
								class="w-full"
								value={activeFilters[field]?.value ?? ''}
								onchange={(e) =>
									handleFilterChange(field, activeFilters[field]?.operator, e.target.value)}
							>
								<option value="" disabled>Select Value</option>
								<option value="true">True</option>
								<option value="false">False</option>
							</Select>
						{:else if config.type === FilterType.DATE}
							<div class="flex w-full items-center gap-2">
								<!-- Date input(s) -->
								<Input
									type="date"
									class="w-full"
									value={activeFilters[field]?.value?.split(',')[0] || ''}
									onchange={(e) => {
										const currentValue = activeFilters[field]?.value?.split(',') || [];
										const newValue =
											activeFilters[field]?.operator === FilterOperator.BETWEEN
												? [e.target.value, currentValue[1] || ''].join(',')
												: e.target.value;
										handleFilterChange(field, activeFilters[field]?.operator, newValue);
									}}
								/>
								{#if activeFilters[field]?.operator === FilterOperator.BETWEEN}
									<span class="text-gray-500">-</span>
									<Input
										type="date"
										class="w-full"
										value={activeFilters[field]?.value?.split(',')[1] || ''}
										onchange={(e) => {
											const currentValue = activeFilters[field]?.value?.split(',') || [];
											handleFilterChange(
												field,
												activeFilters[field]?.operator,
												[currentValue[0] || '', e.target.value].join(',')
											);
										}}
									/>
								{/if}
							</div>
						{:else}
							<!-- Default text/number input -->
							<Input
								type={config.type === FilterType.NUMBER ? 'number' : 'text'}
								value={activeFilters[field]?.value || ''}
								class="w-full"
								placeholder="Enter value hehe"
								onchange={(e) => {
									handleFilterChange(field, activeFilters[field]?.operator, e.target.value);
								}}
							/>
						{/if}
					</div>
				{/each}
			</div>

			<!-- Action buttons container -->
			<div class="flex gap-2 border-t border-gray-200 pt-4 dark:border-gray-700">
				<Button color="primary" onclick={applyFilters}>Apply Filters</Button>
				<Button color="light" onclick={clearFilters}>Clear</Button>
			</div>
		</Card>
	{/if}
</div>

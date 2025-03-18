<script>
	import { Select, Input, Button } from 'flowbite-svelte';
	import { FilterType, FilterOperator } from '$lib/utils/filter';

	let {
		filterConfig,
		initialFilters = {},
		onFilterChange = () => {},
		onApply = () => {}
	} = $props();

	let activeFilters = $state({ ...initialFilters });
	let isFilterVisible = $state(false);

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
		[FilterType.BOOL]: [{ value: FilterOperator.EQUALS, label: 'Equals' }],
		[FilterType.ENUM]: [
			{ value: FilterOperator.EQUALS, label: 'Equals' },
			{ value: FilterOperator.IN, label: 'In' }
		]
	};

	function handleFilterChange(field, operator, value) {
		activeFilters[field] = { operator, value };
		onFilterChange(activeFilters);
	}

	function clearFilters() {
		activeFilters = {};
		onFilterChange(activeFilters);
	}

    function applyFilters() {
		onApply(activeFilters);
	}
</script>

<div class="space-y-4">
	<div class="flex justify-end">
		<Button color="light" on:click={() => (isFilterVisible = !isFilterVisible)}>
			{isFilterVisible ? 'Hide Filters' : 'Show Filters'}
		</Button>
	</div>

	{#if isFilterVisible}
		<div class="space-y-4 rounded-lg border bg-white p-4 shadow-sm">
			{#each Object.entries(filterConfig) as [field, config]}
				<div class="flex items-center gap-2">
					<span class="w-32">{config.label || field}</span>

					<Select
						class="w-40"
						value={activeFilters[field]?.operator || ''}
						on:change={(e) =>
							handleFilterChange(field, e.target.value, activeFilters[field]?.value)}
					>
						{#each operatorsByType[config.type] || [] as op}
							<option value={op.value}>{op.label}</option>
						{/each}
					</Select>

					{#if config.type === FilterType.ENUM}
						<Select
							class="w-40"
							value={activeFilters[field]?.value || ''}
							on:change={(e) =>
								handleFilterChange(field, activeFilters[field]?.operator, e.target.value)}
						>
							{#each config.enumValues || [] as value}
								<option {value}>{value}</option>
							{/each}
						</Select>
					{:else if config.type === FilterType.BOOL}
						<Select
							class="w-40"
							value={activeFilters[field]?.value || ''}
							on:change={(e) =>
								handleFilterChange(field, activeFilters[field]?.operator, e.target.value)}
						>
							<option value="true">True</option>
							<option value="false">False</option>
						</Select>
					{:else}
						<Input
							type={config.type === FilterType.NUMBER ? 'number' : 'text'}
							value={activeFilters[field]?.value || ''}
							on:input={(e) =>
								handleFilterChange(field, activeFilters[field]?.operator, e.target.value)}
						/>
					{/if}
				</div>
			{/each}

			<div class="flex gap-2 border-t pt-2">
				<Button color="blue" on:click={applyFilters}>Apply Filters</Button>
				<Button color="light" on:click={clearFilters}>Clear</Button>
			</div>
		</div>
	{/if}
</div>

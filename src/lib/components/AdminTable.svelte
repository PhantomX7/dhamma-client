<script>
	import {
		Table,
		TableBody,
		TableBodyRow,
		TableBodyCell,
		TableHead,
		TableHeadCell,
		Badge,
		Button
	} from 'flowbite-svelte';
	import { EyeOutline, EditOutline } from 'flowbite-svelte-icons';
	import { formatDate } from '$lib/utils';
	import { hasPermission } from '$lib/utils/permissions';
	import { getContext } from 'svelte';

	/**
	 * Generic admin table component that renders data based on configuration
	 * @param {Array} data - Array of data objects to display
	 * @param {Object} config - Table configuration object defining columns and actions
	 */
	let { data, config } = $props();

	// Get current user context for permission checks
	const currentUser = getContext('user');

	/**
	 * Renders cell content based on column type and configuration
	 * @param {Object} item - Data item
	 * @param {Object} column - Column configuration
	 * @returns {string|Object} Rendered content
	 */
	function renderCellContent(item, column) {
		const value = item[column.key];
		
		switch (column.type) {
			case 'date':
				return formatDate(value);
			case 'badge':
				return {
					text: column.formatter ? column.formatter(value) : value,
					color: column.getColor ? column.getColor(value) : (column.color || 'gray')
				};
			case 'custom':
				return column.formatter ? column.formatter(item) : value;
			default:
				return value || 'N/A';
		}
	}

	/**
	 * Checks if a column should be displayed based on conditions
	 * @param {Object} column - Column configuration
	 * @returns {boolean} Whether to show the column
	 */
	function shouldShowColumn(column) {
		if (column.condition) {
			return column.condition(currentUser());
		}
		return true;
	}

	/**
	 * Checks if an action should be displayed based on permissions
	 * @param {Object} action - Action configuration
	 * @returns {boolean} Whether to show the action
	 */
	function shouldShowAction(action) {
		if (action.permission) {
			return hasPermission(currentUser(), action.permission);
		}
		return true;
	}

	// Calculate visible columns for colspan in empty state
	const visibleColumns = $derived(config.columns.filter(shouldShowColumn));
	const totalColumns = $derived(visibleColumns.length + (config.actions?.length > 0 ? 1 : 0));
</script>

<!-- Flowbite Table component with hover effect and constrained height -->
<Table hoverable={true} shadow divClass="relative max-h-[70vh] overflow-x-auto overflow-y-auto">
	<!-- Sticky table header -->
	<TableHead
		class="sticky top-0 z-10 bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400"
	>
		{#each config.columns as column}
			{#if shouldShowColumn(column)}
				<TableHeadCell>{column.label}</TableHeadCell>
			{/if}
		{/each}
		{#if config.actions && config.actions.length > 0}
			<TableHeadCell>Actions</TableHeadCell>
		{/if}
	</TableHead>
	
	<!-- Table body containing data -->
	<TableBody class="divide-y divide-gray-200 dark:divide-gray-700">
		{#each data as item (item.id)}
			<TableBodyRow class="bg-white dark:bg-gray-800">
				{#each config.columns as column}
					{#if shouldShowColumn(column)}
						<TableBodyCell
							class={column.key === 'id' ? 'px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white' : 'px-6 py-4'}
						>
							{#if column.type === 'badge'}
								{@const badgeData = renderCellContent(item, column)}
								<Badge color={badgeData.color}>
									{badgeData.text}
								</Badge>
							{:else if column.type === 'custom'}
								{@html renderCellContent(item, column)}
							{:else}
								{renderCellContent(item, column)}
							{/if}
						</TableBodyCell>
					{/if}
				{/each}
				
				{#if config.actions && config.actions.length > 0}
					<TableBodyCell class="px-6 py-4">
						<div class="flex space-x-2">
							{#each config.actions as action}
								{#if shouldShowAction(action)}
									<Button
										size="xs"
										color={action.color || 'alternative'}
										href={action.href ? action.href.replace('{id}', item.id) : undefined}
										onclick={action.onclick ? () => action.onclick(item) : undefined}
										title={action.title}
									>
										{#if action.icon === 'view'}
											<EyeOutline class="me-1.5 h-3.5 w-3.5" />
										{:else if action.icon === 'edit'}
											<EditOutline class="me-1.5 h-3.5 w-3.5" />
										{/if}
										{action.label}
									</Button>
								{/if}
							{/each}
						</div>
					</TableBodyCell>
				{/if}
			</TableBodyRow>
		{:else}
			<!-- Row displayed when there is no data -->
			<TableBodyRow>
				<TableBodyCell colspan={totalColumns} class="text-center px-6 py-4">
					{config.emptyMessage || 'No data found.'}
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
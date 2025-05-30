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

	// Pre-filter columns and actions for better performance
	const visibleColumns = $derived(
		config.columns.filter(column => 
			!column.condition || column.condition(currentUser())
		)
	);
	
	const visibleActions = $derived(
		config.actions?.filter(action => 
			!action.permission || hasPermission(currentUser(), action.permission)
		) || []
	);
	
	const totalColumns = $derived(visibleColumns.length + (visibleActions.length > 0 ? 1 : 0));

	/**
	 * Get icon component for action
	 * @param {string} iconType - Icon type identifier
	 * @returns {Component} Icon component
	 */
	function getActionIcon(iconType) {
		switch (iconType) {
			case 'view': return EyeOutline;
			case 'edit': return EditOutline;
			default: return null;
		}
	}
</script>

<!-- Flowbite Table component with hover effect and constrained height -->
<Table hoverable={true} shadow divClass="relative max-h-[70vh] overflow-x-auto overflow-y-auto">
	<!-- Sticky table header -->
	<TableHead
		class="sticky top-0 z-10 bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400"
	>
		{#each visibleColumns as column}
			<TableHeadCell>{column.label}</TableHeadCell>
		{/each}
		{#if visibleActions.length > 0}
			<TableHeadCell>Actions</TableHeadCell>
		{/if}
	</TableHead>
	
	<!-- Table body containing data -->
	<TableBody class="divide-y divide-gray-200 dark:divide-gray-700">
		{#each data as item (item.id)}
			<TableBodyRow class="bg-white dark:bg-gray-800">
				{#each visibleColumns as column}
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
				{/each}
				
				{#if visibleActions.length > 0}
					<TableBodyCell class="px-6 py-4">
						<div class="flex space-x-2">
							{#each visibleActions as action}
								<Button
									size="xs"
									color={action.color || 'alternative'}
									href={action.href ? action.href.replace('{id}', item.id) : undefined}
									onclick={action.onclick ? () => action.onclick(item) : undefined}
									title={action.title}
								>
									{@const IconComponent = getActionIcon(action.icon)}
									{#if IconComponent}
										<IconComponent class="me-1.5 h-3.5 w-3.5" />
									{/if}
									{action.label}
								</Button>
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
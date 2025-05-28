<script>
	import {
		Button,
		Badge,
		Table,
		TableBody,
		TableBodyRow,
		TableBodyCell,
		TableHead,
		TableHeadCell,
		Tooltip
	} from 'flowbite-svelte';
	import { PlusOutline, EyeOutline, EditOutline, MessageDotsOutline, CodeBranchOutline } from 'flowbite-svelte-icons';
	import { formatDate } from '$lib/utils';
	import DataTable from '$lib/components/DataTable.svelte';
	import { FilterType } from '$lib/utils/filter';
	import { getContext } from 'svelte';
	import { Container } from '$lib/components/layout';
	import { hasPermission } from '$lib/utils/permissions';

	const currentUser = getContext('user');

	// Component props
	let { data } = $props();

	// Breadcrumb items definition
	const breadcrumbItems = $derived([{ label: 'Chat Templates', href: '/admin/chat-template' }]);

	// Configuration for the DataTable filter component
	const filterConfig = $derived({
		name: {
			type: FilterType.STRING,
			label: 'Name'
		},
		...(currentUser()?.is_super_admin && {
			domain_name: {
				type: FilterType.STRING,
				label: 'Domain Name'
			}
		}),
		category: {
			type: FilterType.STRING,
			label: 'Category'
		},
		description: {
			type: FilterType.STRING,
			label: 'Description'
		},
		is_default: {
			type: FilterType.BOOL,
			label: 'Default Template'
		},
		is_active: {
			type: FilterType.BOOL,
			label: 'Status Active'
		},
		created_at: {
			type: FilterType.DATE,
			label: 'Created Date'
		},
		updated_at: {
			type: FilterType.DATE,
			label: 'Updated Date'
		}
	});

	/**
	 * Extract template variables from content using regex
	 * @param {string} content - Template content
	 * @returns {string[]} Array of variable names
	 */
	function extractTemplateVariables(content) {
		if (!content) return [];
		const regex = /\{\{\s*([^}]+)\s*\}\}/g;
		const variables = [];
		let match;
		while ((match = regex.exec(content)) !== null) {
			variables.push(match[1].trim());
		}
		return [...new Set(variables)]; // Remove duplicates
	}

	/**
	 * Get preview of template content with highlighted variables
	 * @param {string} content - Template content
	 * @returns {string} Truncated content for preview
	 */
	function getContentPreview(content) {
		if (!content) return 'No content';
		return content.length > 100 ? content.substring(0, 100) + '...' : content;
	}

	const tableColspan = $derived(currentUser().is_super_admin ? 12 : 11);
</script>

<!-- Use Container component -->
<Container breadcrumb={breadcrumbItems} title="Chat Templates">
	{#snippet headerActions()}
		{#if hasPermission(currentUser(), 'chat-template/create')}
			<Button href="/admin/chat-template/add">
				<PlusOutline class="me-2 h-4 w-4" /> Add New Template
			</Button>
		{/if}
	{/snippet}

	<!-- DataTable component wrapping the table -->
	<DataTable data={data.chatTemplates} meta={data.meta} {filterConfig}>
		<!-- Flowbite Table component with hover effect and constrained height -->
		<Table hoverable={true} class="min-w-full">
			<TableHead>
				<TableHeadCell>ID</TableHeadCell>
				<TableHeadCell>Name</TableHeadCell>
				{#if currentUser().is_super_admin}
					<TableHeadCell>Domain</TableHeadCell>
				{/if}
				<TableHeadCell>Category</TableHeadCell>
				<TableHeadCell>Description</TableHeadCell>
				<TableHeadCell>Content Preview</TableHeadCell>
				<TableHeadCell>Variables</TableHeadCell>
				<TableHeadCell>Default</TableHeadCell>
				<TableHeadCell>Status</TableHeadCell>
				<TableHeadCell>Created</TableHeadCell>
				<TableHeadCell>Updated</TableHeadCell>
				<TableHeadCell>Actions</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each data.chatTemplates as template}
					{@const variables = extractTemplateVariables(template.content)}
					<TableBodyRow>
						<TableBodyCell>{template.id}</TableBodyCell>
						<TableBodyCell class="font-medium text-gray-900 dark:text-white">
							<div class="flex items-center gap-2">
								<MessageDotsOutline class="h-4 w-4 text-gray-500" />
								{template.name}
							</div>
						</TableBodyCell>
						{#if currentUser().is_super_admin}
							<TableBodyCell>{template.domain?.name || 'N/A'}</TableBodyCell>
						{/if}
						<TableBodyCell>
							<Badge color="blue" class="text-xs">{template.category}</Badge>
						</TableBodyCell>
						<TableBodyCell class="max-w-xs">
							<div class="truncate text-sm text-gray-600 dark:text-gray-400">
								{template.description || 'No description'}
							</div>
						</TableBodyCell>
						<TableBodyCell class="max-w-sm">
							<div class="truncate text-sm font-mono bg-gray-50 dark:bg-gray-800 p-2 rounded">
								{getContentPreview(template.content)}
							</div>
						</TableBodyCell>
						<TableBodyCell>
							{#if variables.length > 0}
								<div class="flex flex-wrap gap-1">
									{#each variables.slice(0, 3) as variable}
										<Badge color="purple" class="text-xs flex items-center gap-1">
											<CodeBranchOutline class="h-3 w-3" />
											{variable}
										</Badge>
									{/each}
									{#if variables.length > 3}
										<Badge color="gray" class="text-xs">+{variables.length - 3}</Badge>
									{/if}
								</div>
								<Tooltip class="w-auto max-w-xs">
									<div class="text-sm">
										<strong>Template Variables:</strong><br/>
										{#each variables as variable}
											• {{variable}}<br/>
										{/each}
									</div>
								</Tooltip>
							{:else}
								<span class="text-gray-400 text-xs">No variables</span>
							{/if}
						</TableBodyCell>
						<TableBodyCell>
							<Badge color={template.is_default ? 'yellow' : 'gray'} class="text-xs">
								{template.is_default ? 'Default' : 'Custom'}
							</Badge>
						</TableBodyCell>
						<TableBodyCell>
							<Badge color={template.is_active ? 'green' : 'red'} class="text-xs">
								{template.is_active ? 'Active' : 'Inactive'}
							</Badge>
						</TableBodyCell>
						<TableBodyCell class="text-sm">{formatDate(template.created_at)}</TableBodyCell>
						<TableBodyCell class="text-sm">{formatDate(template.updated_at)}</TableBodyCell>
						<TableBodyCell>
							<div class="flex items-center gap-2">
								{#if hasPermission(currentUser(), 'chat-template/show')}
									<Button
										size="xs"
										color="blue"
										href={`/admin/chat-template/${template.id}`}
									>
										<EyeOutline class="h-3 w-3" />
									</Button>
								{/if}
								{#if hasPermission(currentUser(), 'chat-template/update')}
									<Button
										size="xs"
										color="green"
										href={`/admin/chat-template/${template.id}/edit`}
									>
										<EditOutline class="h-3 w-3" />
									</Button>
								{/if}
							</div>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</DataTable>
</Container>
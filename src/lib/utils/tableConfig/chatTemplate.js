import {
	createTextColumn,
	createDateColumn,
	createBadgeColumn,
	createViewAction,
	createEditAction,
	createDomainColumn
} from './index.js';

// Helper function to get content preview
function getContentPreview(content) {
	if (!content) return 'No content';
	return content.length > 100 ? content.substring(0, 100) + '...' : content;
}

export function getChatTemplateTableConfig(isSuperAdmin = false) {
	const columns = [
		createTextColumn('id', 'ID'),
		{
			key: 'name',
			label: 'Name',
			type: 'custom',
			formatter: (item) => `
				<div class="flex items-center gap-2 font-medium text-gray-900 dark:text-white">
					<svg class="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
					</svg>
					${item.name}
				</div>
			`
		},
		...(isSuperAdmin ? [createDomainColumn()] : []),
		{
			key: 'description',
			label: 'Description',
			type: 'custom',
			formatter: (item) => `
				<div class="max-w-xs truncate text-sm text-gray-600 dark:text-gray-400">
					${item.description || 'No description'}
				</div>
			`
		},
		{
			key: 'content',
			label: 'Content Preview',
			type: 'custom',
			formatter: (item) => `
				<div class="max-w-sm truncate text-sm font-mono bg-gray-50 dark:bg-gray-800 p-2 rounded">
					${getContentPreview(item.content)}
				</div>
			`
		},
		createBadgeColumn(
			'is_default',
			'Set as default',
			(value) => (value ? 'Yes' : 'No'),
			'gray',
			(value) => (value ? 'yellow' : 'gray')
		),
		createBadgeColumn(
			'is_active',
			'Status',
			(value) => (value ? 'Active' : 'Inactive'),
			'gray',
			(value) => (value ? 'green' : 'red')
		),
		createDateColumn('created_at', 'Created')
	];

	// Remove the custom action - it will be handled in the component
	const actions = [
		createViewAction('/admin/chat-template', 'chat-template/show'),
		createEditAction('/admin/chat-template', 'chat-template/update')
	];

	return {
		columns,
		actions
	};
}

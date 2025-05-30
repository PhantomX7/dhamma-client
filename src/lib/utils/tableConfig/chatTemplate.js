import {
	createTextColumn,
	createDateColumn,
	createBadgeColumn,
	createViewAction,
	createEditAction
} from './index.js';
// import { Badge, Tooltip } from 'flowbite-svelte';
// import { MessageDotsOutline, CodeBranchOutline } from 'flowbite-svelte-icons';

// Helper function to extract template variables
function extractTemplateVariables(content) {
	if (!content) return [];
	const matches = content.match(/{{\s*([^}]+)\s*}}/g);
	return matches ? matches.map((match) => match.replace(/[{}\s]/g, '')) : [];
}

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
		...(isSuperAdmin
			? [
					{
						key: 'domain',
						label: 'Domain',
						type: 'custom',
						formatter: (item) =>
							item.domain?.name || '<span class="text-gray-400 dark:text-gray-500">N/A</span>'
					}
				]
			: []),
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
		{
			key: 'content',
			label: 'Variables',
			type: 'custom',
			formatter: (item) => {
				const variables = extractTemplateVariables(item.content);
				if (variables.length === 0) {
					return '<span class="text-gray-400 text-xs">No variables</span>';
				}

				const displayVars = variables.slice(0, 3);
				const extraCount = variables.length - 3;

				let html = '<div class="flex flex-wrap gap-1">';
				displayVars.forEach((variable) => {
					html += `
						<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
							<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
							</svg>
							${variable}
						</span>
					`;
				});

				if (extraCount > 0) {
					html += `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">+${extraCount}</span>`;
				}

				html += '</div>';
				return html;
			}
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

	const actions = [
		createViewAction('/admin/chat-template', 'chat-template/show'),
		createEditAction('/admin/chat-template', 'chat-template/update')
	];

	return {
		columns,
		actions
	};
}

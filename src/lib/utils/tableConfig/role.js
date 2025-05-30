import { createTextColumn, createDateColumn, createViewAction, createEditAction, createBadgeColumn } from './index.js';

export function getRoleTableConfig(isSuperAdmin = false) {
	const columns = [
		createTextColumn('id', 'ID'),
		...(isSuperAdmin ? [{
			key: 'domain',
			label: 'Domain',
			type: 'custom',
			formatter: (item) => item.domain?.name || '<span class="text-gray-400 dark:text-gray-500">N/A</span>'
		}] : []),
		createTextColumn('name', 'Role Name'),
		{
			key: 'description',
			label: 'Description',
			type: 'custom',
			formatter: (item) => `
				<div class="max-w-sm truncate">
					${item.description || 'N/A'}
				</div>
			`
		},
		createBadgeColumn(
			'is_active',
			'Status',
			(value) => value ? 'Active' : 'Inactive',
			'gray',
			(value) => value ? 'green' : 'red'
		),
		createDateColumn('created_at', 'Created At')
	];

	const actions = [
		createViewAction('/admin/role', 'role/show'),
		createEditAction('/admin/role', 'role/update')
	];

	return {
		columns,
		actions
	};
}
import { createTextColumn, createDateColumn, createViewAction, createEditAction, createBadgeColumn, createDomainColumn } from './index.js';

export function getRoleTableConfig(isSuperAdmin = false) {
	const columns = [
		createTextColumn('id', 'ID'),
		...(isSuperAdmin ? [createDomainColumn()] : []),
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
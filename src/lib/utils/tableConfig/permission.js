import { createTextColumn, createDateColumn, createViewAction, createBadgeColumn } from './index.js';

export function getPermissionTableConfig() {
	const columns = [
		createTextColumn('id', 'ID'),
		createTextColumn('name', 'Name'),
		createTextColumn('code', 'Code'),
		createTextColumn('object', 'Category'),
		createTextColumn('action', 'Action'),
		createTextColumn('type', 'Type'),
		createBadgeColumn(
			'is_domain_specific',
			'Domain Specific',
			(value) => value ? 'Yes' : 'No',
			'gray',
			(value) => value ? 'blue' : 'gray'
		),
		createDateColumn('created_at', 'Created At')
	];

	const actions = [
		createViewAction('/admin/permission', 'permission/show')
	];

	return {
		columns,
		actions
	};
}
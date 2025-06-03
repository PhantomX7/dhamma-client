/**
 * Follower table configuration
 * Defines columns and actions for the follower admin table
 */

import {
	createIdColumn,
	createTextColumn,
	createBadgeColumn,
	createDateColumn,
	createViewAction,
	createEditAction,
	createDomainColumn,
} from './index.js';

/**
 * Configuration for the follower admin table
 * @param {boolean} isSuperAdmin - Whether current user is super admin
 * @returns {Object} Complete table configuration for followers
 */
export function getFollowerTableConfig(isSuperAdmin = false) {
	const columns = [
		createIdColumn(),
		...(isSuperAdmin ? [createDomainColumn()] : []),
		createTextColumn('name', 'Name'),
		{
			key: 'phone',
			label: 'Phone',
			type: 'custom',
			formatter: (item) => item.phone || 'N/A'
		},
		{
			key: 'points',
			label: 'Points',
			type: 'custom',
			formatter: (item) => {
				const points = item.points || 0;
				return `<span class="font-medium text-blue-600 dark:text-blue-400">${points}</span>`;
			}
		},
		createBadgeColumn(
			'is_blood_donor',
			'Blood Donor',
			(value) => (value ? 'Yes' : 'No'),
			'gray',
			(value) => (value ? 'green' : 'red')
		),
		createBadgeColumn(
			'is_youth',
			'Muda Mudi',
			(value) => (value ? 'Yes' : 'No'),
			'gray',
			(value) => (value ? 'green' : 'red')
		),
		createDateColumn('created_at', 'Created At')
	];

	return {
		columns,
		actions: [
			createViewAction('/admin/follower', 'follower/show'),
			createEditAction('/admin/follower', 'follower/edit'),
		],
		emptyMessage: 'No followers found.'
	};
}

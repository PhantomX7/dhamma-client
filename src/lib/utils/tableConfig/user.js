/**
 * User table configuration
 * Defines columns and actions for the user admin table
 */

import {
  createIdColumn,
  createTextColumn,
  createBadgeColumn,
  createDateColumn,
  createViewAction,
} from './index.js';

/**
 * Configuration for the user admin table
 * @param {boolean} isSuperAdmin - Whether current user is super admin
 * @returns {Object} Complete table configuration for users
 */
export function getUserTableConfig(isSuperAdmin = false) {
  const columns = [
    createIdColumn(),
    createTextColumn('username', 'Username'),
    // createTextColumn('email', 'Email'),
    createBadgeColumn(
      'is_active',
      'Status',
      (value) => value ? 'Active' : 'Inactive',
      'gray', 
      (value) => value ? 'green' : 'red'
    ),
    createBadgeColumn(
      'is_super_admin',
      'Type',
      (value) => value ? 'Super Admin' : 'Regular',
      'gray',
      (value) => value ? 'purple' : 'blue'
    ),
    createDateColumn('created_at', 'Created At')
  ];

  // Add domain column for super admins
  if (isSuperAdmin) {
    const domainsColumn = {
      key: 'domains',
      label: 'Domains',
      type: 'custom',
      formatter: (item) => {
        if (item.domains?.length > 0) {
          return item.domains.map(d => d.name).join(', ');
        }
        return '<span class="text-gray-400 dark:text-gray-500">No domains</span>';
      }
    };
    columns.splice(3, 0, domainsColumn);
  }

  return {
    columns,
    actions: [
      createViewAction('/admin/user', 'user/show')
    ],
    emptyMessage: 'No users found.'
  };
}
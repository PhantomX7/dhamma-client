/**
 * Domain table configuration
 * Defines columns and actions for the domain admin table
 */

import {
  createIdColumn,
  createTextColumn,
  createBadgeColumn,
  createDateColumn,
  createViewAction,
  createEditAction
} from './index.js';

/**
 * Configuration for the domain admin table
 * @returns {Object} Complete table configuration for domains
 */
export function getDomainTableConfig() {
  return {
    columns: [
      createIdColumn(),
      createTextColumn('name', 'Name'),
      createTextColumn('code', 'Code'),
      createBadgeColumn(
        'is_active',
        'Status',
        (value) => value ? 'Active' : 'Inactive',
        'gray',
        (value) => value ? 'green' : 'red'
      ),
      {
        key: 'description',
        label: 'Description',
        type: 'custom',
        formatter: (item) => {
          const desc = item.description || 'N/A';
          return `<span class="max-w-sm truncate block">${desc}</span>`;
        }
      },
      createDateColumn('created_at', 'Created At')
    ],
    actions: [
      createViewAction('/admin/domain', 'domain/show'),
      createEditAction('/admin/domain', 'domain/edit')
    ],
    emptyMessage: 'No domains found.'
  };
}
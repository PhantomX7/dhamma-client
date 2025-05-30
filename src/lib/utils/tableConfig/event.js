/**
 * Event table configuration
 * Defines columns and actions for the event admin table
 */

import {
  createIdColumn,
  createTextColumn,
  createDateColumn,
  createViewAction,
  createEditAction,
  createDomainColumn
} from './index.js';

/**
 * Configuration for the event admin table
 * @param {boolean} isSuperAdmin - Whether current user is super admin
 * @returns {Object} Complete table configuration for events
 */
export function getEventTableConfig(isSuperAdmin = false) {
  const columns = [
    createIdColumn(),
    ...(isSuperAdmin ? [createDomainColumn()] : []),
    createTextColumn('name', 'Name'),
    {
      key: 'points_awarded',
      label: 'Points Awarded',
      type: 'custom',
      formatter: (item) => {
        const points = item.points_awarded || 0;
        return `<span class="font-medium text-green-600 dark:text-green-400">${points}</span>`;
      }
    },
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
  ];

  return {
    columns,
    actions: [
      createViewAction('/admin/event', 'event/show'),
      createEditAction('/admin/event', 'event/edit')
    ],
    emptyMessage: 'No events found.'
  };
}
<script>
	import {
		Badge,
		Button,
		Table,
		TableBody,
		TableBodyRow,
		TableBodyCell,
		TableHead,
		TableHeadCell,
		Card
	} from 'flowbite-svelte';
	import { ListOutline, EditOutline, LockOutline, InfoCircleOutline } from 'flowbite-svelte-icons'; // Added InfoCircleOutline
	import { getContext } from 'svelte';
	import { formatDate } from '$lib/utils';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import DetailItem from '$lib/components/layout/DetailItem.svelte';

	// Component props
	let { data } = $props();
	const role = $derived(data.role);
	const currentUser = getContext('user');
	import { hasPermission, hasAnyPermission } from '$lib/utils/permissions';

	// Breadcrumb items
	const breadcrumbItems = $derived([{ href: '/admin/role', label: 'Roles' }, { label: role.name }]); // Use $derived

	/**
	 * Groups the role's assigned permissions by their 'object' property.
	 * @returns {Map<string, Array<object>>} A Map where keys are object categories
	 *          and values are arrays of permissions assigned to the role.
	 */
	function groupPermissionsByObject() {
		const grouped = new Map();
		const permissions = role?.permissions || []; // Safely access permissions

		if (!Array.isArray(permissions)) {
			console.error('Role permissions is not an array:', permissions);
			return grouped; // Return empty map if data is not as expected
		}

		permissions.forEach((permission) => {
			// Use object as the category grouping key
			const objectCategory = permission.object || 'Uncategorized';

			if (!grouped.has(objectCategory)) {
				grouped.set(objectCategory, []);
			}
			grouped.get(objectCategory).push(permission);
		});

		// Sort categories alphabetically
		const sortedGrouped = new Map([...grouped.entries()].sort());

		// Sort permissions within each category alphabetically by action
		for (const categoryPermissions of sortedGrouped.values()) {
			categoryPermissions.sort((a, b) => (a.action || '').localeCompare(b.action || ''));
		}

		return sortedGrouped;
	}

	// Create derived value for grouped permissions
	let permissionsByObject = $derived(groupPermissionsByObject());
</script>

<!-- Main page container -->
<div class="min-h-screen p-4 md:p-6 dark:bg-gray-900">
	<!-- Breadcrumb navigation -->
	<Breadcrumb class="mb-6" items={breadcrumbItems} />

	<!-- Page header -->
	<div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Role Details</h1>
		<div class="flex flex-shrink-0 gap-2">
			{#if hasAnyPermission(currentUser(), ['role/add-permissions', 'role/delete-permissions'])}
				<Button href="/admin/role/{role.id}/permissions">
					<LockOutline class="me-2 h-4 w-4" /> Manage Permissions
				</Button>
			{/if}
			{#if hasPermission(currentUser(), 'role/udpate')}
				<Button href="/admin/role/{role.id}/edit">
					<EditOutline class="me-2 h-4 w-4" /> Edit Role
				</Button>
			{/if}
			<Button color="light" href="/admin/role">
				<ListOutline class="me-2 h-4 w-4" /> Back to List
			</Button>
		</div>
	</div>

	<!-- General Information Card -->
	<Card padding="lg" size="2xl" class="mb-8">
		<h2 class="mb-6 text-xl font-semibold text-gray-900 dark:text-white">General Information</h2>
		<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
			<DetailItem label="ID">{role.id}</DetailItem>
			<DetailItem label="Domain">{role.domain?.name || 'N/A'}</DetailItem>
			<DetailItem label="Role Name">{role.name}</DetailItem>
			<DetailItem label="Description">{role.description || 'N/A'}</DetailItem>
			<DetailItem label="Active">
				<Badge large rounded color={role.is_active ? 'green' : 'red'}>
					{role.is_active ? 'Active' : 'Inactive'}
				</Badge>
			</DetailItem>
			<DetailItem label="Created At">{formatDate(role.created_at)}</DetailItem>
			<DetailItem label="Updated At">{formatDate(role.updated_at)}</DetailItem>
		</div>
	</Card>

	<!-- Assigned Permissions Card -->
	<Card padding="lg" size="2xl">
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-xl font-semibold text-gray-900 dark:text-white">Assigned Permissions</h2>
			{#if hasAnyPermission(currentUser(), ['role/add-permissions', 'role/delete-permissions'])}
				<Button size="sm" href="/admin/role/{role.id}/permissions">Manage Permissions</Button>
			{/if}
		</div>

		{#if !permissionsByObject || permissionsByObject.size === 0}
			<!-- No permissions message -->
			<div
				class="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 px-6 py-10 text-center dark:border-gray-700 dark:bg-gray-800"
			>
				<InfoCircleOutline class="mb-3 h-8 w-8 text-gray-400 dark:text-gray-500" />
				<p class="text-gray-500 dark:text-gray-400">No permissions assigned to this role.</p>
				{#if hasAnyPermission(currentUser(), ['role/add-permissions', 'role/delete-permissions'])}
					<Button class="mt-4" size="sm" href="/admin/role/{role.id}/permissions">
						Assign Permissions
					</Button>
				{/if}
			</div>
		{:else}
			<!-- Permissions Table Container -->
			<div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
				<Table hoverable={true} class="min-w-full text-sm">
					<TableHead
						class="bg-gray-100 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400"
					>
						<!-- Removed Category Header -->
						<TableHeadCell class="px-4 py-3">Action</TableHeadCell>
						<TableHeadCell class="px-4 py-3">Description</TableHeadCell>
						<!-- Removed Status and Actions columns as they are implicit or not needed here -->
					</TableHead>
					<TableBody class="divide-y divide-gray-200 dark:divide-gray-700">
						{#each Array.from(permissionsByObject.entries()) as [objectCategory, permissions]}
							<!-- Category Header Row -->
							<TableBodyRow class="dark:bg-gray-750 bg-gray-50">
								<TableBodyCell colspan="2" class="px-4 py-2">
									<h3
										class="text-xs font-semibold tracking-wider text-gray-700 uppercase dark:text-gray-300"
									>
										{objectCategory}
									</h3>
								</TableBodyCell>
							</TableBodyRow>

							<!-- Permission Rows for this category -->
							{#each permissions as permission (permission.id)}
								<TableBodyRow class="bg-white dark:bg-gray-800">
									<TableBodyCell class="px-4 py-3">
										<Badge color="blue" class="px-2.5 py-0.5 capitalize">
											{permission.action || '—'}
										</Badge>
									</TableBodyCell>
									<TableBodyCell
										class="max-w-sm truncate px-4 py-3 text-gray-700 dark:text-gray-300"
									>
										{permission.description || '—'}
									</TableBodyCell>
								</TableBodyRow>
							{/each}
						{/each}
					</TableBody>
				</Table>
			</div>
		{/if}
	</Card>
</div>

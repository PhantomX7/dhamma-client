<script>
	import {
		Badge,
		Button,
		Card,
		Table,
		TableBody,
		TableBodyRow,
		TableBodyCell,
		TableHead,
		TableHeadCell,
		Checkbox,
		Alert
	} from 'flowbite-svelte';
	import {
		ChevronLeftOutline,
		PlusOutline,
		CloseOutline,
		InfoCircleOutline
	} from 'flowbite-svelte-icons';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	let { data } = $props();

	// Create derived values for role and permissions that update when data changes
	let role = $derived(data.role);

	// Track selected permissions for bulk operations
	let selectedPermissions = $state(new Set());
	let showSuccessAlert = $state(false);
	let showErrorAlert = $state(false);
	let alertMessage = $state('');

	// Create a set of permission codes that are already assigned to the role
	// Since role.permissions is already an array of permission codes (strings)
	let rolePermissionCodes = $derived(new Set(data.role.permissions));

	// Group permissions by object field
	let permissionsByCategory = $derived(groupPermissionByCategory());

	// Breadcrumb items
	const breadcrumbItems = $derived([
		{ href: '/admin/role', label: 'Roles' },
		{ href: `/admin/role/${role.id}`, label: role.name },
		{ label: 'Manage Permissions' }
	]);

	/**
	 * Groups permissions by their 'object' property.
	 * @returns {Map<string, Array<object>>} A Map where keys are object categories and values are arrays of permissions.
	 */
	function groupPermissionByCategory() {
		const grouped = new Map();

		// Add a check for safety
		if (!Array.isArray(data.allPermissions)) {
			console.error('allPermissions is not an array:', data.allPermissions);
			return grouped; // Return empty map if data is not as expected
		}

		data.allPermissions.forEach((permission) => {
			// Use object as the category grouping key
			const objectCategory = permission.object || 'Uncategorized';

			if (!grouped.has(objectCategory)) {
				grouped.set(objectCategory, []);
			}

			grouped.get(objectCategory).push(permission);
		});

		return grouped;
	}

	/**
	 * Toggles the selection state for all permissions within a specific category.
	 * @param {string} category - The category (object name) to toggle selection for.
	 * @param {boolean} checked - The desired selection state (true for selected, false for deselected).
	 */
	function toggleSelectAll(category, checked) {
		const categoryPermissions = permissionsByCategory.get(category) || [];

		if (checked) {
			categoryPermissions.forEach((permission) => {
				selectedPermissions.add(permission.code);
			});
		} else {
			categoryPermissions.forEach((permission) => {
				selectedPermissions.delete(permission.code);
			});
		}

		// Force update
		selectedPermissions = new Set(selectedPermissions);
	}

	/**
	 * Checks if all permissions within a specific category are currently selected.
	 * @param {string} category - The category (object name) to check.
	 * @returns {boolean} True if all permissions in the category are selected, false otherwise.
	 */
	function areAllSelected(category) {
		const categoryPermissions = permissionsByCategory.get(category) || [];
		return categoryPermissions.every((permission) => selectedPermissions.has(permission.code));
	}

	/**
	 * Returns an enhancement function for form submissions to handle API responses and UI updates.
	 * @returns {Function} The SvelteKit enhance function.
	 */
	function handleSubmit() {
		return async ({ result, update }) => {
			// Only proceed if we have a successful result
			if (result.type === 'success') {
				// Show success message
				showSuccessAlert = true;
				alertMessage = result.data?.message || 'Permissions updated successfully';

				// Invalidate data to refresh the UI
				await invalidateAll();
				await update({ invalidateAll: true });

				// Clear selections
				selectedPermissions = new Set();

				// Hide alert after 3 seconds
				setTimeout(() => {
					showSuccessAlert = false;
				}, 3000);
			} else if (result.type === 'error') {
				// Show error message
				showErrorAlert = true;
				alertMessage = result.data?.message || 'Failed to update permissions';

				// Hide alert after 3 seconds
				setTimeout(() => {
					showErrorAlert = false;
				}, 3000);
			}
		};
	}
</script>

<!-- Main page container -->
<div class="min-h-screen p-4 md:p-6 dark:bg-gray-900">
	<!-- Breadcrumb navigation -->
	<Breadcrumb class="mb-6" items={breadcrumbItems} />

	<!-- Page header -->
	<div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">
			Manage Permissions for {role.name}
		</h1>
		<Button color="light" href="/admin/role/{role.id}">
			<ChevronLeftOutline class="me-2 h-4 w-4" /> Back to Role
		</Button>
	</div>

	<!-- Alert messages -->
	{#if showSuccessAlert}
		<Alert color="green" class="mb-4">
			<span class="font-medium">Success!</span>
			{alertMessage}
		</Alert>
	{/if}

	{#if showErrorAlert}
		<Alert color="red" class="mb-4">
			<span class="font-medium">Error!</span>
			{alertMessage}
		</Alert>
	{/if}

	<!-- Bulk actions and Permissions Table Card -->
	<Card padding="lg" size="2xl" class="mb-6">
		<div class="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
			<h2 class="text-xl font-semibold text-gray-900 dark:text-white">Permissions</h2>
			<div class="flex flex-shrink-0 gap-2">
				<form method="POST" action="?/assignPermissions" use:enhance={handleSubmit}>
					{#each Array.from(selectedPermissions) as permissionCode}
						<input type="hidden" name="permissions[]" value={permissionCode} />
					{/each}
					<Button type="submit" color="primary" disabled={selectedPermissions.size === 0}>
						<PlusOutline class="me-2 h-4 w-4" /> Assign Selected
					</Button>
				</form>

				<form method="POST" action="?/removePermissions" use:enhance={handleSubmit}>
					{#each Array.from(selectedPermissions) as permissionCode}
						<input type="hidden" name="permissions[]" value={permissionCode} />
					{/each}
					<Button type="submit" color="red" disabled={selectedPermissions.size === 0}>
						<CloseOutline class="me-2 h-4 w-4" /> Remove Selected
					</Button>
				</form>
			</div>
		</div>

		{#if permissionsByCategory.size === 0}
			<!-- No permissions message -->
			<div
				class="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 px-6 py-10 text-center dark:border-gray-700 dark:bg-gray-800"
			>
				<InfoCircleOutline class="mb-3 h-8 w-8 text-gray-400 dark:text-gray-500" />
				<p class="text-gray-500 dark:text-gray-400">No permissions available in the system.</p>
			</div>
		{:else}
			<!-- Single Table for all permissions -->
			<div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
				<Table hoverable={true} class="min-w-full">
					<TableHead class="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
						<TableHeadCell class="w-10 px-4 py-3">
							<span class="sr-only">Select</span>
						</TableHeadCell>
						<TableHeadCell class="px-4 py-3">Action</TableHeadCell>
						<TableHeadCell class="px-4 py-3">Description</TableHeadCell>
						<TableHeadCell class="px-4 py-3">Status</TableHeadCell>
						<TableHeadCell class="w-20 px-4 py-3 text-center"> Actions </TableHeadCell>
					</TableHead>
					<TableBody class="divide-y divide-gray-200 dark:divide-gray-700">
						{#each Array.from(permissionsByCategory.entries()) as [objectCategory, permissions]}
							<!-- Category Header Row -->
							<TableBodyRow class="bg-gray-50 dark:bg-gray-700">
								<TableBodyCell colspan="5" class="px-4 py-2">
									<div class="flex items-center justify-between">
										<h3 class="text-sm font-semibold uppercase text-gray-700 dark:text-gray-300">
											{objectCategory}
										</h3>
										<Checkbox
											checked={areAllSelected(objectCategory)}
											onchange={(e) => toggleSelectAll(objectCategory, e.target.checked)}
											class="text-xs"
										>
											Select All
										</Checkbox>
									</div>
								</TableBodyCell>
							</TableBodyRow>

							<!-- Permission Rows for this category -->
							{#each permissions as permission (permission.id)}
								<TableBodyRow class="bg-white dark:bg-gray-800">
									<TableBodyCell class="px-4 py-3">
										<Checkbox
											checked={selectedPermissions.has(permission.code)}
											onchange={(e) => {
												if (e.target.checked) {
													selectedPermissions.add(permission.code);
												} else {
													selectedPermissions.delete(permission.code);
												}
												selectedPermissions = new Set(selectedPermissions); // Force update
											}}
										/>
									</TableBodyCell>
									<TableBodyCell class="px-4 py-3">
										<Badge color="blue" class="px-2.5 py-0.5 capitalize">
											{permission.action || '—'}
										</Badge>
									</TableBodyCell>
									<TableBodyCell class="max-w-sm truncate px-4 py-3 text-gray-700 dark:text-gray-300">
										{permission.description || '—'}
									</TableBodyCell>
									<TableBodyCell class="px-4 py-3">
										<Badge color={rolePermissionCodes.has(permission.code) ? 'green' : 'gray'}>
											{rolePermissionCodes.has(permission.code) ? 'Assigned' : 'Not Assigned'}
										</Badge>
									</TableBodyCell>
									<TableBodyCell class="whitespace-nowrap px-4 py-3 text-center">
										{#if rolePermissionCodes.has(permission.code)}
											<form method="POST" action="?/removePermissions" use:enhance={handleSubmit} class="inline-block">
												<input type="hidden" name="permissions[]" value={permission.code} />
												<Button type="submit" color="red" size="xs" aria-label="Remove permission">
													<CloseOutline class="h-3 w-3" />
												</Button>
											</form>
										{:else}
											<form method="POST" action="?/assignPermissions" use:enhance={handleSubmit} class="inline-block">
												<input type="hidden" name="permissions[]" value={permission.code} />
												<Button type="submit" color="primary" size="xs" aria-label="Assign permission">
													<PlusOutline class="h-3 w-3" />
												</Button>
											</form>
										{/if}
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

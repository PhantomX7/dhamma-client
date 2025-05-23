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
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { getContext } from 'svelte';
	import { Container } from '$lib/components/layout'; // Import Container
	let { data } = $props();

	// Create derived values for role and permissions that update when data changes
	let role = $derived(data.role);
	const currentUser = getContext('user');
	import { hasPermission } from '$lib/utils/permissions';

	// Track selected permissions for bulk operations
	let selectedPermissions = $state(new Set());
	let showSuccessAlert = $state(false);
	let showErrorAlert = $state(false);
	let alertMessage = $state('');

	// Create a set of permission codes that are already assigned to the role
	let rolePermissionCodes = $derived(new Set(data.role.permissions || []));

	// Group permissions by object field
	let permissionsByCategory = $derived(groupPermissionByCategory());

	// Calculate total number of permissions
	let totalPermissionsCount = $derived(data.allPermissions?.length || 0);

	// Determine if all permissions are selected for the master checkbox
	let areAllSelectedMaster = $derived(
		totalPermissionsCount > 0 && selectedPermissions.size === totalPermissionsCount
	);

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
	 * Toggles the selection state for all permissions.
	 * @param {boolean} checked - The desired selection state (true for selected, false for deselected).
	 */
	function toggleSelectAllMaster(checked) {
		if (!Array.isArray(data.allPermissions)) return;

		if (checked) {
			data.allPermissions.forEach((permission) => {
				selectedPermissions.add(permission.code);
			});
		} else {
			selectedPermissions.clear();
		}
		// Force update
		selectedPermissions = new Set(selectedPermissions);
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

<!-- Use Container component -->
<Container breadcrumb={breadcrumbItems}>

	<!-- Page header -->
	<div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">
			Manage Permissions for <span class="font-medium">{role.name}</span>
		</h1>
		<Button color="light" href="/admin/role/{role.id}" size="md">
			<ChevronLeftOutline class="me-2 h-4 w-4" /> Back to Role
		</Button>
	</div>

	<!-- Alert messages -->
	{#if showSuccessAlert}
		<Alert color="green" class="mb-4" dismissable on:close={() => (showSuccessAlert = false)}>
			<span class="font-medium">Success!</span>
			{alertMessage}
		</Alert>
	{/if}

	{#if showErrorAlert}
		<Alert color="red" class="mb-4" dismissable on:close={() => (showErrorAlert = false)}>
			<span class="font-medium">Error!</span>
			{alertMessage}
		</Alert>
	{/if}

	<!-- Permissions Table Card -->
	<Card size="xl" class="mb-8 p-4">
		<!-- Card Header with Title and Bulk Actions -->
		<div class="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
			<h2 class="text-xl font-semibold text-gray-900 dark:text-white">Permissions</h2>
			<!-- Bulk Action Buttons -->
			<div class="flex flex-shrink-0 gap-2">
				{#if hasPermission(currentUser(), 'role/add-permissions')}
					<form method="POST" action="?/assignPermissions" use:enhance={handleSubmit}>
						{#each Array.from(selectedPermissions) as permissionCode}
							<input type="hidden" name="permissions[]" value={permissionCode} />
						{/each}
						<Button
							type="submit"
							class="cursor-pointer"
							color="primary"
							size="sm"
							disabled={selectedPermissions.size === 0}
						>
							<PlusOutline class="me-1.5 h-3.5 w-3.5" /> Assign Selected
						</Button>
					</form>
				{/if}
				{#if hasPermission(currentUser(), 'role/delete-permissions')}
					<form method="POST" action="?/removePermissions" use:enhance={handleSubmit}>
						{#each Array.from(selectedPermissions) as permissionCode}
							<input type="hidden" name="permissions[]" value={permissionCode} />
						{/each}
						<Button
							type="submit"
							class="cursor-pointer"
							color="red"
							size="sm"
							disabled={selectedPermissions.size === 0}
						>
							<CloseOutline class="me-1.5 h-3.5 w-3.5" /> Remove Selected
						</Button>
					</form>
				{/if}
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
			<!-- Permissions Table Container -->
			<div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
				<Table hoverable={true} class="min-w-full text-sm">
					<TableHead
						class="bg-gray-100 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400"
					>
						<TableHeadCell class="w-10 px-4 py-3">
							<!-- Master Select All Checkbox -->
							<Checkbox
								checked={areAllSelectedMaster}
								disabled={totalPermissionsCount === 0}
								onchange={(e) => toggleSelectAllMaster(e.target.checked)}
								aria-label="Select all permissions"
							/>
						</TableHeadCell>
						<TableHeadCell class="px-4 py-3">Action</TableHeadCell>
						<TableHeadCell class="px-4 py-3">Description</TableHeadCell>
						<TableHeadCell class="px-4 py-3">Status</TableHeadCell>
						<TableHeadCell class="w-20 px-4 py-3 text-center">Actions</TableHeadCell>
					</TableHead>
					<TableBody class="divide-y divide-gray-200 dark:divide-gray-700">
						{#each Array.from(permissionsByCategory.entries()) as [objectCategory, permissions]}
							<!-- Category Header Row -->
							<TableBodyRow class="dark:bg-gray-750 bg-gray-50">
								<TableBodyCell colspan="5" class="px-4 py-2">
									<!-- Removed the per-category checkbox, kept the category title -->
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
											aria-label={`Select permission ${permission.name}`}
										/>
									</TableBodyCell>
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
									<TableBodyCell class="px-4 py-3">
										<Badge
											color={rolePermissionCodes.has(permission.code) ? 'green' : 'gray'}
											class="px-2 py-0.5 text-xs"
										>
											{rolePermissionCodes.has(permission.code) ? 'Assigned' : 'Not Assigned'}
										</Badge>
									</TableBodyCell>
									<TableBodyCell class="px-4 py-3 text-center whitespace-nowrap">
										{#if rolePermissionCodes.has(permission.code)}
											{#if hasPermission(currentUser(), 'role/delete-permissions')}
												<form
													method="POST"
													action="?/removePermissions"
													use:enhance={handleSubmit}
													class="inline-block"
												>
													<input type="hidden" name="permissions[]" value={permission.code} />
													<Button
														class="cursor-pointer"
														type="submit"
														color="red"
														size="xs"
														aria-label="Remove permission"
													>
														<CloseOutline class="h-3 w-3" />
													</Button>
												</form>
											{/if}
										{:else if hasPermission(currentUser(), 'role/add-permissions')}
											<form
												method="POST"
												action="?/assignPermissions"
												use:enhance={handleSubmit}
												class="inline-block"
											>
												<input type="hidden" name="permissions[]" value={permission.code} />
												<Button
													class="cursor-pointer"
													type="submit"
													color="primary"
													size="xs"
													aria-label="Assign permission"
												>
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
</Container>

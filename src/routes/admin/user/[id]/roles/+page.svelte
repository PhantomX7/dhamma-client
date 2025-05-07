<script>
	import {
		Button,
		Badge,
		Card,
		Table,
		TableBody,
		TableBodyRow,
		TableBodyCell,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import {
		ChevronLeftOutline,
		PlusOutline,
		CloseOutline,
		InfoCircleOutline
	} from 'flowbite-svelte-icons';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import AssignRoleModal from '$lib/components/modal/AssignRoleModal.svelte';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { formatDate } from '$lib/utils';
	import { getContext } from 'svelte';

	let { data } = $props();
	let user = $derived(data.user);
	const currentUser = getContext('user');
	import { hasPermission } from '$lib/utils/permissions';

	// Modal state
	let showModal = $state(false);

	const breadcrumbItems = $derived([
		{ href: '/admin/user', label: 'Users' },
		{ href: `/admin/user/${user.id}`, label: user.username },
		{ label: 'Manage Roles' }
	]);

	/**
	 * Groups the user's roles by domain ID using the nested domain object.
	 * @returns {Map<number, {domain: object, roles: object[]}>} A map where keys are domain IDs
	 *          and values are objects containing domain info and an array of user roles for that domain.
	 */
	function getRolesGroupedByDomain() {
		const domainMap = new Map();

		// Ensure user and user_roles exist
		if (!user || !user.user_roles) {
			return domainMap;
		}

		// Populate map with domains and their roles
		user.user_roles.forEach((userRole) => {
			// Ensure the role and domain objects exist within userRole
			if (!userRole.role || !userRole.domain) return;

			const domainId = userRole.domain_id;

			if (!domainMap.has(domainId)) {
				// Directly use the nested domain object
				domainMap.set(domainId, {
					domain: userRole.domain, // Store the full domain object from the userRole
					roles: [] // Initialize roles array
				});
			}
			// Add the userRole (which includes role details) to the correct domain
			domainMap.get(domainId).roles.push(userRole);
		});

		return domainMap;
	}

	// Reactive state for grouped roles
	let rolesByDomain = $derived(getRolesGroupedByDomain());

	/**
	 * Handles the form submission for removing a role.
	 * Invalidates data on success to refresh the UI.
	 * @returns {Function} The enhance callback function.
	 */
	function handleRemoveSubmit() {
		return async ({ result, update }) => {
			if (result && result.type === 'success') {
				await invalidateAll();
				await update({ invalidateAll: true });
			}
		};
	}

	/**
	 * Handles the form submission for adding a role (from the modal).
	 * Invalidates data and closes the modal on success.
	 * @returns {Function} The enhance callback function.
	 */
	function handleAddSubmit() {
		return async ({ result, update }) => {
			// Only proceed if we have a successful result
			if (result && result.type === 'success') {
				// First invalidate all data
				await invalidateAll();
				// Then run the default update behavior
				await update({ invalidateAll: true });
				// Close modal if open
				showModal = false;
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
			Manage Roles for {user.username}
		</h1>
		<!-- Moved Add Role button here and added Back button -->
		<div class="flex flex-shrink-0 gap-2">
			{#if hasPermission(currentUser(), 'user/assign-role')}
				<Button class="cursor-pointer" onclick={() => (showModal = true)}>
					<PlusOutline class="me-2 h-4 w-4" /> Add Role
				</Button>
			{/if}
			<Button color="light" href="/admin/user/{user.id}">
				<ChevronLeftOutline class="me-2 h-4 w-4" /> Back to User
			</Button>
		</div>
	</div>

	<!-- Display message if no roles are assigned -->
	{#if rolesByDomain.size === 0}
		<div
			class="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 px-6 py-10 text-center dark:border-gray-700 dark:bg-gray-800"
		>
			<InfoCircleOutline class="mb-3 h-8 w-8 text-gray-400 dark:text-gray-500" />
			<p class="text-gray-500 dark:text-gray-400">This user has no roles assigned in any domain.</p>
			<p class="mt-2 text-sm text-gray-400 dark:text-gray-500">Click "Add Role" to assign one.</p>
		</div>
	{:else}
		<!-- Iterate through domains -->
		{#each Array.from(rolesByDomain.entries()) as [domainId, domainData] (domainId)}
			<Card padding="lg" size="xl" class="mb-6">
				<h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
					<!-- Directly access domain properties -->
					Domain: {domainData.domain.name}
					{#if domainData.domain.code}
						({domainData.domain.code})
					{/if}
				</h2>
				<!-- Table for roles within this domain -->
				<Table
					hoverable={true}
					shadow
					divClass="relative max-h-[60vh] overflow-x-auto overflow-y-auto"
				>
					<TableHead
						class="sticky top-0 z-10 bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400"
					>
						<TableHeadCell>Role Name</TableHeadCell>
						<TableHeadCell>Description</TableHeadCell>
						<TableHeadCell>Active</TableHeadCell>
						<TableHeadCell>Assigned At</TableHeadCell>
						<TableHeadCell>Actions</TableHeadCell>
					</TableHead>
					<TableBody class="divide-y divide-gray-200 dark:divide-gray-700">
						{#each domainData.roles as userRole (userRole.id)}
							<TableBodyRow>
								<TableBodyCell class="font-medium whitespace-nowrap text-gray-900 dark:text-white">
									{userRole.role.name}
								</TableBodyCell>
								<TableBodyCell class="text-sm text-gray-500 dark:text-gray-400">
									{userRole.role.description || '—'}
								</TableBodyCell>
								<TableBodyCell>
									<Badge color={userRole.role.is_active ? 'green' : 'gray'} class="px-2.5 py-0.5">
										{userRole.role.is_active ? 'Active' : 'Inactive'}
									</Badge>
								</TableBodyCell>
								<TableBodyCell class="text-sm text-gray-500 dark:text-gray-400">
									{formatDate(userRole.created_at)}
								</TableBodyCell>
								<TableBodyCell class="whitespace-nowrap">
									{#if hasPermission(currentUser(), 'user/remove-role')}
										<!-- Remove Role Form -->
										<form
											method="POST"
											action="?/removeRole"
											use:enhance={handleRemoveSubmit()}
											class="inline-block"
										>
											<input type="hidden" name="role_id" value={userRole.role_id} />
											<Button
												type="submit"
												color="red"
												size="xs"
												class="cursor-pointer focus:ring-4 focus:ring-red-300 focus:outline-none dark:focus:ring-red-900"
												aria-label="Remove role"
											>
												<CloseOutline class="h-3 w-3" />
											</Button>
										</form>
									{/if}
								</TableBodyCell>
							</TableBodyRow>
						{/each}
					</TableBody>
				</Table>
			</Card>
		{/each}
	{/if}

	<!-- Assign Role Modal -->
	{#if showModal}
		<AssignRoleModal {user} bind:open={showModal} handleSubmit={handleAddSubmit} />
	{/if}
</div>

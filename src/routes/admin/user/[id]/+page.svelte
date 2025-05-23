<script>
	import {
		Badge,
		Button,
		Card,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { getContext } from 'svelte';
	import { formatDate } from '$lib/utils';
	import { Container, DetailItem } from '$lib/components/layout'; // Updated imports
	import { ListOutline, EditOutline, CogOutline, UserCircleSolid } from 'flowbite-svelte-icons';

	let { data } = $props();
	let user = $derived(data.user); // Make user reactive
	const currentUser = getContext('user');
	import { hasAnyPermission } from '$lib/utils/permissions';

	const breadcrumbItems = $derived([
		{ href: '/admin/user', label: 'Users' },
		{ label: user?.username || 'User Details' } // Use derived user and provide fallback
	]);

	// Group roles by domain for display
	function getRolesByDomain() {
		// Create a map to store domains and their roles
		const domainMap = new Map();

		// Process user_roles if they exist on the reactive user object
		if (user?.user_roles && user.user_roles.length > 0) {
			// First, create entries for all domains (even those without roles)
			if (user.domains) {
				user.domains.forEach((domain) => {
					domainMap.set(domain.id, {
						domain: domain,
						roles: []
					});
				});
			}

			// Then add roles to their respective domains
			user.user_roles.forEach((userRole) => {
				if (!userRole.role) return;

				// Get or create the domain entry
				if (!domainMap.has(userRole.domain_id)) {
					// This handles roles for domains not in user.domains
					domainMap.set(userRole.domain_id, {
						domain: { id: userRole.domain_id, name: `Domain ID: ${userRole.domain_id}`, code: '—' },
						roles: []
					});
				}

				// Add the role to the domain
				domainMap.get(userRole.domain_id).roles.push(userRole.role);
			});
		}

		// Convert map to array for easier iteration in the template
		return Array.from(domainMap.values());
	}

	let rolesByDomain = $derived(getRolesByDomain()); // Make rolesByDomain reactive
</script>

<!-- Use Container component -->
<Container breadcrumb={breadcrumbItems}>

	<!-- Page header -->
	<div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">User Details</h1>
		<div class="flex flex-shrink-0 gap-2">
			<!-- {#if currentUser().is_super_admin || currentUser().id === user.id /* Or based on permissions */}
				<Button href="/admin/user/{user.id}/edit">
					<EditOutline class="me-2 h-4 w-4" /> Edit User
				</Button>
			{/if} -->
			{#if currentUser().is_super_admin}
				<Button href="/admin/user/{user.id}/domains">
					<CogOutline class="me-2 h-4 w-4" /> Manage Domains
				</Button>
			{/if}
			{#if hasAnyPermission(currentUser(), ['user/assign-role', 'user/remove-role'])}
				<Button href="/admin/user/{user.id}/roles">
					<CogOutline class="me-2 h-4 w-4" /> Manage Roles
				</Button>
			{/if}
			<Button color="light" href="/admin/user">
				<ListOutline class="me-2 h-4 w-4" /> Back to List
			</Button>
		</div>
	</div>

	<!-- General Information Card -->
	<Card size="xl" class="mb-8 p-5">
		<h2 class="mb-6 text-xl font-semibold text-gray-900 dark:text-white">General Information</h2>
		<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
			<DetailItem label="ID">
				<p class="text-base font-semibold text-gray-900 dark:text-white">{user.id}</p>
			</DetailItem>

			<DetailItem label="Username">
				<p class="text-base font-semibold text-gray-900 dark:text-white">{user.username}</p>
			</DetailItem>

			<DetailItem label="UUID">
				<p class="font-mono text-base text-gray-700 dark:text-gray-300">{user.uuid}</p>
			</DetailItem>

			<DetailItem label="Status">
				<Badge large rounded color={user.is_active ? 'green' : 'gray'}>
					{user.is_active ? 'Active' : 'Inactive'}
				</Badge>
			</DetailItem>

			{#if currentUser().is_super_admin}
				<DetailItem label="Super Admin">
					<Badge large rounded color={user.is_super_admin ? 'purple' : 'gray'}>
						{user.is_super_admin ? 'Yes' : 'No'}
					</Badge>
				</DetailItem>
			{/if}

			<DetailItem label="Created At">
				<p class="text-base text-gray-700 dark:text-gray-300">{formatDate(user.created_at)}</p>
			</DetailItem>

			<DetailItem label="Updated At">
				<p class="text-base text-gray-700 dark:text-gray-300">{formatDate(user.updated_at)}</p>
			</DetailItem>
		</div>
	</Card>

	{#if currentUser().is_super_admin}
		<!-- Assigned Domains Card -->
		<Card size="xl" class="mb-8 p-5">
			<h2 class="mb-6 text-xl font-semibold text-gray-900 dark:text-white">Assigned Domains</h2>
			{#if user.domains && user.domains.length > 0}
				<div class="flex flex-wrap gap-2">
					{#each user.domains as domain (domain.id)}
						<Badge large color="indigo">{domain.name} ({domain.code})</Badge>
					{/each}
				</div>
			{:else}
				<div
					class="rounded-lg border border-gray-200 bg-gray-100 px-6 py-10 text-center dark:border-gray-700 dark:bg-gray-800"
				>
					<p class="text-gray-500 dark:text-gray-400">
						This user currently has no domains assigned.
					</p>
					<Button class="mt-4" size="sm" href="/admin/user/{user.id}/domains">
						Manage Domains
					</Button>
				</div>
			{/if}
		</Card>
	{/if}

	<!-- User Roles by Domain Card -->
	<Card size="xl" class="mb-8 p-5">
		<div class="mb-6 flex items-center justify-between">
			<h2 class="text-xl font-semibold text-gray-900 dark:text-white">User Roles by Domain</h2>
			<Button size="xs" href="/admin/user/{user.id}/roles" class="px-3">
				<CogOutline class="me-2 h-4 w-4" /> Manage Roles
			</Button>
		</div>

		{#if user.user_roles && user.user_roles.length > 0}
			<div class="space-y-6">
				{#each rolesByDomain as domainData}
					<div class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
						<!-- Domain Header -->
						<div class="bg-gray-50 px-4 py-3 dark:bg-gray-800">
							<div class="flex items-center justify-between">
								<div>
									<h3 class="text-lg font-medium text-gray-900 dark:text-white">
										{domainData.domain.name}
									</h3>
									<p class="text-sm text-gray-500 dark:text-gray-400">
										Code: {domainData.domain.code}
									</p>
								</div>
								<Badge large color="indigo" class="ml-2">
									{domainData.roles.length}
									{domainData.roles.length === 1 ? 'Role' : 'Roles'}
								</Badge>
							</div>
						</div>

						<!-- Roles Table -->
						{#if domainData.roles.length > 0}
							<Table divClass="!rounded-none !border-0">
								<TableHead>
									<TableHeadCell class="w-16">ID</TableHeadCell>
									<TableHeadCell>Role Name</TableHeadCell>
									<TableHeadCell>Description</TableHeadCell>
									<TableHeadCell>Status</TableHeadCell>
									<TableHeadCell>Assigned On</TableHeadCell>
								</TableHead>
								<TableBody>
									{#each domainData.roles as role}
										{@const userRole = user.user_roles.find(
											(ur) => ur.role_id === role.id && ur.domain_id === domainData.domain.id
										)}
										<TableBodyRow>
											<TableBodyCell>{role.id}</TableBodyCell>
											<TableBodyCell>
												<div class="font-medium text-gray-900 dark:text-white">
													{role.name}
												</div>
											</TableBodyCell>
											<TableBodyCell class="text-sm text-gray-500 dark:text-gray-400">
												{role.description || '—'}
											</TableBodyCell>
											<TableBodyCell>
												<Badge color={role.is_active ? 'green' : 'gray'} class="px-2.5 py-0.5">
													{role.is_active ? 'Active' : 'Inactive'}
												</Badge>
											</TableBodyCell>
											<TableBodyCell>
												{userRole ? formatDate(userRole.created_at) : '—'}
											</TableBodyCell>
										</TableBodyRow>
									{/each}
								</TableBody>
							</Table>
						{:else}
							<div class="p-4 text-center text-gray-500 dark:text-gray-400">No roles assigned.</div>
						{/if}
					</div>
				{/each}
			</div>
		{:else}
			<div
				class="rounded-lg border border-gray-200 bg-gray-50 px-6 py-10 text-center dark:border-gray-700 dark:bg-gray-800"
			>
				<div class="mb-4 flex justify-center">
					<UserCircleSolid class="h-12 w-12 text-gray-400" />
				</div>
				<p class="mb-2 text-lg font-medium text-gray-900 dark:text-white">No Roles Assigned</p>
				<p class="mb-4 text-gray-500 dark:text-gray-400">
					This user currently has no roles assigned.
				</p>
				{#if hasAnyPermission(currentUser(), ['user/assign-role', 'user/remove-role'])}
					<Button href="/admin/user/{user.id}/roles">
						<CogOutline class="me-2 h-4 w-4" /> Manage Roles
					</Button>
				{/if}
			</div>
		{/if}
	</Card>
</Container>

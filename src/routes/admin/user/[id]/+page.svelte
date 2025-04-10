<script>
	import { Badge, Button } from 'flowbite-svelte';
	import { getContext } from 'svelte';
	import { formatDate } from '$lib/utils';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	let { data } = $props();
	const currentUser = getContext('user');
	const user = data.user;

	const breadcrumbItems = [
		{ href: '/admin/user', label: 'Users' },
		{ label: user.username }
	];
</script>

<div class="p-4">
	<Breadcrumb items={breadcrumbItems} />
	
	<div class="mb-6 flex items-center justify-between">
		<h2 class="text-xl font-bold">User Details</h2>
		<Button color="light" href="/admin/user">Back to List</Button>
	</div>

	<div class="space-y-8 rounded-lg border bg-white p-6 shadow-sm">
		<div class="grid grid-cols-2 gap-x-8 gap-y-6">
			<div class="rounded-lg bg-gray-50 p-4">
				<h3 class="text-sm font-medium text-gray-500">Username</h3>
				<p class="mt-1 text-lg font-medium">{user.username}</p>
			</div>

			<div class="rounded-lg bg-gray-50 p-4">
				<h3 class="text-sm font-medium text-gray-500">UUID</h3>
				<p class="mt-1 text-lg font-medium">{user.uuid}</p>
			</div>

			<div class="rounded-lg bg-gray-50 p-4">
				<h3 class="text-sm font-medium text-gray-500">Status</h3>
				<div class="mt-2">
					<Badge rounded color={user.is_active ? 'green' : 'red'}>
						{user.is_active ? 'Active' : 'Inactive'}
					</Badge>
				</div>
			</div>

			{#if currentUser().is_super_admin}
				<div class="rounded-lg bg-gray-50 p-4">
					<h3 class="text-sm font-medium text-gray-500">Super Admin</h3>
					<div class="mt-2">
						<Badge rounded color={user.is_super_admin ? 'purple' : 'gray'}>
							{user.is_super_admin ? 'Yes' : 'No'}
						</Badge>
					</div>
				</div>
			{/if}

			<div class="rounded-lg bg-gray-50 p-4">
				<h3 class="text-sm font-medium text-gray-500">Created At</h3>
				<p class="mt-1">{formatDate(user.created_at)}</p>
			</div>

			<div class="rounded-lg bg-gray-50 p-4">
				<h3 class="text-sm font-medium text-gray-500">Updated At</h3>
				<p class="mt-1">{formatDate(user.updated_at)}</p>
			</div>
		</div>

		<div class="rounded-lg bg-gray-50 p-4">
			<h3 class="mb-3 text-sm font-medium text-gray-500">Domains</h3>
			{#if user.domains.length}
				<div class="flex flex-wrap gap-2">
					{#each user.domains as domain}
						<Badge color="blue">{domain.name}</Badge>
					{/each}
				</div>
			{:else}
				<p class="text-gray-500">No domains assigned</p>
			{/if}
		</div>
	</div>
</div>

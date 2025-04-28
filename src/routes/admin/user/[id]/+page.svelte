<script>
	import { Badge, Button, Card } from 'flowbite-svelte'; // Added Card
	import { getContext } from 'svelte';
	import { formatDate } from '$lib/utils';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import DetailItem from '$lib/components/layout/DetailItem.svelte'; // Added DetailItem
	import { ListOutline, EditOutline, CogOutline } from 'flowbite-svelte-icons'; // Added icons

	let { data } = $props();
	const currentUser = getContext('user');
	const user = data.user;

	const breadcrumbItems = [
		{ href: '/admin/user', label: 'Users' },
		{ label: user.username }
	];
</script>

<!-- Main page container -->
<div class="min-h-screen p-4 md:p-6 dark:bg-gray-900">
	<!-- Breadcrumb navigation -->
	<Breadcrumb class="mb-6" items={breadcrumbItems} />

	<!-- Page header -->
	<div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">User Details</h1>
		<div class="flex flex-shrink-0 gap-2">
			<!-- {#if currentUser().is_super_admin || currentUser().id === user.id /* Or based on permissions */}
				<Button href="/admin/user/{user.id}/edit">
					<EditOutline class="me-2 h-4 w-4" /> Edit User
				</Button>
			{/if} -->
			<Button href="/admin/user/{user.id}/domains">
				<CogOutline class="me-2 h-4 w-4" /> Manage Domains
			</Button>
			<Button color="light" href="/admin/user">
				<ListOutline class="me-2 h-4 w-4" /> Back to List
			</Button>
		</div>
	</div>

	<!-- General Information Card -->
	<Card padding="lg" size="2xl" class="mb-8">
		<h2 class="mb-6 text-xl font-semibold text-gray-900 dark:text-white">General Information</h2>
		<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
			<DetailItem label="ID">
				<p class="text-base font-semibold text-gray-900 dark:text-white">{user.id}</p>
			</DetailItem>

			<DetailItem label="Username">
				<p class="text-base font-semibold text-gray-900 dark:text-white">{user.username}</p>
			</DetailItem>

			<DetailItem label="UUID">
				<p class="text-base font-mono text-gray-700 dark:text-gray-300">{user.uuid}</p>
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

	<!-- Assigned Domains Card -->
	<Card padding="lg" size="2xl">
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
				<p class="text-gray-500 dark:text-gray-400">This user currently has no domains assigned.</p>
				<Button class="mt-4" size="sm" href="/admin/user/{user.id}/domains">
					Manage Domains
				</Button>
			</div>
		{/if}
	</Card>
</div>

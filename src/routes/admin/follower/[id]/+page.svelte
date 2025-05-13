<script>
	import { Badge, Button, Card } from 'flowbite-svelte';
	import { ListOutline, EditOutline } from 'flowbite-svelte-icons';
	import { formatDate } from '$lib/utils';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import DetailItem from '$lib/components/layout/DetailItem.svelte';
	import { getContext } from 'svelte';

	const currentUser = getContext('user');

	// Component props
	let { data } = $props();
	let follower = data.follower;

	// Breadcrumb items
	const breadcrumbItems = [
		{ href: '/admin/follower', label: 'Followers' },
		{ label: follower.name }
	];
</script>

<!-- Main page container -->
<div class="min-h-screen p-4 md:p-6 dark:bg-gray-900">
	<!-- Breadcrumb navigation -->
	<Breadcrumb class="mb-6" items={breadcrumbItems} />

	<!-- Page header -->
	<div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Follower Details</h1>
		<div class="flex flex-shrink-0 gap-2">
			<Button href="/admin/follower/{follower.id}/edit">
				<EditOutline class="me-2 h-4 w-4" /> Edit Follower
			</Button>
			<Button color="light" href="/admin/follower">
				<ListOutline class="me-2 h-4 w-4" /> Back to List
			</Button>
		</div>
	</div>

	<!-- General Information Card -->
	<Card padding="lg" size="2xl" class="mb-8">
		<h2 class="mb-6 text-xl font-semibold text-gray-900 dark:text-white">General Information</h2>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			<DetailItem label="ID">
				<p class="text-base font-semibold text-gray-900 dark:text-white">{follower.id}</p>
			</DetailItem>

			<DetailItem label="Name">
				<p class="text-base font-semibold text-gray-900 dark:text-white">{follower.name}</p>
			</DetailItem>

			{#if currentUser().is_super_admin}
				<DetailItem label="Domain ID">
					<p class="text-base font-semibold text-gray-900 dark:text-white">{follower.domain.name}</p>
				</DetailItem>
			{/if}

			<DetailItem label="Phone">
				<p class="text-base text-gray-700 dark:text-gray-300">{follower.phone || 'N/A'}</p>
			</DetailItem>

			<DetailItem label="Points">
				<p class="text-base font-semibold text-gray-900 dark:text-white">{follower.points}</p>
			</DetailItem>

			<DetailItem label="Is Blood Donor?">
				<Badge large rounded color={follower.is_blood_donor ? 'green' : 'red'}>
					{follower.is_blood_donor ? 'Yes' : 'No'}
				</Badge>
			</DetailItem>

			<DetailItem label="Is Muda Mudi?">
				<Badge large rounded color={follower.is_youth ? 'green' : 'red'}>
					{follower.is_youth ? 'Yes' : 'No'}
				</Badge>
			</DetailItem>

			<DetailItem label="Created At">
				<p class="text-base text-gray-700 dark:text-gray-300">{formatDate(follower.created_at)}</p>
			</DetailItem>

			<DetailItem label="Updated At">
				<p class="text-base text-gray-700 dark:text-gray-300">{formatDate(follower.updated_at)}</p>
			</DetailItem>
		</div>
	</Card>
</div>

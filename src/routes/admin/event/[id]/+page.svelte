<script>
	import { Badge, Button, Card } from 'flowbite-svelte';
	import { ListOutline, EditOutline, UserAddOutline } from 'flowbite-svelte-icons'; // Added UserAddOutline
	import { formatDate } from '$lib/utils';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import DetailItem from '$lib/components/layout/DetailItem.svelte';
	import { getContext } from 'svelte';

	const currentUser = getContext('user');

	// Component props
	let { data } = $props();
	let event = $derived(data.event); // Use $derived for reactivity with Svelte 5

	// Breadcrumb items
	const breadcrumbItems = $derived([
		{ href: '/admin/event', label: 'Events' },
		{ label: event?.name || 'Event Details' }
	]);
</script>

<!-- Main page container -->
<div class="min-h-screen p-4 md:p-6 dark:bg-gray-900">
	<!-- Breadcrumb navigation -->
	<Breadcrumb class="mb-6" items={breadcrumbItems} />

	<!-- Page header -->
	<div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">
			Event Details: {event?.name || ''}
		</h1>
		<div class="flex flex-shrink-0 gap-2">
			{#if event?.id}
				<Button href={`/admin/event/${event.id}/attend`} color="green">
					<UserAddOutline class="me-2 h-4 w-4" /> Attend Event
				</Button>
				<Button href={`/admin/event/${event.id}/edit`}>
					<EditOutline class="me-2 h-4 w-4" /> Edit Event
				</Button>
			{/if}
			<Button color="light" href="/admin/event">
				<ListOutline class="me-2 h-4 w-4" /> Back to List
			</Button>
		</div>
	</div>

	<!-- General Information Card -->
	<Card padding="lg" size="2xl" class="mb-8">
		<h2 class="mb-6 text-xl font-semibold text-gray-900 dark:text-white">General Information</h2>
		<div class="grid grid-cols-1 gap-y-4 gap-x-6 md:grid-cols-2">
			<DetailItem label="ID">
				<p class="text-base font-semibold text-gray-900 dark:text-white">{event?.id}</p>
			</DetailItem>

			<DetailItem label="Event Name">
				<p class="text-base font-semibold text-gray-900 dark:text-white">{event?.name}</p>
			</DetailItem>

			{#if currentUser()?.is_super_admin && event?.domain}
				<DetailItem label="Domain">
					<p class="text-base font-semibold text-gray-900 dark:text-white">
						{event.domain.name} ({event.domain.code})
					</p>
				</DetailItem>
			{/if}
			
			<DetailItem label="Points Awarded">
				<p class="text-base font-semibold text-gray-900 dark:text-white">{event?.points_awarded}</p>
			</DetailItem>

			<DetailItem label="Description" class="md:col-span-2">
				<p class="text-base text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
					{event?.description || 'N/A'}
				</p>
			</DetailItem>

			<DetailItem label="Created At">
				<p class="text-base text-gray-700 dark:text-gray-300">{formatDate(event?.created_at)}</p>
			</DetailItem>

			<DetailItem label="Updated At">
				<p class="text-base text-gray-700 dark:text-gray-300">{formatDate(event?.updated_at)}</p>
			</DetailItem>
		</div>
	</Card>
</div>
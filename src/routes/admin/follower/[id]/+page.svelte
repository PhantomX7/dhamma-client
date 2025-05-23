<script>
	import { Badge, Button, Card } from 'flowbite-svelte';
	import { PlusOutline, ListOutline, EditOutline, TrashBinOutline, UsersOutline, CashOutline } from 'flowbite-svelte-icons';
	import { formatDate } from '$lib/utils';
	import { Container, DetailItem } from '$lib/components/layout'; // Updated imports
	import { getContext } from 'svelte';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	const currentUser = getContext('user');

	// Component props
	let { data } = $props();
	let follower = $derived(data.follower); // Use $derived for reactivity with Svelte 5

	// Breadcrumb items
	const breadcrumbItems = $derived([
		{ href: '/admin/follower', label: 'Followers' },
		{ label: follower?.name || 'Follower Details' } // Use derived follower and provide fallback
	]);

	/**
	 * Enhancer function for card removal form submissions.
	 * Invalidates all data on success or redirect to refresh the card list.
	 */
	function handleCardActionEnhance() {
		return async ({ result, update }) => {
			// Only proceed if we have a successful result
			if (result && result.type === 'success') {
				// First invalidate all data
				await invalidateAll();
				// Then run the default update behavior
				await update({ invalidateAll: true });
			}
		};
	}
</script>

<!-- Use Container component -->
<Container breadcrumb={breadcrumbItems}>
	<!-- Page header -->
	<div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Follower Details</h1>
		<div class="flex flex-shrink-0 gap-2">
			<Button href="/admin/follower/{follower.id}/point-mutation" color="yellow">
				<CashOutline class="me-2 h-4 w-4" /> View Point History
			</Button>
			<Button href="/admin/follower/{follower.id}/attendance" color="blue">
				<UsersOutline class="me-2 h-4 w-4" /> View Attendance
			</Button>
			<Button href="/admin/follower/{follower.id}/edit">
				<EditOutline class="me-2 h-4 w-4" /> Edit Follower
			</Button>
			<Button color="light" href="/admin/follower">
				<ListOutline class="me-2 h-4 w-4" /> Back to List
			</Button>
		</div>
	</div>

	<!-- General Information Card -->
	<Card size="xl" class="mb-8 p-5">
		<h2 class="mb-6 text-xl font-semibold text-gray-900 dark:text-white">General Information</h2>
		<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
			<DetailItem label="Name">
				<p class="text-base text-gray-700 dark:text-gray-300">{follower.name}</p>
			</DetailItem>
			<DetailItem label="Email">
				<p class="text-base text-gray-700 dark:text-gray-300">{follower.email || 'N/A'}</p>
			</DetailItem>
			<DetailItem label="ID">
				<p class="text-base font-semibold text-gray-900 dark:text-white">{follower.id}</p>
			</DetailItem>

			{#if currentUser().is_super_admin}
				<DetailItem label="Domain ID">
					<p class="text-base font-semibold text-gray-900 dark:text-white">
						{follower.domain.name}
					</p>
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

	<!-- Follower Cards Section -->
	<Card size="xl" class="mb-8 p-5">
		<div class="mb-6 flex items-center justify-between">
			<h2 class="text-xl font-semibold text-gray-900 dark:text-white">Follower Cards</h2>
			{#if follower?.id}
				<Button href="/admin/follower/{follower.id}/add-card">
					<PlusOutline class="me-2 h-4 w-4" /> Add Card
				</Button>
			{/if}
		</div>

		{#if follower?.cards && follower.cards.length > 0}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each follower.cards as card (card.id)}
					<Card class="flex flex-col justify-between shadow-md">
						<div class="p-4">
							<p class="text-lg font-medium text-gray-900 dark:text-white">
								Code: <span class="font-mono">{card.code}</span>
							</p>
							<p class="text-xs text-gray-500 dark:text-gray-400">ID: {card.id}</p>
						</div>
						{#if follower?.id && card?.id}
							<form
								method="POST"
								action="/admin/follower/{follower.id}/remove-card/{card.id}"
								use:enhance={handleCardActionEnhance}
								class="border-t border-gray-200 p-4 text-right dark:border-gray-700"
							>
								<Button class="cursor-pointer" type="submit" color="red" size="sm" pill>
									<TrashBinOutline class="me-1.5 h-3.5 w-3.5" /> Remove
								</Button>
							</form>
						{/if}
					</Card>
				{/each}
			</div>
		{:else}
			<p class="py-4 text-center text-gray-500 dark:text-gray-400">
				No cards have been assigned to this follower yet.
			</p>
		{/if}
	</Card>
</Container>

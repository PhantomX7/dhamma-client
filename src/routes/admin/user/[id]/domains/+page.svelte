<script>
	import {
		Button,
		Badge,
		Card, // Added Card
		Table, // Added Table components
		TableBody,
		TableBodyRow,
		TableBodyCell,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { ChevronLeftOutline, PlusOutline, CloseOutline } from 'flowbite-svelte-icons'; // Added icons
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import AssignDomainModal from '$lib/components/modal/AssignDomainModal.svelte';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { formatDate } from '$lib/utils'; // Added formatDate if needed for table

	let { data } = $props();

	// Create a derived value for user that updates when data changes
	let user = $derived(data.user);
	const userDomainIds = $derived(new Set(user.domains.map((d) => d.id)));

	// Modal state
	let showModal = $state(false);

	const breadcrumbItems = $derived([
		{ href: '/admin/user', label: 'Users' },
		{ href: `/admin/user/${user.id}`, label: user.username },
		{ label: 'Manage Domains' }
	]);

	// Form submission handler with data refresh
	function handleSubmit() {
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
			Manage Domains for {user.username}
		</h1>
		<Button color="light" href="/admin/user/{user.id}">
			<ChevronLeftOutline class="me-2 h-4 w-4" /> Back to User
		</Button>
	</div>

	<!-- Current User Domains Card -->
	<Card size="xl" class="mb-8 p-4">
		<div class="mb-6 flex items-center justify-between">
			<h2 class="text-xl font-semibold text-gray-900 dark:text-white">Assigned Domains</h2>
			<Button class="cursor-pointer" onclick={() => (showModal = true)}>
				<PlusOutline class="me-2 h-4 w-4" /> Add Domain
			</Button>
		</div>

		{#if user.domains.length === 0}
			<div
				class="rounded-lg border border-gray-200 bg-gray-100 px-6 py-10 text-center dark:border-gray-700 dark:bg-gray-800"
			>
				<p class="text-gray-500 dark:text-gray-400">This user has no domains assigned.</p>
			</div>
		{:else}
			<div class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm dark:border-gray-700">
				<Table hoverable={true}>
					<TableHead
						class="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400"
					>
						<TableHeadCell class="px-6 py-3">Name</TableHeadCell>
						<TableHeadCell class="px-6 py-3">Code</TableHeadCell>
						<TableHeadCell class="px-6 py-3">Status</TableHeadCell>
						<TableHeadCell class="px-6 py-3">Actions</TableHeadCell>
					</TableHead>
					<TableBody class="divide-y divide-gray-200 dark:divide-gray-700">
						{#each user.domains as domain (domain.id)}
							<TableBodyRow
								class="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-600"
							>
								<TableBodyCell
									class="px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white"
									>{domain.name}</TableBodyCell
								>
								<TableBodyCell class="px-6 py-4 text-gray-600 dark:text-gray-300"
									>{domain.code}</TableBodyCell
								>
								<TableBodyCell class="px-6 py-4">
									<Badge large rounded color={domain.is_active ? 'green' : 'gray'}>
										{domain.is_active ? 'Active' : 'Inactive'}
									</Badge>
								</TableBodyCell>
								<TableBodyCell class="px-6 py-4">
									<form method="POST" action="?/removeDomain" use:enhance={handleSubmit}>
										<input type="hidden" name="domain_id" value={domain.id} />
										<Button
											class="cursor-pointer"
											type="submit"
											color="red"
											size="xs"
											aria-label="Remove domain {domain.name}"
										>
											<CloseOutline class="h-4 w-4" /> Remove Domain
										</Button>
									</form>
								</TableBodyCell>
							</TableBodyRow>
						{/each}
					</TableBody>
				</Table>
			</div>
		{/if}
	</Card>
</div>

<!-- Domain Search Modal (remains outside the card) -->
<AssignDomainModal
	bind:open={showModal}
	{userDomainIds}
	userId={user.id}
	{handleSubmit}
/>

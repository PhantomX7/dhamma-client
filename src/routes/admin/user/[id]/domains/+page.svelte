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
	import { Container } from '$lib/components/layout'; // Import Container
	import AssignDomainModal from '$lib/components/modal/AssignDomainModal.svelte';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	let { data } = $props();

	// Create a derived value for user that updates when data changes
	let user = $derived(data.user);
	const userDomainIds = $derived(new Set(user.domains.map((d) => d.id)));

	// Modal state
	let showModal = $state(false);

	const breadcrumbItems = $derived([
		{ href: '/admin/user', label: 'Users' },
		{ href: `/admin/user/${user?.id}`, label: user?.username || 'User Details' },
		{ label: 'Manage Domains' }
	]);

	// Form submission handler with data refresh
	function handleSubmit() {
		return async ({ result, update }) => {
			console.log("heeee")

			if (result.type) {
				await invalidateAll();
				await update({ invalidateAll: true });
				showModal = false;
			}
		};
	}
</script>

<!-- Use Container component -->
<Container
	breadcrumb={breadcrumbItems}
	title={`Manage Domains for ${user?.username || 'Selected User'}`}
>
	{#snippet headerActions()}
		{#if user?.id}
			<Button color="light" href={`/admin/user/${user.id}`}>
				<ChevronLeftOutline class="me-2 h-4 w-4" /> Back to User
			</Button>
		{/if}
	{/snippet}

	<!-- Current User Domains Card -->
	<Card size="xl" class="mb-8 p-4">
		<div class="mb-6 flex items-center justify-between">
			<h2 class="text-xl font-semibold text-gray-900 dark:text-white">Assigned Domains</h2>
			<Button class="cursor-pointer" onclick={() => (showModal = true)}>
				<PlusOutline class="me-2 h-4 w-4" /> Add Domain
			</Button>
		</div>

		{#if user?.domains?.length === 0}
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
						{#each user?.domains as domain (domain.id)}
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
									<Badge color={domain.is_active ? 'green' : 'gray'}>
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
</Container>

<!-- Domain Search Modal (remains outside the card) -->
<AssignDomainModal
	bind:open={showModal}
	{userDomainIds}
	userId={user?.id}
	{handleSubmit}
/>

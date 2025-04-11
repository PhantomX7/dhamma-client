<script>
	import {
		Button,
		Badge
	} from 'flowbite-svelte';
	import { FormButton } from '$lib/components/form';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import DomainSearchModal from '$lib/components/modal/DomainSearchModal.svelte';

	let { data } = $props();
	const user = data.user;
	const allDomains = data.domains;

	// Create a map of domain IDs that are already assigned to the user
	const userDomainIds = new Set(user.domains.map((d) => d.id));

	// Track selected domains for adding/removing
	let selectedDomains = $state(new Set());
	
	// Modal state
	let showModal = $state(false);

	const breadcrumbItems = [
		{ href: '/admin/user', label: 'Users' },
		{ href: `/admin/user/${user.id}`, label: user.username },
		{ label: 'Manage Domains' }
	];
</script>

<div class="p-4">
	<Breadcrumb items={breadcrumbItems} />

	<div class="mb-6 flex items-center justify-between">
		<h2 class="text-xl font-bold">Manage Domains for {user.username}</h2>
		<Button color="light" href="/admin/user/{user.id}">Back to User</Button>
	</div>

	<div class="space-y-8">
		<!-- Current User Domains -->
		<div class="rounded-lg border bg-white p-6 shadow-sm">
			<div class="mb-4 flex items-center justify-between">
				<h3 class="text-lg font-semibold">Current Domains</h3>
				<Button color="blue" on:click={() => showModal = true}>Add Domain</Button>
			</div>

			{#if user.domains.length === 0}
				<p class="text-gray-500">This user has no domains assigned.</p>
			{:else}
				<div class="mb-4 flex flex-wrap gap-2">
					{#each user.domains as domain}
						<div class="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2">
							<Badge color={domain.is_active ? 'green' : 'red'} class="mr-1">
								{domain.is_active ? 'Active' : 'Inactive'}
							</Badge>
							<span class="font-medium">{domain.name}</span>
							<span class="text-sm text-gray-500">({domain.code})</span>
							<!-- <form method="POST" action="?/removeDomain" class="ml-2">
								<input type="hidden" name="domain_id" value={domain.id} />
								<button type="submit" class="text-red-500 hover:text-red-700">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							</form> -->
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Use the refactored domain search modal component -->
<DomainSearchModal 
	bind:open={showModal} 
	{allDomains} 
	{userDomainIds} 
	bind:selectedDomains={selectedDomains}
	userId={user.id}
/>

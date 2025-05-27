<script>
	import { Badge, breadcrumb, Button, Card } from 'flowbite-svelte';
	import { ListOutline, EditOutline } from 'flowbite-svelte-icons';
	import { formatDate } from '$lib/utils';
	import { Container, DetailItem } from '$lib/components/layout';

	// Component props
	let { data } = $props();
	let domain = $derived(data.domain); // Use $derived for reactivity

	// Breadcrumb items
	const breadcrumbItems = $derived([
		{ href: '/admin/domain', label: 'Domains' },
		{ label: domain?.name || 'Domain Details' }
	]);
</script>

<Container breadcrumb={breadcrumbItems} title={`Domain Details: ${domain?.name || ''}`}>
	{#snippet headerActions()}
		<div class="flex flex-shrink-0 gap-2">
			<Button href={`/admin/domain/${domain?.id}/edit`}>
				<EditOutline class="me-2 h-4 w-4" /> Edit Domain
			</Button>
			<Button color="light" href="/admin/domain">
				<ListOutline class="me-2 h-4 w-4" /> Back to List
			</Button>
		</div>
	{/snippet}

	<!-- General Information Card -->
	<Card size="xl" class="mb-8 p-5">
		<h2 class="mb-6 text-xl font-semibold text-gray-900 dark:text-white">General Information</h2>
		<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
			<DetailItem label="ID">
				<p class="text-base font-semibold text-gray-900 dark:text-white">{domain?.id}</p>
			</DetailItem>

			<DetailItem label="Name">
				<p class="text-base font-semibold text-gray-900 dark:text-white">{domain?.name}</p>
			</DetailItem>

			<DetailItem label="Code">
				<p class="text-base font-semibold text-gray-900 dark:text-white">{domain?.code}</p>
			</DetailItem>

			<DetailItem label="Description" class="sm:col-span-2 lg:col-span-1">
				<p class="text-base text-gray-700 dark:text-gray-300">{domain?.description || 'N/A'}</p>
			</DetailItem>

			<DetailItem label="Status">
				<Badge large rounded color={domain?.is_active ? 'green' : 'red'}>
					{domain?.is_active ? 'Active' : 'Inactive'}
				</Badge>
			</DetailItem>

			<DetailItem label="Created At">
				<p class="text-base text-gray-700 dark:text-gray-300">{formatDate(domain?.created_at)}</p>
			</DetailItem>

			<DetailItem label="Updated At">
				<p class="text-base text-gray-700 dark:text-gray-300">{formatDate(domain?.updated_at)}</p>
			</DetailItem>
		</div>
	</Card>
</Container>

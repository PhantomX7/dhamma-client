<script>
	import { Badge, breadcrumb, Button, Card } from 'flowbite-svelte';
	import { ListOutline, EditOutline } from 'flowbite-svelte-icons';
	import { formatDate } from '$lib/utils';
	import { Container, DetailItem } from '$lib/components/layout';

	// Component props
	let { data } = $props();
	let domain = data.domain;

	// Breadcrumb items
	const breadcrumbItems = [{ href: '/admin/domain', label: 'Domains' }, { label: domain.name }];
</script>

<Container breadcrumb={breadcrumbItems}>
	<!-- Page header -->
	<div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Domain Details</h1>
		<div class="flex flex-shrink-0 gap-2">
			<Button href="/admin/domain/{domain.id}/edit">
				<EditOutline class="me-2 h-4 w-4" /> Edit Domain
			</Button>
			<Button color="light" href="/admin/domain">
				<ListOutline class="me-2 h-4 w-4" /> Back to List
			</Button>
		</div>
	</div>

	<!-- General Information Card -->
	<Card size="xl" class="mb-8 p-5">
		<h2 class="mb-6 text-xl font-semibold text-gray-900 dark:text-white">General Information</h2>
		<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
			<DetailItem label="ID">
				<p class="text-base font-semibold text-gray-900 dark:text-white">{domain.id}</p>
			</DetailItem>

			<DetailItem label="Name">
				<p class="text-base font-semibold text-gray-900 dark:text-white">{domain.name}</p>
			</DetailItem>

			<DetailItem label="Code">
				<p class="text-base font-semibold text-gray-900 dark:text-white">{domain.code}</p>
			</DetailItem>

			<DetailItem label="Description" class="sm:col-span-2 lg:col-span-1">
				<p class="text-base text-gray-700 dark:text-gray-300">{domain.description || 'N/A'}</p>
			</DetailItem>

			<DetailItem label="Status">
				<Badge large rounded color={domain.is_active ? 'green' : 'red'}>
					{domain.is_active ? 'Active' : 'Inactive'}
				</Badge>
			</DetailItem>

			<DetailItem label="Created At">
				<p class="text-base text-gray-700 dark:text-gray-300">{formatDate(domain.created_at)}</p>
			</DetailItem>

			<DetailItem label="Updated At">
				<p class="text-base text-gray-700 dark:text-gray-300">{formatDate(domain.updated_at)}</p>
			</DetailItem>
		</div>
	</Card>
</Container>

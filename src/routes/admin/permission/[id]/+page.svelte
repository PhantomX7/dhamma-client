<script>
	import { Badge, Button, Card } from 'flowbite-svelte'; 
	import { ChevronLeftOutline, EditOutline } from 'flowbite-svelte-icons'; 
	import { formatDate } from '$lib/utils';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import DetailItem from '$lib/components/layout/DetailItem.svelte'; 

	// Component props
	let { data } = $props();
	const permission = data.permission;

	// Breadcrumb items
	const breadcrumbItems = [
		{ href: '/admin/permission', label: 'Permissions' },
		{ label: permission.name }
	];
</script>

<!-- Main page container -->
<div class="min-h-screen p-4 md:p-6 dark:bg-gray-900">
	<!-- Breadcrumb navigation -->
	<Breadcrumb class="mb-6" items={breadcrumbItems} />

	<!-- Page header -->
	<div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Permission Details</h1>
		<div class="flex flex-shrink-0 gap-2">
			<Button href="/admin/permission/{permission.id}/edit">
				<EditOutline class="me-2 h-4 w-4" /> Edit Permission
			</Button>
			<Button color="light" href="/admin/permission">
				<ChevronLeftOutline class="me-2 h-4 w-4" /> Back to List
			</Button>
		</div>
	</div>

	<!-- General Information Card -->
	<Card padding="lg" size="2xl" class="mb-8">
		<h2 class="mb-6 text-xl font-semibold text-gray-900 dark:text-white">General Information</h2>
		<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
			<DetailItem label="ID">
				<p class="text-base font-semibold text-gray-900 dark:text-white">{permission.id}</p>
			</DetailItem>

			<DetailItem label="Name">
				<p class="text-base font-semibold text-gray-900 dark:text-white">{permission.name}</p>
			</DetailItem>

			<DetailItem label="Code">
				<p class="text-base font-semibold text-gray-900 dark:text-white">{permission.code}</p>
			</DetailItem>

			<DetailItem label="Object">
				<p class="text-base text-gray-700 dark:text-gray-300">{permission.object}</p>
			</DetailItem>

			<DetailItem label="Action">
				<p class="text-base text-gray-700 dark:text-gray-300">{permission.action}</p>
			</DetailItem>

			<DetailItem label="Type">
				<Badge large rounded color={permission.type === 'API' ? 'indigo' : 'purple'}>
					{permission.type}
				</Badge>
			</DetailItem>

			<DetailItem label="Domain Specific">
				<Badge large rounded color={permission.is_domain_specific ? 'blue' : 'gray'}>
					{permission.is_domain_specific ? 'Yes' : 'No'}
				</Badge>
			</DetailItem>

			<DetailItem label="Description" class="sm:col-span-2 lg:col-span-1">
				<p class="text-base text-gray-700 dark:text-gray-300">{permission.description || 'N/A'}</p>
			</DetailItem>

			<DetailItem label="Created At">
				<p class="text-base text-gray-700 dark:text-gray-300">{formatDate(permission.created_at)}</p>
			</DetailItem>

			<DetailItem label="Updated At">
				<p class="text-base text-gray-700 dark:text-gray-300">{formatDate(permission.updated_at)}</p>
			</DetailItem>
		</div>
	</Card>

	<!-- Add other sections/cards here if needed in the future -->
</div>
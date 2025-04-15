<script>
	import { Badge, Button } from 'flowbite-svelte';
	import { formatDate } from '$lib/utils';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	let { data } = $props();
	const permission = data.permission;
	
	const breadcrumbItems = [
		{ href: '/admin/permission', label: 'Permissions' },
		{ label: permission.name }
	];
</script>

<div class="p-4">
	<Breadcrumb items={breadcrumbItems} />
	
	<div class="mb-6 flex items-center justify-between">
		<h2 class="text-xl font-bold">Permission Details</h2>
		<div class="flex gap-2">
			<Button class="bg-primary-600 hover:bg-primary-700 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" href="/admin/permission/{permission.id}/edit">Edit Permission</Button>
			<Button color="light" href="/admin/permission">Back to List</Button>
		</div>
	</div>

	<div class="space-y-8 rounded-lg border bg-white p-6 shadow-sm">
		<div class="grid grid-cols-2 gap-x-8 gap-y-6">
			<div class="rounded-lg bg-gray-50 p-4">
				<h3 class="text-sm font-medium text-gray-500">ID</h3>
				<p class="mt-1 text-lg font-medium">{permission.id}</p>
			</div>
			
			<div class="rounded-lg bg-gray-50 p-4">
				<h3 class="text-sm font-medium text-gray-500">Name</h3>
				<p class="mt-1 text-lg font-medium">{permission.name}</p>
			</div>
			
			<div class="rounded-lg bg-gray-50 p-4">
				<h3 class="text-sm font-medium text-gray-500">Code</h3>
				<p class="mt-1 text-lg font-medium">{permission.code}</p>
			</div>
			
			<div class="rounded-lg bg-gray-50 p-4">
				<h3 class="text-sm font-medium text-gray-500">Object</h3>
				<p class="mt-1 text-lg font-medium">{permission.object}</p>
			</div>
			
			<div class="rounded-lg bg-gray-50 p-4">
				<h3 class="text-sm font-medium text-gray-500">Action</h3>
				<p class="mt-1 text-lg font-medium">{permission.action}</p>
			</div>
			
			<div class="rounded-lg bg-gray-50 p-4">
				<h3 class="text-sm font-medium text-gray-500">Type</h3>
				<p class="mt-1 text-lg font-medium">{permission.type}</p>
			</div>
			
			<div class="rounded-lg bg-gray-50 p-4">
				<h3 class="text-sm font-medium text-gray-500">Domain Specific</h3>
				<div class="mt-2">
					<Badge rounded color={permission.is_domain_specific ? 'blue' : 'gray'}>
						{permission.is_domain_specific ? 'Yes' : 'No'}
					</Badge>
				</div>
			</div>
			
			<div class="rounded-lg bg-gray-50 p-4">
				<h3 class="text-sm font-medium text-gray-500">Description</h3>
				<p class="mt-1 text-lg font-medium">{permission.description || 'No description'}</p>
			</div>
			
			<div class="rounded-lg bg-gray-50 p-4">
				<h3 class="text-sm font-medium text-gray-500">Created At</h3>
				<p class="mt-1">{formatDate(permission.created_at)}</p>
			</div>
			
			<div class="rounded-lg bg-gray-50 p-4">
				<h3 class="text-sm font-medium text-gray-500">Updated At</h3>
				<p class="mt-1">{formatDate(permission.updated_at)}</p>
			</div>
		</div>
	</div>
</div>
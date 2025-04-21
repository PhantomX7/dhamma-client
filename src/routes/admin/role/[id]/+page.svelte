<script>
	import { Badge, Button } from 'flowbite-svelte';
	import { formatDate } from '$lib/utils';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	let { data } = $props();
	const role = data.role; // Changed from permission to role
	
	const breadcrumbItems = [
		{ href: '/admin/role', label: 'Roles' }, // Changed from permission to role
		{ label: role.name } // Changed from permission to role
	];
</script>

<div class="p-4">
	<Breadcrumb items={breadcrumbItems} />
	
	<div class="mb-6 flex items-center justify-between">
		<h2 class="text-xl font-bold">Role Details</h2> <!-- Changed title -->
		<div class="flex gap-2">
			<Button class="bg-primary-600 hover:bg-primary-700 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" href="/admin/role/{role.id}/edit">Edit Role</Button> <!-- Changed href and text -->
			<Button color="light" href="/admin/role">Back to List</Button> <!-- Changed href -->
		</div>
	</div>

	<div class="space-y-8 rounded-lg border bg-white p-6 shadow-sm">
		<div class="grid grid-cols-2 gap-x-8 gap-y-6">
			<div class="rounded-lg bg-gray-50 p-4">
				<h3 class="text-sm font-medium text-gray-500">ID</h3>
				<p class="mt-1 text-lg font-medium">{role.id}</p> <!-- Changed from permission to role -->
			</div>
			
			<div class="rounded-lg bg-gray-50 p-4">
				<h3 class="text-sm font-medium text-gray-500">Name</h3>
				<p class="mt-1 text-lg font-medium">{role.name}</p> <!-- Changed from permission to role -->
			</div>
			
			<div class="rounded-lg bg-gray-50 p-4">
				<h3 class="text-sm font-medium text-gray-500">Description</h3>
				<p class="mt-1 text-lg font-medium">{role.description || 'No description'}</p> <!-- Changed from permission to role -->
			</div>

			<div class="rounded-lg bg-gray-50 p-4">
				<h3 class="text-sm font-medium text-gray-500">Status</h3>
				<div class="mt-2">
					<Badge rounded color={role.is_active ? 'blue' : 'gray'}>
						{role.is_active ? 'Active' : 'Inactive'}
					</Badge>
				</div>
			</div>
			
			<div class="rounded-lg bg-gray-50 p-4">
				<h3 class="text-sm font-medium text-gray-500">Created At</h3>
				<p class="mt-1">{formatDate(role.created_at)}</p> <!-- Changed from permission to role -->
			</div>
			
			<div class="rounded-lg bg-gray-50 p-4">
				<h3 class="text-sm font-medium text-gray-500">Updated At</h3>
				<p class="mt-1">{formatDate(role.updated_at)}</p> <!-- Changed from permission to role -->
			</div>
		</div>
	</div>
</div>
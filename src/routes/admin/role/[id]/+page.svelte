<script>
	import {
		Badge,
		Button,
		Table,
		TableBody,
		TableBodyRow,
		TableBodyCell,
		TableHead,
		TableHeadCell,
		Card
	} from 'flowbite-svelte';
	import { ListOutline, EditOutline } from 'flowbite-svelte-icons';
	
	import { formatDate } from '$lib/utils';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import DetailItem from '$lib/components/layout/DetailItem.svelte'; 

	// Component props
	let { data } = $props();
	const role = data.role;

	// Breadcrumb items
	const breadcrumbItems = [{ href: '/admin/role', label: 'Roles' }, { label: role.name }];
</script>

<!-- Main page container -->
<div class="min-h-screen p-4 md:p-6 dark:bg-gray-900">
	<!-- Breadcrumb navigation -->
	<Breadcrumb class="mb-6" items={breadcrumbItems} />

	<!-- Page header -->
	<div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Role Details</h1>
		<div class="flex flex-shrink-0 gap-2">
			<Button href="/admin/role/{role.id}/edit">
				<EditOutline class="me-2 h-4 w-4" /> Edit Role
			</Button>
			<Button color="light" href="/admin/role">
				<ListOutline class="me-2 h-4 w-4" /> Back to List
			</Button>
		</div>
	</div>

	<Card padding="lg" size="2xl" class="mb-8">
		<h2 class="mb-6 text-xl font-semibold text-gray-900 dark:text-white">General Information</h2>
		<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
			<DetailItem label="ID">
				<p class="text-base font-semibold text-gray-900 dark:text-white">{role.id}</p>
			</DetailItem>

			<DetailItem label="Name">
				<p class="text-base font-semibold text-gray-900 dark:text-white">{role.name}</p>
			</DetailItem>

			<DetailItem label="Description" class="sm:col-span-2 lg:col-span-1">
				<p class="text-base text-gray-700 dark:text-gray-300">{role.description || 'N/A'}</p>
			</DetailItem>

			<DetailItem label="Status">
				<Badge large rounded color={role.is_active ? 'green' : 'gray'}>
					{role.is_active ? 'Active' : 'Inactive'}
				</Badge>
			</DetailItem>

			<DetailItem label="Created At">
				<p class="text-base text-gray-700 dark:text-gray-300">{formatDate(role.created_at)}</p>
			</DetailItem>

			<DetailItem label="Updated At">
				<p class="text-base text-gray-700 dark:text-gray-300">{formatDate(role.updated_at)}</p>
			</DetailItem>
		</div>
	</Card>

	<!-- Permissions Section Card (remains unchanged) -->
	<Card padding="lg" size="2xl">
		<h2 class="mb-6 text-xl font-semibold text-gray-900 dark:text-white">Assigned Permissions</h2>
		{#if role.permissions && role.permissions.length > 0}
			<div class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm dark:border-gray-700">
				<Table hoverable={true} striped={true}>
					<TableHead
						class="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400"
					>
						<TableHeadCell class="px-6 py-3">Name</TableHeadCell>
						<TableHeadCell class="px-6 py-3">Code</TableHeadCell>
						<TableHeadCell class="px-6 py-3">Type</TableHeadCell>
						<TableHeadCell class="px-6 py-3">Description</TableHeadCell>
					</TableHead>
					<TableBody class="divide-y divide-gray-200 dark:divide-gray-700">
						{#each role.permissions as permission (permission.id)}
							<TableBodyRow
								class="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-600"
							>
								<TableBodyCell
									class="px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white"
									>{permission.name}</TableBodyCell
								>
								<TableBodyCell class="px-6 py-4 text-gray-600 dark:text-gray-300"
									>{permission.code}</TableBodyCell
								>
								<TableBodyCell class="px-6 py-4">
									<Badge large color={permission.type === 'API' ? 'indigo' : 'purple'}>
										{permission.type}
									</Badge>
								</TableBodyCell>
								<TableBodyCell class="px-6 py-4 text-gray-600 dark:text-gray-300"
									>{permission.description || '-'}</TableBodyCell
								>
							</TableBodyRow>
						{/each}
					</TableBody>
				</Table>
			</div>
		{:else}
			<div
				class="rounded-lg border border-gray-200 bg-gray-100 px-6 py-10 text-center dark:border-gray-700 dark:bg-gray-800"
			>
				<p class="text-gray-500 dark:text-gray-400">
					This role currently has no permissions assigned.
				</p>
			</div>
		{/if}
	</Card>
</div>

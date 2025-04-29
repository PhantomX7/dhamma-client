<script>
	import {
		Button,
		Badge,
		Table,
		TableBody,
		TableBodyRow,
		TableBodyCell,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	// Added icons
	import { PlusOutline, EyeOutline, EditOutline, TrashBinOutline } from 'flowbite-svelte-icons';
	import { getContext } from 'svelte';
	import { formatDate } from '$lib/utils';
	import DataTable from '$lib/components/DataTable.svelte';
	import { FilterType } from '$lib/utils/filter';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	// Component props
	let { data } = $props();
	// Get current user context (assuming it provides user details like is_super_admin)
	const currentUser = getContext('user');

	// Breadcrumb items definition
	const breadcrumbItems = [{ label: 'Users' }];

	// Configuration for the DataTable filter component
	const filterConfig = {
		username: {
			type: FilterType.STRING,
			label: 'Username'
		},
		is_active: {
			type: FilterType.BOOL,
			label: 'Status Active'
		},
		created_at: {
			type: FilterType.DATE,
			label: 'Created Date'
		}
		// Add other relevant filters like 'is_super_admin' if needed
	};
</script>

<!-- Main page container with standard padding and dark mode background -->
<div class="min-h-screen p-4 md:p-6 dark:bg-gray-900">
	<!-- Breadcrumb navigation with bottom margin -->
	<Breadcrumb class="mb-6" items={breadcrumbItems} />

	<!-- Page header section with responsive layout and spacing -->
	<div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<!-- Page title using h1 -->
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
		<!-- Add User button with icon and link -->
		<Button href="/admin/user/add">
			<PlusOutline class="me-2 h-4 w-4" /> Add User
		</Button>
	</div>

	<!-- DataTable component wrapping the table -->
	<DataTable data={data.users} meta={data.meta} {filterConfig}>
		<!-- Flowbite Table component with hover effect, constrained height, borders, and rounded corners -->
		<Table
			hoverable={true}
			shadow
			divClass="relative max-h-[70vh] overflow-x-auto overflow-y-auto"
		>
			<!-- Sticky table header with standard styling -->
			<TableHead
				class="sticky top-0 z-10 bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
			>
				<TableHeadCell>ID</TableHeadCell>
				<TableHeadCell>UUID</TableHeadCell>
				<TableHeadCell>Username</TableHeadCell>
				{#if currentUser().is_super_admin}
					<TableHeadCell>Super Admin</TableHeadCell>
				{/if}
				<TableHeadCell>Status</TableHeadCell>
				<TableHeadCell>Domains</TableHeadCell>
				<TableHeadCell>Created At</TableHeadCell>
				<TableHeadCell>Updated At</TableHeadCell>
				<TableHeadCell>Actions</TableHeadCell>
			</TableHead>
			<!-- Table body with dividers -->
			<TableBody class="divide-y divide-gray-200 dark:divide-gray-700">
				{#each data.users as user (user.id)}
					<!-- Table row with standard background -->
					<TableBodyRow class="bg-white dark:bg-gray-800">
						<TableBodyCell class="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">{user.id}</TableBodyCell>
						<TableBodyCell class="whitespace-nowrap px-6 py-4">{user.uuid}</TableBodyCell>
						<TableBodyCell class="px-6 py-4">{user.username}</TableBodyCell>
						{#if currentUser().is_super_admin}
							<TableBodyCell class="px-6 py-4">
								<Badge large rounded color={user.is_super_admin ? 'purple' : 'gray'}>
									{user.is_super_admin ? 'Yes' : 'No'}
								</Badge>
							</TableBodyCell>
						{/if}
						<TableBodyCell class="px-6 py-4">
							<Badge large rounded color={user.is_active ? 'green' : 'red'}>
								{user.is_active ? 'Active' : 'Inactive'}
							</Badge>
						</TableBodyCell>
						<TableBodyCell class="px-6 py-4 max-w-xs truncate">
							{#if user.domains.length}
								{user.domains.map((d) => d.name).join(', ')}
							{:else}
								<span class="text-gray-500 dark:text-gray-400">None</span>
							{/if}
						</TableBodyCell>
						<TableBodyCell class="whitespace-nowrap px-6 py-4">{formatDate(user.created_at)}</TableBodyCell>
						<TableBodyCell class="whitespace-nowrap px-6 py-4">{formatDate(user.updated_at)}</TableBodyCell>
						<TableBodyCell class="px-6 py-4">
							<!-- Action buttons container -->
							<div class="flex space-x-2">
								<!-- View button with icon -->
								<Button size="xs" color="alternative" href="/admin/user/{user.id}">
									<EyeOutline class="me-1.5 h-3.5 w-3.5" /> View
								</Button>
								<!-- Edit button (commented out) -->
								<!-- <Button size="xs" color="primary" href="/admin/user/{user.id}/edit">
									<EditOutline class="me-1.5 h-3.5 w-3.5" /> Edit
								</Button> -->
								<!-- Delete button (commented out) -->
								<!-- <Button size="xs" color="red" on:click={() => handleDelete(user.id)}>
									<TrashBinOutline class="me-1.5 h-3.5 w-3.5" /> Delete
								</Button> -->
							</div>
						</TableBodyCell>
					</TableBodyRow>
				{:else}
					<!-- Row displayed when there is no data -->
					<TableBodyRow>
						<TableBodyCell colspan={currentUser().is_super_admin ? 9 : 8} class="text-center px-6 py-4">
							No users found.
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</DataTable>
</div>

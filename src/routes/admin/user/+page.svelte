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
	import { Container } from '$lib/components/layout';
	import { hasPermission } from '$lib/utils/permissions';

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

<!-- Main page container with Container component -->
<Container breadcrumb={breadcrumbItems}>
	<!-- Page header section with responsive layout and spacing -->
	<div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<!-- Page title using h1 -->
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
		<!-- Add User button with icon and link -->
		{#if hasPermission(currentUser(), 'user/create')}
		<Button href="/admin/user/add">
			<PlusOutline class="me-2 h-4 w-4" /> Add User
		</Button>
		{/if}
	</div>

	<!-- DataTable component wrapping the table -->
	<DataTable data={data.users} meta={data.meta} {filterConfig}>
		<!-- Flowbite Table component with hover effect, constrained height, borders, and rounded corners -->
		<Table hoverable={true} shadow divClass="relative max-h-[70vh] overflow-x-auto overflow-y-auto">
			<!-- Sticky table header with standard styling -->
			<TableHead
				class="sticky top-0 z-10 bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400"
			>
				<TableHeadCell>ID</TableHeadCell>
				<TableHeadCell>UUID</TableHeadCell>
				<TableHeadCell>Username</TableHeadCell>
				<TableHeadCell>Status</TableHeadCell>
				{#if currentUser().is_super_admin}
					<TableHeadCell>Domains</TableHeadCell>
					<TableHeadCell>Super Admin</TableHeadCell>
				{/if}
				<TableHeadCell>Created At</TableHeadCell>
				<TableHeadCell>Updated At</TableHeadCell>
				<TableHeadCell>Actions</TableHeadCell>
			</TableHead>
			<!-- Table body with dividers -->
			<TableBody class="divide-y divide-gray-200 dark:divide-gray-700">
				{#each data.users as user (user.id)}
					<!-- Table row with standard background -->
					<TableBodyRow class="bg-white dark:bg-gray-800">
						<TableBodyCell
							class="px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white"
							>{user.id}</TableBodyCell
						>
						<TableBodyCell class="px-6 py-4 whitespace-nowrap">{user.uuid}</TableBodyCell>
						<TableBodyCell class="px-6 py-4">{user.username}</TableBodyCell>
						<TableBodyCell class="px-6 py-4">
							<Badge large rounded color={user.is_active ? 'green' : 'red'}>
								{user.is_active ? 'Active' : 'Inactive'}
							</Badge>
						</TableBodyCell>
						{#if currentUser().is_super_admin}
							<TableBodyCell class="max-w-xs truncate px-6 py-4">
								{#if user.domains.length}
									{user.domains.map((d) => d.name).join(', ')}
								{:else}
									<span class="text-gray-500 dark:text-gray-400">None</span>
								{/if}
							</TableBodyCell>
							<TableBodyCell class="px-6 py-4">
								<Badge large rounded color={user.is_super_admin ? 'purple' : 'gray'}>
									{user.is_super_admin ? 'Yes' : 'No'}
								</Badge>
							</TableBodyCell>
						{/if}

						<TableBodyCell class="px-6 py-4 whitespace-nowrap"
							>{formatDate(user.created_at)}</TableBodyCell
						>
						<TableBodyCell class="px-6 py-4 whitespace-nowrap"
							>{formatDate(user.updated_at)}</TableBodyCell
						>
						<TableBodyCell class="px-6 py-4">
							<!-- Action buttons container -->
							<div class="flex space-x-2">
								<!-- View button with icon -->
								{#if hasPermission(currentUser(), 'user/show')}
									<Button
										size="xs"
										color="alternative"
										href="/admin/user/{user.id}"
										title="View User Details"
									>
										<EyeOutline class="me-1.5 h-3.5 w-3.5" /> View
									</Button>
								{/if}
								<!-- Edit button with icon -->
								<!-- {#if hasPermission('user/edit')}
									<Button
										size="xs"
										color="alternative"
										href="/admin/user/{user.id}/edit"
										title="Edit User"
									>
										<EditOutline class="me-1.5 h-3.5 w-3.5" /> Edit
									</Button>
								{/if} -->
								<!-- Delete button (example, adjust permission as needed) -->
								<!-- {#if hasPermission('user/delete')}
									<Button
										size="xs"
										color="red"
										title="Delete User"
										on:click={() => {
											/* Add delete logic */
										}}
									>
										<TrashBinOutline class="me-1.5 h-3.5 w-3.5" /> Delete
									</Button>
								{/if} -->
							</div>
						</TableBodyCell>
					</TableBodyRow>
				{:else}
					<!-- Row displayed when there is no data -->
					<TableBodyRow>
						<TableBodyCell
							colspan={currentUser().is_super_admin ? 9 : 7}
							class="text-center px-6 py-4"
						>
							No users found.
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</DataTable>
</Container>

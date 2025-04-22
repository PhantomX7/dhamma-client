<script>
	import { Badge, Button } from 'flowbite-svelte';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	// Added icons
	import { PlusOutline, EyeOutline, EditOutline } from 'flowbite-svelte-icons';
	import { formatDate } from '$lib/utils';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import DataTable from '$lib/components/DataTable.svelte';
	import { getContext } from 'svelte';
	import { FilterType } from '$lib/utils/filter';

	// Component props
	let { data } = $props();
	// Get current user context (not used directly here, but kept for consistency)
	const currentUser = getContext('user');

	// Breadcrumb items definition
	const breadcrumbItems = [{ label: 'Roles' }];

	// Configuration for the DataTable filter component
	const filterConfig = {
		// Optional: Add domain name filter if needed
		'domain.name': { // Adjusted key for potential nested filtering if DataTable supports it
			type: FilterType.STRING,
			label: 'Domain Name'
		},
		name: {
			type: FilterType.STRING,
			label: 'Role Name'
		},
		is_active: {
			type: FilterType.BOOL,
			label: 'Status Active'
		},
		created_at: {
			type: FilterType.DATE,
			label: 'Created Date'
		}
	};
</script>

<!-- Main page container with standard padding and dark mode background -->
<div class="min-h-screen p-4 md:p-6 dark:bg-gray-900">
	<!-- Breadcrumb navigation with bottom margin -->
	<Breadcrumb class="mb-6" items={breadcrumbItems} />

	<!-- Page header section with responsive layout and spacing -->
	<div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<!-- Page title using h1 -->
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Roles</h1>
		<!-- Add Role button with icon -->
		<Button href="/admin/role/add">
			<PlusOutline class="me-2 h-4 w-4" /> Add New Role
		</Button>
	</div>

	<!-- DataTable component wrapping the table -->
	<DataTable data={data.roles} meta={data.meta} {filterConfig}>
		<!-- Flowbite Table component with hover effect, constrained height, borders, and rounded corners -->
		<Table
			hoverable={true}
			divClass="relative max-h-[70vh] overflow-x-auto overflow-y-auto"
		>
			<!-- Sticky table header with standard styling -->
			<TableHead
				class="sticky top-0 z-10 bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400"
			>
				<TableHeadCell>ID</TableHeadCell>
				<TableHeadCell>Domain</TableHeadCell>
				<TableHeadCell>Role Name</TableHeadCell>
				<TableHeadCell>Description</TableHeadCell>
				<TableHeadCell>Active</TableHeadCell>
				<TableHeadCell>Created At</TableHeadCell>
				<TableHeadCell>Actions</TableHeadCell>
			</TableHead>
			<!-- Table body with dividers -->
			<TableBody class="divide-y divide-gray-200 dark:divide-gray-700">
				{#each data.roles as role (role.id)}
					<!-- Table row with standard background -->
					<TableBodyRow class="bg-white dark:bg-gray-800">
						<TableBodyCell class="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">{role.id}</TableBodyCell>
						<TableBodyCell class="px-6 py-4">{role.domain?.name || 'N/A'}</TableBodyCell>
						<TableBodyCell class="px-6 py-4">{role.name}</TableBodyCell>
						<TableBodyCell class="px-6 py-4 max-w-sm truncate">{role.description || 'N/A'}</TableBodyCell>
						<TableBodyCell class="px-6 py-4">
							<!-- Use green/red for active status consistency -->
							<Badge large rounded color={role.is_active ? 'green' : 'red'}>
								{role.is_active ? 'Active' : 'Inactive'}
							</Badge>
						</TableBodyCell>
						<TableBodyCell class="whitespace-nowrap px-6 py-4">{formatDate(role.created_at)}</TableBodyCell>
						<TableBodyCell class="px-6 py-4">
							<!-- Action buttons container -->
							<div class="flex space-x-2">
								<!-- View button with icon -->
								<Button size="xs" color="alternative" href="/admin/role/{role.id}">
									<EyeOutline class="me-1.5 h-3.5 w-3.5" /> View
								</Button>
								<!-- Edit button with icon -->
								<Button size="xs" color="primary" href="/admin/role/{role.id}/edit">
									<EditOutline class="me-1.5 h-3.5 w-3.5" /> Edit
								</Button>
							</div>
						</TableBodyCell>
					</TableBodyRow>
				{:else}
					<!-- Row displayed when there is no data -->
					<TableBodyRow>
						<TableBodyCell colspan="7" class="text-center px-6 py-4">
							No roles found.
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</DataTable>
</div>
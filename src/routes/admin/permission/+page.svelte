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
	const breadcrumbItems = [{ label: 'Permissions' }];

	// Configuration for the DataTable filter component
	const filterConfig = {
		name: {
			type: FilterType.STRING,
			label: 'Name'
		},
		code: {
			type: FilterType.STRING,
			label: 'Code'
		},
		type: {
			type: FilterType.ENUM,
			label: 'Type',
			enumValues: ['API', 'WEB']
		}
		// Add other relevant filters like 'object', 'action', 'is_domain_specific' if needed
	};
</script>

<!-- Main page container with standard padding and dark mode background -->
<div class="min-h-screen p-4 md:p-6 dark:bg-gray-900">
	<!-- Breadcrumb navigation with bottom margin -->
	<Breadcrumb class="mb-6" items={breadcrumbItems} />

	<!-- Page header section with responsive layout and spacing -->
	<div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<!-- Page title using h1 -->
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Permissions</h1>
		<!-- Add Permission button with icon -->
		<Button href="/admin/permission/add">
			<PlusOutline class="me-2 h-4 w-4" /> Add New Permission
		</Button>
	</div>

	<!-- DataTable component wrapping the table -->
	<DataTable data={data.permissions} meta={data.meta} {filterConfig}>
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
				<TableHeadCell>Name</TableHeadCell>
				<TableHeadCell>Code</TableHeadCell>
				<TableHeadCell>Object</TableHeadCell>
				<TableHeadCell>Action</TableHeadCell>
				<TableHeadCell>Type</TableHeadCell>
				<TableHeadCell>Domain Specific</TableHeadCell>
				<TableHeadCell>Created At</TableHeadCell>
				<TableHeadCell>Actions</TableHeadCell>
			</TableHead>
			<!-- Table body with dividers -->
			<TableBody class="divide-y divide-gray-200 dark:divide-gray-700">
				{#each data.permissions as permission (permission.id)}
					<!-- Table row with standard background -->
					<TableBodyRow class="bg-white dark:bg-gray-800">
						<TableBodyCell class="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white">{permission.id}</TableBodyCell>
						<TableBodyCell class="px-6 py-4">{permission.name}</TableBodyCell>
						<TableBodyCell class="px-6 py-4">{permission.code}</TableBodyCell>
						<TableBodyCell class="px-6 py-4">{permission.object}</TableBodyCell>
						<TableBodyCell class="px-6 py-4">{permission.action}</TableBodyCell>
						<TableBodyCell class="px-6 py-4">{permission.type}</TableBodyCell>
						<TableBodyCell class="px-6 py-4">
							<Badge large rounded color={permission.is_domain_specific ? 'blue' : 'gray'}>
								{permission.is_domain_specific ? 'Yes' : 'No'}
							</Badge>
						</TableBodyCell>
						<TableBodyCell class="whitespace-nowrap px-6 py-4">{formatDate(permission.created_at)}</TableBodyCell>
						<TableBodyCell class="px-6 py-4">
							<!-- Action buttons container -->
							<div class="flex space-x-2">
								<!-- View button with icon -->
								<Button size="xs" color="alternative" href="/admin/permission/{permission.id}">
									<EyeOutline class="me-1.5 h-3.5 w-3.5" /> View
								</Button>
								<!-- Edit button with icon -->
								<Button size="xs" color="primary" href="/admin/permission/{permission.id}/edit">
									<EditOutline class="me-1.5 h-3.5 w-3.5" /> Edit
								</Button>
							</div>
						</TableBodyCell>
					</TableBodyRow>
				{:else}
					<!-- Row displayed when there is no data -->
					<TableBodyRow>
						<TableBodyCell colspan="9" class="text-center px-6 py-4">
							No permissions found.
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</DataTable>
</div>

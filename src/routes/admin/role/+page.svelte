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
	import DataTable from '$lib/components/DataTable.svelte';
	import { Container } from '$lib/components/layout'; // Import Container
	import { getContext } from 'svelte';
	import { FilterType } from '$lib/utils/filter';

	// Component props
	let { data } = $props();
	const currentUser = getContext('user');
	import { hasPermission } from '$lib/utils/permissions';

	// Breadcrumb items definition
	const breadcrumbItems = $derived([{ label: 'Roles', href: '/admin/role' }]);

	// Configuration for the DataTable filter component
	const filterConfig = $derived({
		...(currentUser().is_super_admin && {
			domain_name: {
				type: FilterType.STRING,
				label: 'Domain Name'
			}
		}),
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
	});

	const tableColspan = $derived(currentUser().is_super_admin ? 7 : 6);
</script>

<!-- Use Container component -->
<Container breadcrumb={breadcrumbItems} title="Roles">
	{#snippet headerActions()}
		<!-- Add Role button with icon -->
		{#if hasPermission(currentUser(), 'role/create')}
			<Button href="/admin/role/add">
				<PlusOutline class="me-2 h-4 w-4" /> Add New Role
			</Button>
		{/if}
	{/snippet}

	<!-- DataTable component wrapping the table -->
	<DataTable data={data.roles} meta={data.meta} {filterConfig}>
		<!-- Flowbite Table component with hover effect, constrained height, borders, and rounded corners -->
		<Table hoverable={true} shadow divClass="relative max-h-[70vh] overflow-x-auto overflow-y-auto">
			<!-- Sticky table header with standard styling -->
			<TableHead
				class="sticky top-0 z-10 bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400"
			>
				<TableHeadCell>ID</TableHeadCell>
				{#if currentUser().is_super_admin}
					<TableHeadCell>Domain</TableHeadCell>
				{/if}
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
						<TableBodyCell
							class="px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white"
							>{role.id}</TableBodyCell
						>
						{#if currentUser().is_super_admin}
							<TableBodyCell class="px-6 py-4">{role.domain?.name || 'N/A'}</TableBodyCell>
						{/if}
						<TableBodyCell class="px-6 py-4">{role.name}</TableBodyCell>
						<TableBodyCell class="max-w-sm truncate px-6 py-4"
							>{role.description || 'N/A'}</TableBodyCell
						>
						<TableBodyCell class="px-6 py-4">
							<!-- Use green/red for active status consistency -->
							<Badge large rounded color={role.is_active ? 'green' : 'red'}>
								{role.is_active ? 'Active' : 'Inactive'}
							</Badge>
						</TableBodyCell>
						<TableBodyCell class="px-6 py-4 whitespace-nowrap"
							>{formatDate(role.created_at)}</TableBodyCell
						>
						<TableBodyCell class="px-6 py-4">
							<!-- Action buttons container -->
							<div class="flex space-x-2">
								{#if hasPermission(currentUser(), 'role/show')}
									<Button size="xs" color="alternative" href="/admin/role/{role.id}">
										<EyeOutline class="me-1.5 h-3.5 w-3.5" /> View
									</Button>
								{/if}
								{#if hasPermission(currentUser(), 'role/update')}
									<Button size="xs" color="primary" href="/admin/role/{role.id}/edit">
										<EditOutline class="me-1.5 h-3.5 w-3.5" /> Edit
									</Button>
								{/if}
							</div>
						</TableBodyCell>
					</TableBodyRow>
				{:else}
					<!-- Row displayed when there is no data -->
					<TableBodyRow>
						<TableBodyCell colspan={tableColspan} class="text-center px-6 py-4">No roles found.</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</DataTable>
</Container>

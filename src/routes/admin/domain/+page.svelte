<script>
	import {
		Button,
		Badge,
		Table,
		TableBody,
		TableBodyRow,
		TableBodyCell,
		TableHead,
		TableHeadCell,
		breadcrumb
	} from 'flowbite-svelte';
	// Added icons for buttons
	import { PlusOutline, EyeOutline, EditOutline } from 'flowbite-svelte-icons';
	import { formatDate } from '$lib/utils';
	import DataTable from '$lib/components/DataTable.svelte';
	import { FilterType } from '$lib/utils/filter';
	import { Container } from '$lib/components/layout';

	// Component props
	let { data } = $props();

	// Breadcrumb items definition
	const breadcrumbItems = [{ label: 'Domains' }];

	// Configuration for the DataTable filter component
	const filterConfig = {
		id: {
			type: FilterType.ID,
			label: 'ID'
		},
		name: {
			type: FilterType.STRING,
			label: 'Name'
		},
		code: {
			type: FilterType.STRING,
			label: 'Code'
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

<Container breadcrumb={breadcrumbItems}>
	<!-- Page header section with responsive layout and spacing -->
	<div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<!-- Page title using h1 for semantic structure -->
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Domains</h1>
		<!-- Add Domain button with icon -->
		<Button href="/admin/domain/add">
			<PlusOutline class="me-2 h-4 w-4" /> Add Domain
		</Button>
	</div>

	<!-- DataTable component wrapping the table -->
	<DataTable data={data.domains} meta={data.meta} {filterConfig}>
		<!-- Flowbite Table component with hover effect and constrained height -->
		<Table hoverable={true} shadow divClass="relative max-h-[70vh] overflow-x-auto overflow-y-auto">
			<!-- Sticky table header -->
			<TableHead
				class="sticky top-0 z-10 bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400"
			>
				<TableHeadCell>ID</TableHeadCell>
				<TableHeadCell>Name</TableHeadCell>
				<TableHeadCell>Code</TableHeadCell>
				<TableHeadCell>Status</TableHeadCell>
				<TableHeadCell>Description</TableHeadCell>
				<TableHeadCell>Created At</TableHeadCell>
				<TableHeadCell>Actions</TableHeadCell>
			</TableHead>
			<!-- Table body containing domain data -->
			<TableBody class="divide-y divide-gray-200 dark:divide-gray-700">
				{#each data.domains as domain (domain.id)}
					<TableBodyRow class="bg-white dark:bg-gray-800">
						<TableBodyCell
							class="px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white"
							>{domain.id}</TableBodyCell
						>
						<TableBodyCell>{domain.name}</TableBodyCell>
						<TableBodyCell>{domain.code}</TableBodyCell>
						<TableBodyCell>
							<!-- Status badge with conditional coloring -->
							<Badge large rounded color={domain.is_active ? 'green' : 'red'}>
								{domain.is_active ? 'Active' : 'Inactive'}
							</Badge>
						</TableBodyCell>
						<TableBodyCell class="max-w-sm truncate">{domain.description || 'N/A'}</TableBodyCell>
						<TableBodyCell>{formatDate(domain.created_at)}</TableBodyCell>
						<TableBodyCell>
							<!-- Action buttons container -->
							<div class="flex space-x-2">
								<!-- View button with icon -->
								<Button size="xs" color="alternative" href="/admin/domain/{domain.id}">
									<EyeOutline class="me-1.5 h-3.5 w-3.5" /> View
								</Button>
								<!-- Edit button with icon -->
								<Button size="xs" color="primary" href="/admin/domain/{domain.id}/edit">
									<EditOutline class="me-1.5 h-3.5 w-3.5" /> Edit
								</Button>
							</div>
						</TableBodyCell>
					</TableBodyRow>
				{:else}
					<!-- Row displayed when there is no data -->
					<TableBodyRow>
						<TableBodyCell colspan="7" class="text-center">No domains found.</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</DataTable>
</Container>

<script>
	import { Button, Card, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
	import { ArrowLeftOutline, CashOutline } from 'flowbite-svelte-icons';
	import { formatDateTime } from '$lib/utils'; // Assuming you might want to show a timestamp
	import DataTable from '$lib/components/DataTable.svelte';
	import { Container } from '$lib/components/layout'; // Import Container
	import { FilterType } from '$lib/utils/filter';

	// Component props from load function
	let { data } = $props();
	const follower = $derived(data.follower);
	const pointMutationList = $derived(data.pointMutations);
	const followerId = $derived(data.followerId);

	// Breadcrumb items
	const breadcrumbItems = $derived([
		{ href: '/admin/follower', label: 'Followers' },
		{
			href: `/admin/follower/${followerId}`,
			label: follower?.name || `Follower ${followerId}`
		},
		{ label: 'Point History' }
	]);

	// Filter configuration for the DataTable (optional, can be expanded)
	const filterConfig = $derived({
		description: {
			type: FilterType.STRING,
			label: 'Description'
		},
		created_at: {
			type: FilterType.DATE,
			label: 'Date'
		}
	});
</script>

<!-- Use Container component -->
<Container
	breadcrumb={breadcrumbItems}
	title={`Point Mutation History for: ${follower?.name || `Follower ${followerId}`}`}
>
	{#snippet headerActions()}
		{#if followerId}
			<Button color="alternative" href={`/admin/follower/${followerId}`}>
				<ArrowLeftOutline class="me-2 h-4 w-4" />
				Back to Follower Details
			</Button>
		{/if}
	{/snippet}

	<Card size="xl" class="mb-8 p-4">
		<h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white"><CashOutline class="me-2 inline-block h-5 w-5 align-text-bottom" />Point History</h2>

		<DataTable data={pointMutationList} meta={data.meta} {filterConfig}>
			{#if pointMutationList && pointMutationList.length > 0}
				<Table hoverable={true} class="w-full">
					<TableHead>
						<TableHeadCell>Amount</TableHeadCell>
						<TableHeadCell>Description</TableHeadCell>
						<TableHeadCell class="hidden sm:table-cell">Date</TableHeadCell>
					</TableHead>
					<TableBody class="divide-y divide-gray-200 dark:divide-gray-700">
						{#each pointMutationList as mutation (mutation.id)}
							<TableBodyRow>
								<TableBodyCell class="whitespace-nowrap font-medium {(mutation.amount || 0) < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}">
									{(mutation.amount || 0) > 0 ? '+' : ''}{mutation.amount || 0}
								</TableBodyCell>
								<TableBodyCell class="text-gray-900 dark:text-white">
									{mutation.description || 'N/A'}
								</TableBodyCell>
								<TableBodyCell class="hidden sm:table-cell">
									{formatDateTime(mutation.created_at)} 
								</TableBodyCell>
							</TableBodyRow>
						{/each}
					</TableBody>
				</Table>
			{:else}
				<div class="p-4 text-center text-gray-500 dark:text-gray-400">
					No point mutation records found for this follower.
				</div>
			{/if}
		</DataTable>
	</Card>
</Container>
<script>
	import {
		Card,
		Button,
		Table,
		TableBody,
		TableBodyRow,
		TableBodyCell,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	// Sample data for the dashboard
	const recentUsers = [
		{ name: 'John Doe', email: 'john@example.com', role: 'User', status: 'Active' },
		{ name: 'Jane Smith', email: 'jane@example.com', role: 'Admin', status: 'Active' },
		{ name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' }
	];

	// Empty breadcrumb items for dashboard as it's the root
	const breadcrumbItems = [];
</script>

<div class="p-4">
	<Breadcrumb items={breadcrumbItems} />

	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		
	</div>
</div>

<!-- Recent Users Table -->
<Card class="mt-4">
	<h5 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Recent Users</h5>
	<Table striped={true}>
		<TableHead>
			<TableHeadCell>Name</TableHeadCell>
			<TableHeadCell>Email</TableHeadCell>
			<TableHeadCell>Role</TableHeadCell>
			<TableHeadCell>Status</TableHeadCell>
			<TableHeadCell>Actions</TableHeadCell>
		</TableHead>
		<TableBody>
			{#each recentUsers as user}
				<TableBodyRow>
					<TableBodyCell>{user.name}</TableBodyCell>
					<TableBodyCell>{user.email}</TableBodyCell>
					<TableBodyCell>{user.role}</TableBodyCell>
					<TableBodyCell>
						<span
							class="inline-flex rounded-full bg-green-100 px-2 text-xs leading-5 font-semibold text-green-800"
						>
							{user.status}
						</span>
					</TableBodyCell>
					<TableBodyCell>
						<Button size="xs" color="green">View</Button>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</Card>

<script>
	import {
		Card,
		Button,
		Badge,
		Table,
		TableBody,
		TableBodyRow,
		TableBodyCell,
		TableHead,
		TableHeadCell,
		TableSearch,
		Pagination
	} from 'flowbite-svelte';
	import { getContext } from 'svelte';

	let { data } = $props();

	import { formatDate } from '$lib/utils';

	const currentUser = getContext('user');

	// Function to check if a field should be rendered based on super admin status
	function shouldRenderField(fieldName) {
		const isSuperAdmin = currentUser().is_super_admin;
		const superAdminOnlyFields = ['id', 'uuid', 'is_super_admin'];
		return !superAdminOnlyFields.includes(fieldName) || isSuperAdmin;
	}
</script>

<div class="p-4">
	<div class="mb-4 flex items-center justify-between">
		<h2 class="text-xl font-bold">users</h2>
		<Button color="blue">Add User</Button>
	</div>

	<Table striped={true}>
		<TableHead>
			{#if shouldRenderField('id')}
				<TableHeadCell>ID</TableHeadCell>
				<TableHeadCell>UUID</TableHeadCell>
			{/if}
			<TableHeadCell>Username</TableHeadCell>
			{#if shouldRenderField('is_super_admin')}
				<TableHeadCell>Super Admin</TableHeadCell>
			{/if}
			<TableHeadCell>Status</TableHeadCell>
			<TableHeadCell>Domains</TableHeadCell>
			<TableHeadCell>Created At</TableHeadCell>
			<TableHeadCell>Updated At</TableHeadCell>
			<TableHeadCell>Actions</TableHeadCell>
		</TableHead>
		<TableBody>
			{#each data.users as user}
				<TableBodyRow>
					{#if shouldRenderField('id')}
						<TableBodyCell>{user.id}</TableBodyCell>
						<TableBodyCell>{user.uuid}</TableBodyCell>
					{/if}
					<TableBodyCell>{user.username}</TableBodyCell>
					{#if shouldRenderField('is_super_admin')}
						<TableBodyCell>
							<Badge rounded color={user.is_super_admin ? 'purple' : 'gray'}>
								{user.is_super_admin ? 'Yes' : 'No'}
							</Badge>
						</TableBodyCell>
					{/if}
					<TableBodyCell>
						<Badge rounded color={user.is_active ? 'green' : 'red'}>
							{user.is_active ? 'Active' : 'Inactive'}
						</Badge>
					</TableBodyCell>
					<TableBodyCell>
						{user.domains.length ? user.domains.map((d) => d.name).join(', ') : 'None'}
					</TableBodyCell>
					<TableBodyCell>{formatDate(user.created_at)}</TableBodyCell>
					<TableBodyCell>{formatDate(user.updated_at)}</TableBodyCell>
					<TableBodyCell>
						<div class="flex gap-2">
							<Button size="xs" color="blue">Edit</Button>
							<Button size="xs" color="red">Delete</Button>
						</div>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>

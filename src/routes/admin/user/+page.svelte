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
		TableSearch
	} from 'flowbite-svelte';

	import { goto } from '$app/navigation';
	import { formatDate } from '$lib/utils';
	import Pagination from '$lib/components/Pagination.svelte';
	import { handlePaginationNavigation } from '$lib/utils/navigation';

	let { data } = $props();

	import { getContext } from 'svelte';
	const currentUser = getContext('user');
</script>

<div class="p-4">
	<div class="mb-4 flex items-center justify-between">
		<h2 class="text-xl font-bold">users</h2>
		<Button color="blue">Add User</Button>
	</div>

	<Table striped={true}>
		<TableHead>
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
		<TableBody>
			{#each data.users as user}
				<TableBodyRow>
					<TableBodyCell>{user.id}</TableBodyCell>
					<TableBodyCell>{user.uuid}</TableBodyCell>
					<TableBodyCell>{user.username}</TableBodyCell>
					{#if currentUser().is_super_admin}
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

	{#if data.meta}
		<div class="mt-4">
			<Pagination
				total={data.meta.total}
				limit={data.meta.limit}
				offset={data.meta.offset}
				on:pageChange={(event) => {
					goto(
						handlePaginationNavigation({
							page: event.detail,
							meta: data.meta
						}),
						{ keepFocus: true }
					);
				}}
			/>
		</div>
	{/if}
</div>

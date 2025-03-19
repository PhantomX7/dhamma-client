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
    import { getContext } from 'svelte';
    import { formatDate } from '$lib/utils';
    import DataTable from '$lib/components/DataTable.svelte';
    import { FilterType } from '$lib/utils/filter';

    let { data } = $props();
    const currentUser = getContext('user');

    const filterConfig = {
        username: {
            type: FilterType.STRING,
            label: 'Username'
        },
        is_active: {
            type: FilterType.BOOL,
            label: 'Status'
        },
        created_at: {
            type: FilterType.DATE,
            label: 'Created Date'
        }
    };
</script>

<div class="p-4">
    <div class="mb-4 flex items-center justify-between">
        <h2 class="text-xl font-bold">Users</h2>
        <Button color="blue">Add User</Button>
    </div>

    <DataTable data={data.users} meta={data.meta} {filterConfig}>
            <Table hoverable={true} divClass="max-h-[70vh] overflow-y-auto">
                <TableHead class="sticky top-0 z-10 bg-white shadow-sm">
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
                                    <Button size="xs" color="green" href="/admin/user/{user.id}">View</Button>
                                    <Button size="xs" color="blue">Edit</Button>
                                    <Button size="xs" color="red">Delete</Button>
                                </div>
                            </TableBodyCell>
                        </TableBodyRow>
                    {/each}
                </TableBody>
            </Table>
    </DataTable>
</div>

<script>
    import { Card, Button, Table, TableBody, TableBodyRow, TableBodyCell, TableHead, TableHeadCell } from 'flowbite-svelte';

    // Sample data for the dashboard
    const recentUsers = [
        { name: 'John Doe', email: 'john@example.com', role: 'User', status: 'Active' },
        { name: 'Jane Smith', email: 'jane@example.com', role: 'Admin', status: 'Active' },
        { name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' }
    ];
</script>

<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <!-- Stats Cards -->
    <Card>
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">1,257</p>
            </div>
            <div class="rounded-full bg-green-100 p-3 dark:bg-green-900">
                <svg class="h-6 w-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            </div>
        </div>
    </Card>

    <Card>
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Sessions</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">423</p>
            </div>
            <div class="rounded-full bg-green-100 p-3 dark:bg-green-900">
                <svg class="h-6 w-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
        </div>
    </Card>

    <Card>
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">New Users</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">89</p>
            </div>
            <div class="rounded-full bg-green-100 p-3 dark:bg-green-900">
                <svg class="h-6 w-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
            </div>
        </div>
    </Card>

    <Card>
        <div class="flex items-center justify-between">
            <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">$12,875</p>
            </div>
            <div class="rounded-full bg-green-100 p-3 dark:bg-green-900">
                <svg class="h-6 w-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
        </div>
    </Card>
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
                        <span class="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
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
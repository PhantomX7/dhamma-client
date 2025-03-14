<script>
	import {
		Sidebar,
		SidebarGroup,
		SidebarItem,
		SidebarWrapper,
		SidebarDropdownWrapper,
		SidebarDropdownItem,
		DarkMode,
		Navbar,
		NavBrand,
		Avatar,
		Dropdown,
		DropdownItem,
		DropdownHeader,
		DropdownDivider
	} from 'flowbite-svelte';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { ChartPieOutline, UserOutline, CogOutline } from 'flowbite-svelte-icons';

	let { data, children } = $props();

	let isOpen = $state(false);
	// Sidebar items configuration
	const sidebarItems = [
		{ href: '/admin/users', label: 'Users', icon: UserOutline },
		{
			href: '/admin',
			label: 'Dashboard',
			icon: ChartPieOutline,
			child: [{ href: '/admin/child', label: 'Test' }]
		},
		{ href: '/admin/settings', label: 'Settings', icon: CogOutline }
	];

	// Toggle sidebar for mobile view
	function toggleSidebar() {
		isOpen = !isOpen;
	}
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Sidebar -->
	<Sidebar
		class="fixed top-0 left-0 z-40 h-screen border-r border-gray-200 pt-14 transition-transform"
		activeUrl={$page.url.pathname}
	>
		<SidebarWrapper divClass="h-full overflow-y-auto bg-white px-3 py-4">
			<SidebarGroup>
				{#each sidebarItems as item}
					{#if item.child}
						<SidebarDropdownWrapper label={item.label}>
							<svelte:fragment slot="icon">
								{#if item.icon}{@const Icon = item.icon}<Icon class="mr-5 h-5 w-5" />{/if}
							</svelte:fragment>
							{#each item.child as child}
								<SidebarDropdownItem href={child.href} label={child.label}></SidebarDropdownItem>
							{/each}
						</SidebarDropdownWrapper>
					{:else}
						<SidebarItem href={item.href} label={item.label}>
							<svelte:fragment slot="icon">
								{#if item.icon}{@const Icon = item.icon}<Icon class="mr-5 h-5 w-5" />{/if}
							</svelte:fragment>
						</SidebarItem>
					{/if}
				{/each}
			</SidebarGroup>
		</SidebarWrapper>
	</Sidebar>

	<!-- Header -->
	<Navbar class="fixed top-0 right-0 left-0 z-50 border-b border-gray-200 bg-white">
		<NavBrand href="/admin">
			<span class="text-primary-700 self-center text-xl font-semibold whitespace-nowrap"
				>Admin Panel</span
			>
		</NavBrand>
		<div class="flex items-center gap-4">
			<DarkMode />
			<Avatar id="avatar-menu" alt="User settings">A</Avatar>
			<Dropdown triggeredBy="#avatar-menu" class="z-50">
				<DropdownHeader>
					<span class="block text-sm">Admin User</span>
					<span class="block truncate text-sm font-medium">admin@example.com</span>
				</DropdownHeader>
				<!-- <DropdownItem href="/admin/profile">Profile</DropdownItem>
				<DropdownItem href="/admin/settings">Settings</DropdownItem> -->
				<DropdownDivider />
				<form class="cursor-pointer" method="post" action="/admin?/logout" use:enhance>
					<DropdownItem >
						<button type="submit">Sign Out</button>
					</DropdownItem>
				</form>
			</Dropdown>
		</div>
	</Navbar>

	<!-- Main Content -->
	<main class="min-h-screen p-4 pt-20 lg:ml-64">
		<div class="rounded-lg border-gray-200 bg-white p-4 shadow-sm">
			{@render children()}
		</div>
	</main>
</div>

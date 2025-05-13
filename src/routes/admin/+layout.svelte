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
		DropdownDivider,
		Button
	} from 'flowbite-svelte';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import {
		GlobeOutline,
		UserOutline,
		CogOutline,
		BarsOutline,
		UsersGroupOutline, // Icon for Followers (can be changed if a more specific one is preferred)
		ApiKeyOutline
	} from 'flowbite-svelte-icons';
	import { hasPermission } from '$lib/utils/permissions.js';

	let { data, children } = $props();

	// State variables
	let isOpen = $state(false);
	let isSidebarCollapsed = $state(false);

	// Get context data
	import { getContext } from 'svelte';
	const user = getContext('user');

	// Sidebar items configuration
	const sidebarItems = [
		{ href: '/admin/domain', permission: 'root', label: 'Domains', icon: GlobeOutline },
		{ href: '/admin/user', permission: 'user/index', label: 'Users', icon: UserOutline },
		{ href: '/admin/role', permission: 'role/index', label: 'Roles', icon: UsersGroupOutline },
		{ href: '/admin/follower', permission: 'follower/index', label: 'Followers', icon: UsersGroupOutline }, // Added Follower link
		{ href: '/admin/permission', permission: 'root', label: 'Permissions', icon: ApiKeyOutline }
		// {
		// 	href: '/admin',
		// 	label: 'Dashboard',
		// 	icon: ChartPieOutline,
		// 	child: [{ href: '/admin/child', label: 'Test' }]
		// },
		// { href: '/admin/settings', label: 'Settings', icon: CogOutline } // Updated Settings icon
	];

	/**
	 * Toggles the collapsed state of the sidebar.
	 * Also ensures the mobile overlay is closed if open.
	 */
	function toggleSidebarCollapse() {
		isSidebarCollapsed = !isSidebarCollapsed;
		if (isOpen) isOpen = false; // Close mobile overlay if sidebar state changes
	}
</script>

<!-- Add dark mode background class to the main container -->
<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
	<!-- Sidebar -->
	<Sidebar
		class="fixed top-0 left-0 z-40 h-screen border-r border-gray-200 pt-14 transition-transform duration-300 dark:border-gray-700 {isSidebarCollapsed
			? 'w-0 -translate-x-full opacity-0'
			: 'w-64 translate-x-0 opacity-100'}"
		activeUrl={sidebarItems.find((item) => $page.url.pathname.startsWith(item.href))?.href ||
			$page.url.pathname}
	>
		<!-- Add dark mode background class to the sidebar wrapper -->
		<SidebarWrapper divClass="h-full overflow-y-auto bg-white px-3 py-4 dark:bg-gray-800">
			<SidebarGroup>
				{#each sidebarItems as item}
					{#if hasPermission(user(), item.permission)}
						{#if item.child}
							<SidebarDropdownWrapper label={isSidebarCollapsed ? '' : item.label}>
								<svelte:fragment slot="icon">
									{#if item.icon}{@const Icon = item.icon}<Icon
											class="{isSidebarCollapsed ? 'mx-auto' : 'mr-5'} h-5 w-5"
										/>{/if}
								</svelte:fragment>
								{#each item.child as child}
									{#if hasPermission(user(), child.permission)}
										<SidebarDropdownItem
											href={child.href}
											label={isSidebarCollapsed ? '' : child.label}
										></SidebarDropdownItem>
									{/if}
								{/each}
							</SidebarDropdownWrapper>
						{:else}
							<SidebarItem href={item.href} label={isSidebarCollapsed ? '' : item.label}>
								<svelte:fragment slot="icon">
									{#if item.icon}{@const Icon = item.icon}<Icon
											class="{isSidebarCollapsed ? 'mx-auto' : 'mr-5'} h-5 w-5"
										/>{/if}
								</svelte:fragment>
							</SidebarItem>
						{/if}
					{/if}
				{/each}
			</SidebarGroup>
		</SidebarWrapper>
	</Sidebar>

	<!-- Header -->
	<!-- Add dark mode background and border classes to the Navbar -->
	<Navbar
		class="fixed top-0 right-0 left-0 z-50 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
	>
		<div class="flex items-center gap-4">
			<!-- Add aria-label for accessibility -->
			<Button
				class="lg:inline-flex"
				color="light"
				size="sm"
				onclick={toggleSidebarCollapse}
				aria-label="Toggle sidebar"
			>
				<BarsOutline class="h-5 w-5" />
			</Button>
			<NavBrand href="/admin">
				<!-- Ensure text color adapts to dark mode -->
				<span
					class="text-primary-700 dark:text-primary-500 self-center text-xl font-semibold whitespace-nowrap"
					>Admin Panel</span
				>
			</NavBrand>
		</div>
		<div class="flex items-center gap-4">
			<DarkMode />
			<Avatar class="cursor-pointer" id="avatar-menu" alt="User settings"
				>{user().username[0]}</Avatar
			>
			<Dropdown triggeredBy="#avatar-menu" class="z-50">
				<DropdownHeader>
					<span class="block text-sm">Admin User</span>
					<span class="block truncate text-sm font-medium">{user().username}</span>
				</DropdownHeader>
				<!-- <DropdownItem href="/admin/profile">Profile</DropdownItem>
				<DropdownItem href="/admin/settings">Settings</DropdownItem> -->
				<DropdownDivider />
				<form method="post" action="/admin?/logout" use:enhance>
					<DropdownItem class="cursor-pointer">
						<button class="cursor-pointer" type="submit">Sign Out</button>
					</DropdownItem>
				</form>
			</Dropdown>
		</div>
	</Navbar>

	<!-- Main Content -->
	<main
		class="min-h-screen p-4 pt-20 transition-all duration-300 {isSidebarCollapsed
			? 'lg:ml-0'
			: 'lg:ml-64'}"
	>
		<!-- Add dark mode background and border classes to the content wrapper -->
		<div
			class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
		>
			{@render children()}
		</div>
	</main>
</div>

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
		DropdownGroup,
		Button,
		Card
	} from 'flowbite-svelte';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import {
		GlobeOutline,
		UserOutline,
		CogOutline,
		BarsOutline,
		UsersGroupOutline,
		ApiKeyOutline,
		CalendarPlusOutline,
		MessageDotsOutline
	} from 'flowbite-svelte-icons';
	import { hasPermission } from '$lib/utils/permissions.js';

	let { data, children } = $props();

	// State variables
	let isOpen = $state(true);
	let isSidebarCollapsed = $state(false);

	// Get context data
	import { getContext } from 'svelte';
	const user = getContext('user');

	// Sidebar items configuration
	const sidebarItems = [
		{ href: '/admin/domain', permission: 'root', label: 'Domains', icon: GlobeOutline },
		{ href: '/admin/user', permission: 'user/index', label: 'Users', icon: UserOutline },
		{ href: '/admin/role', permission: 'role/index', label: 'Roles', icon: UsersGroupOutline },
		{
			href: '/admin/follower',
			permission: 'follower/index',
			label: 'Followers',
			icon: UsersGroupOutline
		},
		{ href: '/admin/event', permission: 'event/index', label: 'Events', icon: CalendarPlusOutline },
		{ href: '/admin/chat-template', permission: 'chat-template/index', label: 'Chat Templates', icon: MessageDotsOutline },
		{ href: '/admin/permission', permission: 'root', label: 'Permissions', icon: ApiKeyOutline }
		// {
		// 	href: '/admin',
		// 	label: 'Dashboard',
		// 	icon: ChartPieOutline,
		// 	child: [{ href: '/admin/child', label: 'Test' }]
		// },
		// { href: '/admin/settings', label: 'Settings', icon: CogOutline } // Updated Settings icon
	];

	// Create a derived state for activeUrl that updates when page changes
	const activeUrl = $derived(getCurrentActiveUrl());

	/**
	 * Determines the current active URL based on the page pathname
	 * @returns {string} The active URL for sidebar highlighting
	 */
	function getCurrentActiveUrl() {
		const pathname = $page.url.pathname;

		// Find matching sidebar item
		for (const item of sidebarItems) {
			if (pathname.startsWith(item.href)) {
				return item.href;
			}
		}

		// Default to current pathname if no match found
		return pathname;
	}

	/**
	 * Toggles the collapsed state of the sidebar.
	 * Also ensures the mobile overlay is closed if open.
	 */
	function toggleSidebarCollapse() {
		isSidebarCollapsed = !isSidebarCollapsed;
		isOpen = !isOpen;
	}

	const activeClass =
		'flex items-center p-2 text-base font-normal text-white bg-primary-600 dark:bg-primary-700 rounded-lg dark:text-white hover:bg-primary-800 dark:hover:bg-primary-800';
</script>

<!-- Add dark mode background class to the main container -->
<div class="relative min-h-screen bg-gray-50 dark:bg-gray-900">
	<!-- Sidebar -->
	<Sidebar
		class="fixed pt-16 z-50 h-full bg-gray-50 {isOpen
			? 'w-64 translate-x-0 opacity-100'
			: 'w-0 -translate-x-full opacity-0'}"
		{isOpen}
		backdrop={true}
		backdropClass="hidden"
		{activeUrl}
		{activeClass}
	>
		<!-- Add dark mode background class to the sidebar wrapper -->
		<SidebarWrapper>
			<SidebarGroup>
				{#each sidebarItems as item}
					{#if hasPermission(user(), item.permission)}
						{#if item.child}
							<SidebarDropdownWrapper label={item.label}>
								{#snippet icon()}
									{#if item.icon}{@const Icon = item.icon}<Icon class="h-5 w-5" />{/if}
								{/snippet}
								{#each item.child as child}
									{#if hasPermission(user(), child.permission)}
										<SidebarDropdownItem href={child.href} label={child.label}
										></SidebarDropdownItem>
									{/if}
								{/each}
							</SidebarDropdownWrapper>
						{:else}
							<SidebarItem href={item.href} label={item.label}>
								{#snippet icon()}
									{#if item.icon}{@const Icon = item.icon}<Icon class="h-5 w-5" />{/if}
								{/snippet}
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
				class="cursor-pointer lg:inline-flex"
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
					<span class="block text-sm text-gray-900 dark:text-white">Admin User</span>
					<span class="block truncate text-sm font-medium">{user().username}</span>
				</DropdownHeader>
				<DropdownGroup>
					<form method="post" action="/admin?/logout" use:enhance>
						<DropdownItem class="cursor-pointer">
							<button class="cursor-pointer" type="submit">Sign Out</button>
						</DropdownItem>
					</form>
				</DropdownGroup>
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
		<Card size="xl" shadow="normal" class="p-4">
			{@render children()}
		</Card>
	</main>
</div>

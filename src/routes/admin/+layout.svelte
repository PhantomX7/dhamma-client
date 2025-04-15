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
		// ChartPieOutline,
		UserOutline,
		CogOutline,
		BarsOutline
	} from 'flowbite-svelte-icons';

	let { data, children } = $props();

	// State variables
	let isOpen = $state(false);
	let isSidebarCollapsed = $state(false);

	// Get context data
	import { getContext } from 'svelte';
	const user = getContext('user');

	// Sidebar items configuration
	const sidebarItems = [
		{ href: '/admin/domain', label: 'Domains', icon: GlobeOutline },
		{ href: '/admin/user', label: 'Users', icon: UserOutline },
		{ href: '/admin/permission', label: 'Permissions', icon: CogOutline },
		// {
		// 	href: '/admin',
		// 	label: 'Dashboard',
		// 	icon: ChartPieOutline,
		// 	child: [{ href: '/admin/child', label: 'Test' }]
		// },
		{ href: '/admin/settings', label: 'Settings', icon: CogOutline }
	];

	// Toggle sidebar for mobile view
	function toggleSidebar() {
		isOpen = !isOpen;
	}

	// Toggle sidebar collapse state
	function toggleSidebarCollapse() {
		isSidebarCollapsed = !isSidebarCollapsed;
		if (isOpen) isOpen = false;
	}
</script>

<div class="min-h-screen bg-gray-50">
	<!-- Sidebar -->
	<Sidebar
		class="fixed top-0 left-0 z-40 h-screen border-r border-gray-200 pt-14 transition-transform duration-300 {isSidebarCollapsed
			? 'w-0 -translate-x-full opacity-0'
			: 'w-64 translate-x-0 opacity-100'}"
		activeUrl={sidebarItems.find(item => $page.url.pathname.startsWith(item.href))?.href || $page.url.pathname}
	>
		<SidebarWrapper divClass="h-full overflow-y-auto bg-white px-3 py-4">
			<SidebarGroup>
				{#each sidebarItems as item}
					{#if item.child}
						<SidebarDropdownWrapper label={isSidebarCollapsed ? '' : item.label}>
							<svelte:fragment slot="icon">
								{#if item.icon}{@const Icon = item.icon}<Icon
										class="{isSidebarCollapsed ? 'mx-auto' : 'mr-5'} h-5 w-5"
									/>{/if}
							</svelte:fragment>
							{#each item.child as child}
								<SidebarDropdownItem href={child.href} label={isSidebarCollapsed ? '' : child.label}
								></SidebarDropdownItem>
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
				{/each}
			</SidebarGroup>
		</SidebarWrapper>
	</Sidebar>

	<!-- Header -->
	<Navbar class="fixed top-0 right-0 left-0 z-50 border-b border-gray-200 bg-white">
		<div class="flex items-center gap-4">
			<Button class="lg:inline-flex" color="light" size="sm" on:click={toggleSidebarCollapse}>
				<BarsOutline class="h-5 w-5" />
			</Button>
			<NavBrand href="/admin">
				<span class="text-primary-700 self-center text-xl font-semibold whitespace-nowrap"
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
		<div class="rounded-lg border-gray-200 bg-white p-4 shadow-sm">
			{@render children()}
		</div>
	</main>
</div>

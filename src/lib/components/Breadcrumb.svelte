<script>
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';
	import { HomeSolid } from 'flowbite-svelte-icons';

	export let items = [];
</script>

<Breadcrumb class="mb-4">
	<BreadcrumbItem href="/admin">
		<svelte:fragment slot="icon">
			<HomeSolid class="mr-2 h-3 w-3" />
		</svelte:fragment>
		Dashboard
	</BreadcrumbItem>

	{#each items as item}
		<BreadcrumbItem href={item.href}>
			{item.label}
		</BreadcrumbItem>
	{/each}
</Breadcrumb>

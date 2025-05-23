<script>
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';
	import { HomeOutline } from 'flowbite-svelte-icons';

	export let items = [];
</script>

<Breadcrumb class="mb-4">
	<BreadcrumbItem home href="/admin">
		Dashboard
	</BreadcrumbItem>

	{#each items as item}
		<BreadcrumbItem href={item.href}>
			{item.label}
		</BreadcrumbItem>
	{/each}
</Breadcrumb>
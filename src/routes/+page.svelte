<script>
	import { getContext, onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Input, Label, Helper } from 'flowbite-svelte';
	let { data } = $props();

	onMount(() => {
		// Check if user is authenticated 
		if (data.isAuthenticated) {
			goto('/admin');
		}
	});
</script>
<script>
	import '../app.css';
	import { setContext } from 'svelte';
	let { data, children } = $props();

	setContext('domain', () => data.tenant);
</script>

{@render children()}

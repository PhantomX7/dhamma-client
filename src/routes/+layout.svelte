<script>
	import '../app.css';
	import { setContext } from 'svelte';
	let { data, children } = $props();

	setContext('domain', () => data.tenant);
	setContext('user', () => data.user);
</script>


{@render children()}

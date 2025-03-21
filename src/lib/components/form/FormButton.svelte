<script>
	import { Button } from 'flowbite-svelte';

	let { type = 'submit', loading = false, loadingText = 'Loading...', text = 'Submit' } = $props();
</script>

<Button
	{type}
	class="w-full rounded-lg bg-primary-600 py-2.5 font-medium text-white transition-colors hover:bg-primary-700"
	disabled={loading}
>
	{loading ? loadingText : text}
</Button>
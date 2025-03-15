<script>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    onMount(() => {
        goto('/admin');
    });
</script>

<div class="flex h-screen items-center justify-center">
    <p class="text-gray-600">Redirecting...</p>
</div>
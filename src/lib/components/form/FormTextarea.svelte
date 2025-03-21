<script>
    import { Textarea, Label } from 'flowbite-svelte';

    let { 
        id = '', 
        label = '', 
        name = '', 
        value = $bindable(''), 
        rows = 4,
        placeholder = '', 
        error = '' 
    } = $props();
</script>

<div>
    <Label for={id} class="text-sm font-medium text-gray-700">{label}</Label>
    <Textarea
        {id}
        {name}
        {rows}
        bind:value
        {placeholder}
        class="mt-1 block w-full rounded-lg focus:border-primary-500 focus:ring-primary-500"
        color={error ? 'red' : undefined}
    />
    {#if error}
        <p class="mt-2 text-sm text-red-600">{error}</p>
    {/if}
</div>
<script>
    import { Table, TableBody, TableHead } from 'flowbite-svelte';
    import DataFilter from './DataFilter.svelte';
    import Pagination from './Pagination.svelte';
    import { generatePaginationURL } from '$lib/utils/pagination';
    import { goto } from '$app/navigation';


    let { data, meta, filterConfig = {}, children } = $props();

    function handleFilterChange(event) {
        goto(
            generatePaginationURL({
                page: 1,
                meta,
                filters: event.detail
            }),
            { keepFocus: true }
        );
    }

    function handlePageChange(event) {
        goto(
            generatePaginationURL({
                page: event.detail,
                meta,
                filters: {}
            }),
            { keepFocus: true }
        );
    }
</script>

<div class="space-y-4">
    {#if Object.keys(filterConfig).length > 0}
        <DataFilter {filterConfig} on:filterChange={handleFilterChange} />
    {/if}

    {@render children?.()}

    {#if meta}
        <div class="mt-4">
            <Pagination
                total={meta.total}
                limit={meta.limit}
                offset={meta.offset}
                on:pageChange={handlePageChange}
            />
        </div>
    {/if}
</div>
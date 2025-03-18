<script>
    import { Table, TableBody, TableHead } from 'flowbite-svelte';
    import DataFilter from './DataFilter.svelte';
    import Pagination from './Pagination.svelte';
    import { generatePaginationURL, getPaginationInfo } from '$lib/utils/pagination';
    import { goto } from '$app/navigation';

    let { data, meta, filterConfig = {}, children } = $props();
    
    const paginationInfo = $derived(getPaginationInfo(meta));

    function handleFilterChange(event) {
        goto(
            generatePaginationURL({
                page: 1,
                meta,
                filters: event
            }),
            { keepFocus: true }
        );
    }

    function handlePageChange(event) {
        goto(
            generatePaginationURL({
                page: event,
                meta,
                filters: {}
            }),
            { keepFocus: true }
        );
    }
</script>

<div class="space-y-4">
    {#if Object.keys(filterConfig).length > 0}
        <DataFilter {filterConfig} onFilterChange={handleFilterChange} />
    {/if}

    {@render children?.()}

    {#if meta}
        <div class="flex items-center justify-between mt-4">
            <div class="text-sm text-gray-700 dark:text-gray-400">
                Showing <span class="font-semibold text-gray-900 dark:text-white">{paginationInfo.start}</span>
                to
                <span class="font-semibold text-gray-900 dark:text-white">{paginationInfo.end}</span>
                of
                <span class="font-semibold text-gray-900 dark:text-white">{paginationInfo.total}</span>
                Entries
            </div>
            
            <Pagination
                total={meta.total}
                limit={meta.limit}
                offset={meta.offset}
                onPageChange={handlePageChange}
            />
        </div>
    {/if}
</div>
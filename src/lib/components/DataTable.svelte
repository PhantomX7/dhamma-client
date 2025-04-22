<script>
    import { Select } from 'flowbite-svelte';
    import DataFilter from './DataFilter.svelte';
    import Pagination from './Pagination.svelte';
    import { generatePaginationURL, getPaginationInfo } from '$lib/utils/pagination';
    import { goto } from '$app/navigation';

    let { data, meta, filterConfig = {}, children } = $props();
    
    const paginationInfo = $derived(getPaginationInfo(meta));
    const limitOptions = [10, 20, 50, 100];

    function handleLimitChange(event) {
        goto(
            generatePaginationURL({
                page: 1,
                meta: { ...meta, limit: parseInt(event.target.value) },
                filters: {}
            }),
            { keepFocus: true }
        );
    }

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
            <div class="flex items-center gap-4">
                <div class="text-sm text-gray-700 dark:text-gray-400">
                    Showing <span class="font-semibold text-gray-900 dark:text-white">{paginationInfo.start}</span>
                    to
                    <span class="font-semibold text-gray-900 dark:text-white">{paginationInfo.end}</span>
                    of
                    <span class="font-semibold text-gray-900 dark:text-white">{paginationInfo.total}</span>
                    Entries
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-sm text-gray-700 dark:text-gray-400">Show</span>
                    <Select 
                        class="w-20"
                        value={meta.limit}
                        on:change={handleLimitChange}
                    >
                        {#each limitOptions as limit}
                            <option value={limit}>{limit}</option>
                        {/each}
                    </Select>
                    <span class="text-sm text-gray-700 dark:text-gray-400">entries</span>
                </div>
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
<script>
    import { createEventDispatcher } from 'svelte';
    import { generatePaginationItems, ELLIPSIS, PREVIOUS_PAGE, NEXT_PAGE } from '$lib/utils/pagination';

    const dispatch = createEventDispatcher();
    
    let { total, limit, offset, maxVisible = 7 } = $props();

    const paginationItems = $derived(generatePaginationItems({
        total,
        limit,
        offset,
        maxVisible,
        showStepOptions: true
    }));

    const currentPage = $derived(Math.floor(offset / limit) + 1);
    const totalPages = $derived(Math.ceil(total / limit));

    function handlePageClick(page) {
        if (page.type === 'symbol') {
            if (page.symbol === ELLIPSIS) return;
            
            if (page.symbol === NEXT_PAGE) {
                dispatch('pageChange', Math.min(currentPage + 1, totalPages));
                return;
            }
            
            if (page.symbol === PREVIOUS_PAGE) {
                dispatch('pageChange', Math.max(currentPage - 1, 1));
                return;
            }
        }
        dispatch('pageChange', page.value);
    }
</script>

<div class="px-4 py-3 flex items-center justify-center sm:px-6">
    <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
        {#each paginationItems as page}
            {@const isActive = page.type === 'number' && page.value === currentPage}
            {@const isDisabled = (page.type === 'symbol' && 
                ((page.symbol === NEXT_PAGE && currentPage >= totalPages) || 
                (page.symbol === PREVIOUS_PAGE && currentPage <= 1) ||
                page.symbol === ELLIPSIS))}

            <button
                class="relative inline-flex items-center px-3 py-2 border text-sm font-medium
                    {page.symbol === PREVIOUS_PAGE ? 'rounded-l-md' : ''}
                    {page.symbol === NEXT_PAGE ? 'rounded-r-md' : ''}
                    {isActive ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : 
                    'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}
                    {isDisabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-indigo-50 hover:text-indigo-600'}"
                disabled={isDisabled}
                onclick={() => handlePageClick(page)}
            >
                {#if page.type === 'symbol'}
                    {#if page.symbol === PREVIOUS_PAGE}
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                    {:else if page.symbol === NEXT_PAGE}
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                        </svg>
                    {:else}
                        ...
                    {/if}
                {:else}
                    {page.value}
                {/if}
            </button>
        {/each}
    </nav>
</div>

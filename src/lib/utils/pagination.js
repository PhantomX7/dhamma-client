export function getPaginationParams(url) {
    const searchParams = new URL(url).searchParams;
    return {
        limit: parseInt(searchParams.get('limit')) || 10,
        offset: parseInt(searchParams.get('offset')) || 0,
        sort: searchParams.get('sort') || 'created_at desc'
    };
}

export function buildQueryString(params) {
    const searchParams = new URLSearchParams();
    if (params.limit) searchParams.set('limit', params.limit);
    if (params.offset) searchParams.set('offset', params.offset);
    if (params.sort) searchParams.set('sort', params.sort);
    return searchParams.toString();
}

export const PREVIOUS_PAGE = 'PREV';
export const NEXT_PAGE = 'NEXT';
export const ELLIPSIS = 'ELLIPSIS';

export function generatePaginationItems({ total, limit, offset, maxVisible = 7 }) {
    const currentPage = Math.max(Math.floor(offset / limit) + 1, 1);
    const totalPages = Math.max(Math.ceil(total / limit), 1);
    const boundarySize = 1;
    const sideSize = Math.floor((maxVisible - 2 * boundarySize - 1) / 2);
    
    let pages = [];

    // Add previous page button
    pages.push({ type: 'symbol', symbol: PREVIOUS_PAGE });

    // Always show first page
    pages.push({ type: 'number', value: 1 });

    const leftBoundary = Math.max(2, Math.min(currentPage - sideSize, totalPages - maxVisible + 2));
    const rightBoundary = Math.min(totalPages - 1, Math.max(leftBoundary + maxVisible - 3, currentPage + sideSize));

    // Add ellipsis if needed
    if (leftBoundary > 2) {
        pages.push({ type: 'symbol', symbol: ELLIPSIS });
    }

    // Add middle pages
    for (let i = leftBoundary; i <= rightBoundary && i <= totalPages; i++) {
        if (i > 1 && i < totalPages) {
            pages.push({ type: 'number', value: i });
        }
    }

    // Add ellipsis if needed
    if (rightBoundary < totalPages - 1) {
        pages.push({ type: 'symbol', symbol: ELLIPSIS });
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
        pages.push({ type: 'number', value: totalPages });
    }

    // Add next page button
    pages.push({ type: 'symbol', symbol: NEXT_PAGE });

    return pages;
}
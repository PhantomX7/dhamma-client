import { getPaginationParams } from '$lib/utils/pagination';

export const FilterType = {
    ID: 'ID',
    NUMBER: 'NUMBER',
    STRING: 'STRING',
    BOOL: 'BOOL',
    DATE: 'DATE',
    DATETIME: 'DATETIME',
    ENUM: 'ENUM'
};

export const FilterOperator = {
    EQUALS: 'eq',
    NOT_EQUALS: 'neq',
    IN: 'in',
    NOT_IN: 'not_in',
    LIKE: 'like',
    BETWEEN: 'between',
    GT: 'gt',
    GTE: 'gte',
    LT: 'lt',
    LTE: 'lte'
};



export function parseFilters(searchParams) {
    const filters = {};
    for (const [key, value] of searchParams.entries()) {
        if (key !== 'limit' && key !== 'offset' && key !== 'sort') {
            const [operator, filterValue] = value.split(':');
            filters[key] = { operator, value: filterValue };
        }
    }
    return filters;
}

export function buildApiQuery(url) {
    const pagination = getPaginationParams(url);
    let { limit, offset, sort} = pagination;

    const searchParams = new URL(url).searchParams;
    const filters = parseFilters(searchParams);
    
    const params = new URLSearchParams();
    params.set('limit', limit);
    params.set('offset', offset);
    params.set('sort', sort);

    Object.entries(filters).forEach(([field, filter]) => {
        if (filter.value && filter.operator) {
            params.append(field, `${filter.operator}:${filter.value}`);
        }
    });

    return params.toString();
}
import { buildQueryString } from '$lib/utils/pagination';

export function handlePaginationNavigation({ page, meta, baseUrl = '', extraParams = {} }) {
	const offset = (page - 1) * meta.limit;
	const params = {
		limit: meta.limit,
		offset,
		sort: 'created_at desc',
		...extraParams
	};

	return `${baseUrl}?${buildQueryString(params)}`;
}

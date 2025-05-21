// import { onDestroy } from 'svelte';
// import queryString from 'query-string';


export function formatDate(dateString) {
	return new Date(dateString).toLocaleDateString();
}

/**
 * Formats a date string to include both date and time
 * @param {string|Date} dateString - The date string or Date object to format
 * @param {object} options - Optional formatting options
 * @param {boolean} [options.includeSeconds=false] - Whether to include seconds in the time
 * @param {string} [options.locale] - Locale to use for formatting (defaults to browser locale)
 * @returns {string} Formatted date and time string
 */
export function formatDateTime(dateString, options = {}) {
	const date = dateString instanceof Date ? dateString : new Date(dateString);
	const { includeSeconds = false, locale } = options;
	
	// Date formatting options
	const dateOptions = {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	};
	
	// Add seconds if requested
	if (includeSeconds) {
		dateOptions.second = '2-digit';
	}
	
	return date.toLocaleString(locale, dateOptions);
}

export const runPromise = async (promise) => {
	try {
		const res = await promise;
		return [res, null];
	} catch (error) {
		return [undefined, error];
	}
};

/** Dispatch event on click outside of node */
export const clickOutside = (node) => {
	const handleClick = (event) => {
		if (node && !node.contains(event.target) && !event.defaultPrevented) {
			node.dispatchEvent(new CustomEvent('click_outside', node));
		}
	};

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
};

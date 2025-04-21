// import { onDestroy } from 'svelte';
// import queryString from 'query-string';
/**
 * Loads a resource by its ID from the API.
 * Handles common error scenarios like resource not found and redirects.
 *
 * @param {object} event - The SvelteKit load event object.
 * @param {string} resourcePath - The base API path for the resource (e.g., '/user').
 * @param {string} resourceName - The singular name of the resource (e.g., 'User').
 * @param {string} redirectPath - The path to redirect to on failure (e.g., '/admin/user').
 * @returns {Promise<object>} - A promise that resolves to an object containing the fetched resource data under a key named after the resource (e.g., { user: data }).
 * @throws {Redirect} - Throws a redirect if the resource is not found or an error occurs.
 */
export async function loadResourceById(event, resourcePath, resourceName, redirectPath) {
	const { params, cookies } = event;
	const api = await import('$lib/api').then(m => m.default);
	const { redirect, setFlash } = await import('sveltekit-flash-message/server');

	const [response, fetchError] = await runPromise(
		api.fetch(`${resourcePath}/${params.id}`, {}, event)
	);

	if (fetchError || !response?.ok) {
		setFlash({ type: 'error', message: `${resourceName} not found` }, cookies);
		throw redirect(303, redirectPath);
	}

	return {
		[resourceName.toLowerCase()]: response.data.data
	};
}

export function formatDate(dateString) {
	return new Date(dateString).toLocaleDateString();
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



// export function generateIndexUrl(path, query = {}) {
// 	let page = query.page || 1;
// 	let limit = query.limit || 20;

// 	delete query.page;
// 	delete query.limit;
// 	delete query.offset;

// 	const offset = (page - 1) * limit;
// 	const queryStringPart = Object.keys(query).length > 0 ? `&${queryString.stringify(query)}` : '';

// 	return `${path}?limit=${limit}&offset=${offset}${queryStringPart}`;
// }

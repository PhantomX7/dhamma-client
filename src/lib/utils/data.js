import { buildApiQuery } from './filter';
import { runPromise } from './index';
import { error } from '@sveltejs/kit';
import api from '$lib/api';
import { redirect, setFlash } from 'sveltekit-flash-message/server';

/**
 * Loads a list of resources from the API, handling filtering, pagination, and errors.
 * @param {import('@sveltejs/kit').RequestEvent} event - The SvelteKit request event.
 * @param {string} resourcePath - The base API path for the resource (e.g., 'domain', 'user').
 * @param {string} resourceNamePlural - The plural name of the resource for error messages (e.g., 'Domains', 'Users').
 * @param {string} errorRedirectPath - The path to redirect to on critical errors (e.g., '/admin').
 * @returns {Promise<{list: Array<any>, meta: object|null}>} - An object containing the list of resources and metadata.
 */
export async function loadResourceList(
	event,
	resourcePath,
	resourceNamePlural,
	errorRedirectPath = '/admin'
) {
	const { url } = event;
	const apiUrl = `${resourcePath}?${buildApiQuery(url)}`;

	const [response, fetchError] = await runPromise(api.fetch(apiUrl, {}, event));

	if (fetchError) {
		console.error(`${resourceNamePlural} list fetch error:`, fetchError);
		// Use SvelteKit's error helper for server/network issues
		error(500, {
			message: `Failed to load ${resourceNamePlural.toLowerCase()} due to a server issue.`
		});
	}

	if (!response.ok) {
		// Use SvelteKit's error helper for API errors
		const errorData = await response.json().catch(() => ({ message: 'Unknown API error' }));
		console.error(
			`API error fetching ${resourceNamePlural.toLowerCase()}:`,
			response.status,
			errorData.message
		);
		// Redirect for common errors like unauthorized, otherwise show specific error
		if (response.status === 401 || response.status === 403) {
			throw redirect(303, errorRedirectPath);
		}
		error(response.status, {
			message: `Failed to load ${resourceNamePlural.toLowerCase()}: ${errorData.message || response.statusText}`
		});
	}

	// Ensure data structure is as expected
	if (!response.data || !Array.isArray(response.data.data)) {
		console.error(
			`Unexpected API response structure for ${resourceNamePlural.toLowerCase()}:`,
			response.data
		);
		error(500, {
			message: `Received invalid data structure while loading ${resourceNamePlural.toLowerCase()}.`
		});
	}

	return {
		list: response.data.data,
		meta: response.data.meta || null
	};
}

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

	const [response, fetchError] = await runPromise(
		api.fetch(`${resourcePath}/${params.id}`, {}, event)
	);

	if (fetchError || !response?.ok) {
		console.error(`${resourceName} fetch error:`, fetchError);
		setFlash({ type: 'error', message: `${resourceName} not found` }, cookies);
		throw redirect(303, redirectPath);
	}

	return {
		[resourceName.toLowerCase()]: response.data.data
	};
}

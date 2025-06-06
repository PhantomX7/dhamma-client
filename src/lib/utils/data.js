import { fail } from '@sveltejs/kit';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';

import api from '$lib/api';
import { buildApiQuery } from '$lib/utils/filter';
import { runPromise } from '$lib/utils/index';
import { getChangedFields, setErrors } from '$lib/utils/form';

/**
 * Loads a list of resources from the API, handling filtering, pagination, and errors.
 * @param {import('@sveltejs/kit').RequestEvent} event - The SvelteKit request event.
 * @param {string} resourcePath - The base API path for the resource (e.g., 'domain', 'user').
 * @param {string} resourceNamePlural - The plural name of the resource for error messages (e.g., 'Domains', 'Users').
 * @param {string} errorRedirectPath - The path to redirect to on critical errors (e.g., '/admin').
 * @param {string|null} [filter=''] - Optional query string for additional filtering (e.g., 'status=active&type=admin').
 * @returns {Promise<{list: Array<any>, meta: object|null}>} - An object containing the list of resources and metadata.
 */
export async function loadResourceList(
	event,
	resourcePath,
	resourceNamePlural,
	errorRedirectPath = '/admin',
	filter = ''
) {
	const { url } = event;
	const apiUrl = `${resourcePath}?${filter ? filter + '&' : ''}${buildApiQuery(url)}`;

	const [response, fetchError] = await runPromise(api.fetch(apiUrl, {}, event));

	if (fetchError) {
		console.error(`${resourceNamePlural} list fetch error:`, fetchError);
		throw redirect(303, errorRedirectPath);
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
		[resourceName]: response.data.data
	};
}

/**
 * Handles updating a resource by its ID via the API.
 * Validates the form, checks for changes, sends a PATCH request, handles errors, and sets flash messages.
 *
 * @param {import('@sveltejs/kit').RequestEvent} event - The SvelteKit request event.
 * @param {string} resourcePath - The base API path for the resource (e.g., 'domain', 'role').
 * @param {string} resourceName - The singular name of the resource (e.g., 'Domain', 'Role').
 * @param {import('zod').ZodSchema} schema - The Zod schema for validation.
 * @param {string} successRedirectPath - The base path to redirect to on successful update (ID will be appended).
 * @returns {Promise<import('@sveltejs/kit').ActionResult>} - The result of the action (fail or redirect).
 */
export async function updateResourceById(
	event,
	resourcePath,
	resourceName,
	schema,
	successRedirectPath
) {
	const { request, params, cookies } = event;

	// Validate the form
	const form = await superValidate(request, zod(schema), { dataType: 'json' });
	if (!form.valid) {
		setFlash(
			{ type: 'error', message: `${resourceName} validation failed. Please check the errors.` },
			cookies
		);
		return fail(400, { form });
	}

	// Parse original data and get current form data
	const originalData = JSON.parse(form.data._original || '{}');
	const formData = { ...form.data }; // Clone form data
	delete formData._original; // Remove internal field before sending

	// Check for changes
	const changes = getChangedFields(originalData, formData);
	if (Object.keys(changes).length === 0) {
		setFlash(
			{ type: 'info', message: `No changes detected for this ${resourceName.toLowerCase()}.` },
			cookies
		);
		// Return form state without making API call, prevents unnecessary requests
		return { form };
	}

	// Send only changed fields via PATCH request
	const [response, fetchError] = await runPromise(
		api.patch(`${resourcePath}/${params.id}`, changes, event)
	);

	// Handle fetch errors (network issues, etc.)
	if (fetchError) {
		console.error(`Failed to update ${resourceName.toLowerCase()}:`, fetchError);
		setFlash(
			{
				type: 'error',
				message: `An unexpected error occurred while updating the ${resourceName.toLowerCase()}.`
			},
			cookies
		);
		return fail(500, { form });
	}

	// Handle API response errors (validation, server errors)
	const responseData = response.data;
	if (!response.ok || !responseData || !responseData.status) {
		const message = responseData?.message || `Failed to update ${resourceName.toLowerCase()}`;
		if (response.status != 422) {
			console.error(
				`API error updating ${resourceName.toLowerCase()}:`,
				response.status,
				message,
				responseData?.error
			);
		}
		if (responseData?.error) {
			setErrors(form, responseData.error); // Populate form errors if available
		}
		setFlash({ type: 'error', message: `${message}. Please check your data.` }, cookies);
		// Return 422 for validation errors, 500 for others
		return fail(response.status === 422 ? 422 : 500, { form });
	}

	// Success: Set flash message and redirect
	setFlash({ type: 'success', message: `${resourceName} updated successfully!` }, cookies);
	throw redirect(303, `${successRedirectPath}/${params.id}`);
}

/**
 * Handles creating a new resource via the API.
 * Validates the form, sends a POST request, handles errors, sets flash messages, and redirects.
 *
 * @param {import('@sveltejs/kit').RequestEvent} event - The SvelteKit request event.
 * @param {string} resourcePath - The base API path for the resource (e.g., 'domain', 'user').
 * @param {string} resourceName - The singular name of the resource (e.g., 'Domain', 'User').
 * @param {import('zod').ZodSchema} schema - The Zod schema for validation.
 * @param {string} successRedirectPath - The path to redirect to on successful creation (e.g., '/admin/user').
 * @param {string} [detailRedirectPathBase] - Optional base path to redirect to the detail page of the created resource (ID will be appended). If provided, takes precedence over successRedirectPath.
 * @returns {Promise<import('@sveltejs/kit').ActionResult>} - The result of the action (fail or redirect).
 */
export async function createResource(
	event,
	resourcePath,
	resourceName,
	schema,
	successRedirectPath,
	detailRedirectPathBase = null
) {
	const { request, cookies } = event;

	// Validate the form
	const form = await superValidate(request, zod(schema), { dataType: 'json' });
	if (!form.valid) {
		setFlash(
			{ type: 'error', message: `${resourceName} validation failed. Please check the errors.` },
			cookies
		);
		return fail(400, { form });
	}

	// Send POST request to create the resource
	const [response, fetchError] = await runPromise(api.post(resourcePath, form.data, event));

	// Handle fetch errors (network issues, etc.)
	if (fetchError) {
		console.error(`Failed to create ${resourceName.toLowerCase()}:`, fetchError);
		setFlash(
			{
				type: 'error',
				message: `An unexpected error occurred while creating the ${resourceName.toLowerCase()}.`
			},
			cookies
		);
		return fail(500, { form });
	}

	// Handle API response errors (validation, server errors)
	const responseData = response.data; // Assuming api.fetch wrapper provides parsed data
	if (!response.ok || !responseData || !responseData.status) {
		const message = responseData?.message || `Failed to create ${resourceName.toLowerCase()}`;
		if (response.status != 422) {
			console.error(
				`API error creating ${resourceName.toLowerCase()}:`,
				response.status,
				message,
				responseData?.error
			);
		}
		if (responseData?.error) {
			setErrors(form, responseData.error); // Populate form errors if available
		}
		setFlash({ type: 'error', message: `${message}. Please check your data.` }, cookies);
		// Return 422 for validation errors, 500 for others
		return fail(response.status === 422 ? 422 : 500, { form });
	}

	// Success: Set flash message and redirect
	setFlash({ type: 'success', message: `${resourceName} created successfully!` }, cookies);

	// Determine redirect target
	let redirectTarget = successRedirectPath;
	if (detailRedirectPathBase && responseData.data?.id) {
		redirectTarget = `${detailRedirectPathBase}/${responseData.data.id}`;
	}

	throw redirect(303, redirectTarget);
}

/**
 * Loads a list of data from the API.
 * @param {import('@sveltejs/kit').RequestEvent} event - The SvelteKit request event.
 * @param {string} resourcePath - The base API path for the resource (e.g., 'domain', 'user').
 * @returns {Promise<{list: Array<any>}>} - An object containing the list of resources.
 */
export async function loadData(event, resourcePath) {
	const [response, fetchError] = await runPromise(api.fetch(resourcePath, {}, event));

	if (fetchError) {
		console.error(`${resourcePath} list fetch error:`, fetchError);
		return [];
	}

	return response.data.data;
}

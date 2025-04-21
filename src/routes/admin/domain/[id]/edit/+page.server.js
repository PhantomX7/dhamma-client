import { fail } from '@sveltejs/kit';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';

import api from '$lib/api';
import { domainSchema } from '$lib/schema/domain';
import { getChangedFields, setErrors } from '$lib/utils/form';
import { runPromise } from '$lib/utils';
import { loadResourceById } from '$lib/utils/data';

/**
 * Loads the domain data for editing using a reusable utility function.
 * @param {import('./$types').PageServerLoadEvent} event - The SvelteKit load event.
 * @returns {Promise<object>} The domain data and the form object.
 */
export async function load(event) {
	await event.parent();

	// Use loadResourceById to fetch the domain
	const { domain } = await loadResourceById(event, 'domain', 'domain', '/admin/domain');

	// Initialize the form with the fetched domain data
	let form = await superValidate(domain, zod(domainSchema));
	// Store the original data for change detection in actions
	form.data._original = JSON.stringify(domain);

	return {
		domain, // Return the fetched domain data
		form // Return the initialized form
	};
}

export const actions = {
	default: async (event) => {
		const { request, params, cookies } = event;

		// Get the original domain data and current form data

		// console.log(f)
		const form = await superValidate(request, zod(domainSchema), { dataType: 'json' });
		if (!form.valid) {
			setFlash({ type: 'error', message: 'Validation failed' }, cookies);
			return fail(400, { form });
		}

		const originalData = JSON.parse(form.data._original || '{}');
		const formData = form.data;

		// Check if there are any changes
		const changes = getChangedFields(originalData, formData);

		// If no changes, inform the user and return
		if (Object.keys(changes).length === 0) {
			setFlash({ type: 'info', message: 'No changes detected.' }, cookies);
			return { form }; // Return form state without making API call
		}

		// Send only changed fields to API
		const [response, fetchError] = await runPromise(
			api.fetch(
				`/domain/${params.id}`,
				{
					method: 'PATCH',
					body: JSON.stringify(changes),
					headers: {
						'Content-Type': 'application/json'
					}
				},
				event
			)
		);

		if (fetchError) {
			console.error('Failed to update domain:', fetchError);
			setFlash({ type: 'error', message: 'An unexpected error occurred' }, cookies);
			return fail(500, { form });
		}

		if (!response.ok) {
			if (response.data?.error) {
				setErrors(form, response.data.error);
			}
			setFlash({ type: 'error', message: 'Please check your data.' }, cookies);
			return fail(422, { form });
		}

		const result = response.data;
		if (!result.status) {
			setErrors(form, result.error);
			setFlash({ type: 'error', message: 'Please check your data.' }, cookies);
			return fail(422, { form });
		}

		setFlash({ type: 'success', message: 'Domain Updated!' }, cookies);
		throw redirect(303, `/admin/domain/${params.id}`);
	}
};

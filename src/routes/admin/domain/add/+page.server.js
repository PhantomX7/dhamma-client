import { fail } from '@sveltejs/kit';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { domainSchema } from '$lib/schema/domain';
import { setErrors } from '$lib/utils/form';
import { runPromise } from '$lib/utils';
import api from '$lib/api';

export async function load(event) {
	await event.parent();

	// Initialize an empty form
	const form = await superValidate(zod(domainSchema));

	// Set default values
	form.data.is_active = true;

	return {
		form
	};
}

export const actions = {
	default: async (event) => {
		const { request, cookies } = event;
		const form = await superValidate(request, zod(domainSchema), { dataType: 'json' });
		if (!form.valid) {
			setFlash({ type: 'error', message: 'Validation failed' }, cookies);
			return fail(400, { form });
		}

		// Send form data to API
		const [response, fetchError] = await runPromise(
			api.fetch(
				'/domain',
				{
					method: 'POST',
					body: JSON.stringify(form.data),
					headers: {
						'Content-Type': 'application/json'
					}
				},
				event
			)
		);

		if (fetchError) {
			console.error('Failed to create domain:', fetchError);
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

		setFlash({ type: 'success', message: 'Domain Created Successfully!' }, cookies);
		throw redirect(303, `/admin/domain/${result.data.id}`);
	}
};

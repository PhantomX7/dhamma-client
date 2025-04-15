import { fail } from '@sveltejs/kit';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { domainSchema } from '$lib/schema/domain';
import { getChangedFields, setErrors } from '$lib/utils/form';
import { runPromise } from '$lib/utils';
import api from '$lib/api';

export async function load(event) {
	await event.parent();

	const { params, cookies } = event;
	const [response, fetchError] = await runPromise(api.fetch(`/domain/${params.id}`, {}, event));
	
	if (fetchError || !response.ok) {
		setFlash({ type: 'error', message: 'Domain not found' }, cookies);
		throw redirect(303, '/admin/domain');
	}
	
	const data = response.data.data;
	let form = await superValidate(data, zod(domainSchema));
	form.data._original = JSON.stringify(data);
	
	return {
		domain: data,
		form
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
			setFlash({ type: 'error', message: "Please check your data." }, cookies);
			return fail(422, { form });
		}

		const result = response.data;
		if (!result.status) {
			setErrors(form, result.error);
			setFlash({ type: 'error', message: "Please check your data." }, cookies);
			return fail(422, { form });
		}

		setFlash({ type: 'success', message: "Domain Updated!" }, cookies);
		throw redirect(303, `/admin/domain/${params.id}`);
	}
};

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
	const form = await superValidate(data, zod(domainSchema));
	
	return {
		domain: data,
		form
	};
}

export const actions = {
	default: async (event) => {
		const { request, params, cookies } = event;
		const formData = await request.formData();
		
		// Get the original domain data and current form data
		const originalData = JSON.parse(formData.get('_original') || '{}');
		
		const form = await superValidate(formData, zod(domainSchema));
		if (!form.valid) {
			setFlash({ type: 'error', message: 'Validation failed' }, cookies);
			return fail(400, { form });
		}
		
		// Check if there are any changes
		const changes = getChangedFields(originalData, formData);

		// Send only changed fields to API
		const [response, fetchError] = await runPromise(
			api.fetch(
				`/domain/${params.id}`,
				{
					method: 'PATCH',
					body: changes
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

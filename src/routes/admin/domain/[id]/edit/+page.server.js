import { fail } from '@sveltejs/kit';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { domainSchema } from '$lib/schema/domain';
import { getChangedFields, setErrors } from '$lib/utils/form';
import api from '$lib/api';

export async function load(event) {
	await event.parent();

	try {
		const { params } = event;
		const response = await api.fetch(`/domain/${params.id}`, {}, event);
		const { data } = await response.json();

		if (!response.ok) {
			// redirect(303, '/admin/domain');
		}

		const form = await superValidate(data, zod(domainSchema));
		return {
			domain: data,
			form
		};
	} catch (error) {
		console.error('Failed to fetch domain:', error);
		// throw redirect(303, '/admin/domain');
	}
}

export const actions = {
	default: async (event) => {
		const { request, params, cookies } = event;
		const formData = await request.formData();
		
		// Get the original domain data and current form data
		const originalData = JSON.parse(formData.get('_original') || '{}');
		
		const form = await superValidate(formData, zod(domainSchema));
		if (!form.valid) {
			return fail(400, { 
				form,
				message: 'Validation failed'
			});
		}
		
		// Get changed fields using the utility function
		const changes = getChangedFields(originalData, formData);

		try {
			// Send only changed fields to API
			const response = await api.fetch(
				`/domain/${params.id}`,
				{
					method: 'PATCH',
					body: changes
				},
				event
			);

			const { status, error } = await response.json();

			if (!status) {
				setErrors(form, error);
				setFlash({ type: 'error', message: "Please check your data." }, cookies);
				return fail(422, {
					form,
					message: error || 'Failed to update domain'
				});
			}

		} catch (error) {
			console.error('Failed to update domain:', error);
			return fail(500, {
				form,
				message: 'An unexpected error occurred'
			});
		}

		redirect(`/admin/domain/${params.id}`, { type: 'success', message: "Domain Updated!" }, cookies);

	}
};

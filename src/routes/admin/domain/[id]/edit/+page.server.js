import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { domainSchema } from '$lib/schema/domain';
import { z } from 'zod';
import api from '$lib/api';

export async function load(event) {
	await event.parent();

	try {
		const { params } = event;
		const response = await api.fetch(`/domain/${params.id}`, {}, event);
		const { data } = await response.json();

		if (!response.ok) {
			redirect(303, '/admin/domain');
			return;
		}

		const form = await superValidate(data, zod(domainSchema));
		return {
			domain: data,
			form
		};
	} catch (error) {
		console.error('Failed to fetch domain:', error);
		redirect(303, '/admin/domain');
	}
}

export const actions = {
	default: async (event) => {
		const { request, params } = event;
		const formData = await request.formData();

		console.log(formData);
		// Get only tainted fields from the form
		const taintedFields = Array.from(formData.keys());

		// If no fields were changed, return early
		if (taintedFields.length === 0) {
			return fail(400, {
				form: await superValidate(formData, zod(domainSchema)),
				message: 'No changes detected'
			});
		}

		// Create partial schema with only the tainted fields
		const partialSchema = z.object(
			taintedFields.reduce((acc, field) => {
				if (field in domainSchema.shape) {
					acc[field] = domainSchema.shape[field];
				}
				return acc;
			}, {})
		);

		// Validate only the changed fields
		const form = await superValidate(formData, zod(partialSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			// Send only changed fields to API
			const response = await api.fetch(
				`/domain/${params.id}`,
				{
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(Object.fromEntries(formData))
				},
				event
			);

			const { status, error } = await response.json();

			if (!status) {
				return fail(422, {
					form,
					message: error || 'Failed to update domain'
				});
			}

			redirect(`/admin/domain/${params.id}`);
		} catch (error) {
			console.error('Failed to update domain:', error);
			return fail(500, {
				form,
				message: 'An unexpected error occurred'
			});
		}
	}
};

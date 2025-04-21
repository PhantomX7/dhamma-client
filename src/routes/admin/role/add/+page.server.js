import { fail } from '@sveltejs/kit';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { createRoleSchema } from '$lib/schema/role'; // Use role schema
import { setErrors } from '$lib/utils/form';
import { runPromise } from '$lib/utils';
import api from '$lib/api';

export async function load(event) {
	await event.parent();

	// Initialize an empty form using the role schema
	const form = await superValidate(zod(createRoleSchema));

	// Set default values if needed (e.g., is_active)
	form.data.is_active = true;

	return {
		form
	};
}

export const actions = {
	default: async (event) => {
		const { request, cookies } = event;
		const form = await superValidate(request, zod(createRoleSchema), { dataType: 'json' });
		if (!form.valid) {
			setFlash({ type: 'error', message: 'Validation failed' }, cookies);
			return fail(400, { form });
		}

		// Send form data to API for role creation
		const [response, fetchError] = await runPromise(
			api.fetch(
				'/role', // Endpoint for roles
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
			console.error('Failed to create role:', fetchError);
			setFlash({ type: 'error', message: 'An unexpected error occurred' }, cookies);
			return fail(500, { form });
		}

        const responseData = await response.json().catch(() => ({ message: 'Failed to parse response' }));

		if (!response.ok) {
            console.error('API error creating role:', response.status, responseData.message);
			if (responseData?.error) {
				setErrors(form, responseData.error);
			}
			setFlash({ type: 'error', message: `Failed to create role: ${responseData.message || response.statusText}` }, cookies);
			return fail(response.status === 422 ? 422 : 500, { form }); // Use 422 for validation errors
		}

		if (!responseData.status) {
            console.error('API returned error status for role creation:', responseData.message);
			setErrors(form, responseData.error);
			setFlash({ type: 'error', message: `Failed to create role: ${responseData.message || 'Unknown API error'}` }, cookies);
			return fail(422, { form });
		}

		setFlash({ type: 'success', message: 'Role Created Successfully!' }, cookies);
		// Redirect to the role list page for now, as view/edit pages are not created yet
        // Once view page is ready, redirect to: `/admin/role/${responseData.data.id}`
		throw redirect(303, `/admin/role`);
	}
};
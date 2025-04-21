import { fail } from '@sveltejs/kit';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';

import { roleSchema } from '$lib/schema/role'; 
import { getChangedFields, setErrors } from '$lib/utils/form';
import { runPromise, loadResourceById } from '$lib/utils'; 
import api from '$lib/api';

/**
 * Loads the role data for editing using the loadResourceById utility.
 * @param {import('./$types').PageServerLoadEvent} event - The SvelteKit load event.
 * @returns {Promise<object>} The role data and the form object.
 */
export async function load(event) {
	await event.parent();

	// Use loadResourceById to fetch the role
	const { role } = await loadResourceById(event, 'role', 'role', '/admin/role');

	// Initialize the form with the fetched role data
	let form = await superValidate(role, zod(roleSchema)); 
	// Store the original data for change detection in actions
	form.data._original = JSON.stringify(role);

	return {
		role, 
		form 
	};
}

export const actions = {
	default: async (event) => {
		const { request, params, cookies } = event;

		const form = await superValidate(request, zod(roleSchema), { dataType: 'json' }); // Changed schema
		if (!form.valid) {
			setFlash({ type: 'error', message: 'Validation failed' }, cookies);
			return fail(400, { form });
		}
		
		const originalData = JSON.parse(form.data._original || '{}');
		const formData = { ...form.data }; // Clone form data
        delete formData._original; // Remove internal field before sending

		// Check if there are any changes
		const changes = getChangedFields(originalData, formData);

        if (Object.keys(changes).length === 0) {
            setFlash({ type: 'info', message: 'No changes detected.' }, cookies);
            // Optionally redirect back or just return the form state
            // throw redirect(303, `/admin/role/${params.id}`); 
            return { form }; // Return form state without making API call
        }

		// Send only changed fields to API
		const [response, fetchError] = await runPromise(
			api.fetch(
				`/role/${params.id}`, // Changed endpoint
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
			console.error('Failed to update role:', fetchError); // Changed log message
			setFlash({ type: 'error', message: 'An unexpected error occurred while updating the role' }, cookies);
			return fail(500, { form });
		}

        const responseData = await response.json().catch(() => null);

		if (!response.ok || !responseData || !responseData.status) {
            const message = responseData?.message || 'Failed to update role';
            console.error('API error updating role:', response.status, message);
			if (responseData?.error) {
				setErrors(form, responseData.error);
			}
			setFlash({ type: 'error', message: `Failed to update role: ${message}. Please check your data.` }, cookies);
			return fail(response.status === 422 ? 422 : 500, { form }); // Use 422 for validation errors
		}

		setFlash({ type: 'success', message: 'Role Updated Successfully!' }, cookies); // Changed success message
		throw redirect(303, `/admin/role/${params.id}`); // Changed redirect path
	}
};
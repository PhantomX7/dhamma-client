import api from '$lib/api';
import { fail } from '@sveltejs/kit';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { runPromise } from '$lib/utils';

export async function load(event) {
	await event.parent();

	const { params, cookies } = event;

	// Fetch user details
	const [userResponse, userFetchError] = await runPromise(
		api.fetch(`user/${params.id}`, {}, event)
	);

	if (userFetchError || !userResponse.ok) {
		setFlash({ type: 'error', message: 'User not found' }, cookies);
		throw redirect(303, '/admin/user');
	}

	return {
		user: userResponse.data.data
	};
}

// The server file needs an action to handle the form submission
export const actions = {
	addDomain: async (event) => {
		const { request, params, cookies } = event;

		// Extract the domain_id from the form submissio
		const formData = await request.formData();

		// Call your API to assign the domain
		const [response, fetchError] = await runPromise(
			api.fetch(
				`user/${params.id}/assign-domain`,
				{
					method: 'POST',

					body: formData
				},
				event
			)
		);

		if (fetchError || !response.ok) {
			console.error('Domain assignment failed:', fetchError);
			setFlash({ type: 'error', message: 'Failed to add domain to user' }, cookies);
			return fail(400, { error: 'Failed to add domain' });
		}

		setFlash({ type: 'success', message: 'Domain successfully added to user' }, cookies);

		return { success: true };
	}
};

import api from '$lib/api';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { runPromise } from '$lib/utils';

export async function load(event) {
	await event.parent();

	const { params, cookies } = event;
	const [response, fetchError] = await runPromise(api.fetch(`/user/${params.id}`, {}, event));
	
	if (fetchError || !response.ok) {
		setFlash({ type: 'error', message: 'User not found' }, cookies);
		throw redirect(303, '/admin/user');
	}

	return {
		user: response.data.data
	};
}

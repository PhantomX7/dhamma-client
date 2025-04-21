import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { runPromise } from '$lib/utils';
import api from '$lib/api';

export async function load(event) {
	await event.parent();

	const { params, cookies } = event;
	const [response, fetchError] = await runPromise(api.fetch(`/role/${params.id}`, {}, event));
	
	if (fetchError || !response.ok) {
		setFlash({ type: 'error', message: 'Domain not found' }, cookies);
		throw redirect(303, '/admin/domain');
	}

	return {
		role: response.data.data
	};
}
import api from '$lib/api';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { runPromise } from '$lib/utils';

export async function load(event) {
	await event.parent();

	const { params, cookies } = event;
	const [response, fetchError] = await runPromise(api.fetch(`/domain/${params.id}`, {}, event));
	
	if (fetchError || !response.ok) {
		setFlash({ type: 'error', message: 'Domain not found' }, cookies);
		throw redirect(303, '/admin/domain');
	}

	return {
		domain: response.data.data
	};
}

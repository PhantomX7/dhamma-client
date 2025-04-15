import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { buildApiQuery } from '$lib/utils/filter';
import { runPromise } from '$lib/utils';
import api from '$lib/api';

export async function load(event) {
	await event.parent();

	const { url, cookies } = event;
	const [response, fetchError] = await runPromise(
		api.fetch(`permission?${buildApiQuery(url)}`, {}, event)
	);

	if (fetchError) {
		console.error('Failed to fetch permissions:', fetchError);
		setFlash({ type: 'error', message: 'Failed to load permissions' }, cookies);
		throw redirect(303, '/admin');
	}

	if (!response.ok) {
		setFlash({ type: 'error', message: 'Failed to load permissions' }, cookies);
		throw redirect(303, '/admin');
	}

	return {
		permissions: response.data.data,
		meta: response.data.meta
	};
}

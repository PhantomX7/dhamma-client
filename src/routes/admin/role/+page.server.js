import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { buildApiQuery } from '$lib/utils/filter';
import { runPromise } from '$lib/utils';
import api from '$lib/api';

export async function load(event) {
	await event.parent();

	const { url, cookies } = event;
	const [response, fetchError] = await runPromise(
		api.fetch(`role?${buildApiQuery(url)}`, {}, event)
	);

	if (fetchError) {
		console.error('Failed to fetch roles:', fetchError);
		setFlash({ type: 'error', message: 'Failed to load roles' }, cookies);
		throw redirect(303, '/admin');
	}

	if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
		console.error('API error fetching roles:', response.status, errorData.message);
		setFlash({ type: 'error', message: `Failed to load roles: ${errorData.message || response.statusText}` }, cookies);
		throw redirect(303, '/admin');
	}

    return {
		roles: response.data.data,
		meta: response.data.meta
	};
}
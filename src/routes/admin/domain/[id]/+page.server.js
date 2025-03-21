import api from '$lib/api';
import { redirect } from '@sveltejs/kit';

export async function load(event) {
	await event.parent();

	try {
		const { params } = event;
		const response = await api.fetch(`/domain/${params.id}`, {}, event);
		const { data } = await response.json();

		if (!response.ok) {
			throw redirect(303, '/admin/domain');
		}

		return {
			domain: data
		};
	} catch (error) {
		console.error('Failed to fetch domain:', error);
		throw redirect(303, '/admin/domain');
	}
}

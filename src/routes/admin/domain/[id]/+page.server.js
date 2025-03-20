import api from '$lib/api';
import { redirect } from '@sveltejs/kit';

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

		return {
			domain: data
		};
	} catch (error) {
		console.error('Failed to fetch domain:', error);
		redirect(303, '/admin/domain');
	}
}

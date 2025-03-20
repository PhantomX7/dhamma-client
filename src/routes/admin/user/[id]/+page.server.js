import api from '$lib/api';
import { redirect } from '@sveltejs/kit';

export async function load(event) {
	await event.parent();

	try {
		const { params } = event;

		const response = await api.fetch(`/user/${params.id}`, {}, event);
		const { data } = await response.json();

		if (!response.ok) {
			redirect(303, '/admin/user');
		}

		return {
			user: data
		};
	} catch (error) {
		console.error('Failed to fetch user:', error);
		redirect(303, '/admin/user');
	}
}

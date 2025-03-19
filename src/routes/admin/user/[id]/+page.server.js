import { goto } from '$app/navigation';
import api from '$lib/api';

export async function load(event) {
	await event.parent();

	try {
		const { params } = event;

		const response = await api.fetch(`/user/${params.id}`, {}, event);
		const { data } = await response.json();

		if (!response.ok) {
			goto(`/user`);
		}

		return {
			user: data,
		};
	} catch (error) {
		console.error('Failed to fetch users:', error);
		return {
			user: null,
		};
	}
}

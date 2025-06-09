import { json } from '@sveltejs/kit';
import { loadResourceList } from '$lib/utils/data';

export async function GET(event) {
	// Use the utility function to load the list of users
	const { list } = await loadResourceList(event, 'follower', 'followers', '/admin');

	// Return filtered results from your API
	return json({
		data: list
	});
}

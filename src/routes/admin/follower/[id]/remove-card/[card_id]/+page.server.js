import api from '$lib/api';
import { fail } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { runPromise } from '$lib/utils';

export const actions = {
	/**
	 * Handles the default action for removing a card from a follower.
	 * This is triggered by a POST request to this route (e.g., from a form submission).
	 * It calls the API to delete the specified card.
	 */
	default: async (event) => {
		const { cookies, params } = event;
		const followerId = params.id; // Follower ID from route
		const cardId = params.card_id; // Card ID from route

		// Attempt to remove the card via API call
		const [response, fetchError] = await runPromise(
			api.fetch(
				`follower/${followerId}/card/${cardId}`, // API endpoint: DELETE /api/follower/{followerId}/cards/{cardId}
				{
					method: 'DELETE' // Using DELETE method for removal
				},
				event
			)
		);

		if (fetchError || !response.ok) {
			setFlash({ type: 'error', message: 'Failed to remove card from follower' }, cookies);
			return fail(400, { error: 'Failed to remove card' });
		}

		setFlash({ type: 'success', message: 'Card successfully removed from follower' }, cookies);

		return { success: true };
	}
};
import api from '$lib/api';
import { redirect } from '@sveltejs/kit';
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
			// If API call fails, parse error and set a flash message
			const errorData = response && !response.ok ? await response.json().catch(() => ({})) : {};
			const errorMessage =
				errorData?.message || fetchError?.message || 'Failed to remove card. Please try again.';
			setFlash({ type: 'error', message: errorMessage }, cookies);
			// Redirect back to the follower detail page even on failure, flash message will be displayed
			throw redirect(303, `/admin/follower/${followerId}`);
		}

		// On success, set a success flash message and redirect to the follower's detail page
		setFlash({ type: 'success', message: 'Card removed successfully!' }, cookies);
		throw redirect(303, `/admin/follower/${followerId}`);
	}
};
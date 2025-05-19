import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { cardSchema } from '$lib/schema/card';
// import api from '$lib/api'; // No longer directly used
// import { fail, redirect } from '@sveltejs/kit'; // Handled by createResource
// import { setFlash } from 'sveltekit-flash-message/server'; // Handled by createResource
// import { runPromise } from '$lib/utils'; // Handled by createResource
import { loadResourceById, createResource } from '$lib/utils/data'; // Added createResource

/**
 * Loads initial data for the add card page, including the follower's details for context
 * and an empty form for the new card.
 * @param {import('./$types').PageServerLoadEvent} event - The SvelteKit load event.
 * @returns {Promise<object>} Object containing the form, follower details, and follower ID.
 */
export async function load(event) {
	await event.parent(); // Ensures layout data (like current user) is loaded

	const followerId = event.params.id;

	// Load follower data for context (e.g., display follower's name in breadcrumbs/title)
	// The loadResourceById function is assumed to handle API calls and potential errors (like 404)
	const { resource: follower } = await loadResourceById(
		event,
		'follower', // API resource type (e.g., maps to /api/follower/:id)
		'follower', // Key for the follower data in the returned object
		`/admin/follower` // Fallback redirect path if follower not found
	);
	// If follower is not found, loadResourceById should throw a redirect or handle the error.

	// Initialize an empty form for adding a new card
	const form = await superValidate(zod(cardSchema));

	return {
		form,
		follower, // Pass follower data to the Svelte page
		followerId
	};
}

export const actions = {
	/**
	 * Handles the default form submission for adding a new card to a follower.
	 * It validates the form data and calls the API to create the card using the createResource utility.
	 */
	default: async (event) => {
		const { params } = event;
		const followerId = params.id; // Get follower ID from route parameters

		// Use the createResource utility to handle form validation, API call, and response
		return await createResource(
			event,
			`follower/${followerId}/card`, // API endpoint for creating a card for a specific follower
			'card', // Resource name for flash messages
			cardSchema, // Zod schema for validation
			`/admin/follower/${followerId}` // Success redirect path (back to the follower's detail page)
			// No detailRedirectPathBase is needed as we redirect to the follower's detail page,
			// not a specific "card detail page".
		);
	}
};
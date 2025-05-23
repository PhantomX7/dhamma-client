import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { loadResourceById } from '$lib/utils/data';
import api from '$lib/api';
import { fail } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { runPromise } from '$lib/utils';
import { setErrors } from '$lib/utils/form';

// Schema for the attendance form (just card_code)
const attendanceSchema = z.object({
	card_code: z.string().min(1, { message: 'Card code is required.' })
});

/**
 * Loads the event data and initializes the attendance form.
 * @param {import('./$types').PageServerLoadEvent} event - The SvelteKit load event.
 * @returns {Promise<object>} The event data and the form object.
 */
export async function load(event) {
	await event.parent(); // Load layout data

	const eventId = event.params.id;

	// Load event details for display
	const { event: eventDetail } = await loadResourceById(
		event,
		'/event', // API resource type
		'event', // Key for the event data
		`/admin/event` // Fallback redirect
	);

	// Initialize an empty form for attendance
	const form = await superValidate(zod(attendanceSchema));

	return {
		form,
		event: eventDetail, // Pass event data to the page
		eventId
	};
}

export const actions = {
	/**
	 * Handles the form submission for attending an event.
	 */
	default: async (event) => {
		const { request, params, cookies } = event;
		const eventId = params.id;

		const form = await superValidate(request, zod(attendanceSchema));

		if (!form.valid) {
			setFlash({ type: 'error', message: 'Invalid data. Please check the form.' }, cookies);
			return fail(400, { form });
		}

		// API call to record attendance
		// Assumes an API endpoint: POST /api/event/{eventId}/attend
		const [response, fetchError] = await runPromise(
			api.fetch(
				`event/${eventId}/attend`,
				{
					method: 'POST',
					body: JSON.stringify(form.data),
					headers: {
						'Content-Type': 'application/json'
					}
				},
				event
			)
		);

		form.data.card_code = ''; // Clear the card code field

		if (fetchError || !response) {
			setFlash(
				{ type: 'error', message: fetchError?.message || 'Failed to connect to the server.' },
				cookies
			);
			return fail(500, { form });
		}

		const responseData = response.data;

		if (!response.ok) {
			const errorMessage =
				responseData?.message ||
				'Failed to record attendance. The card code might be invalid or already used for this event.';
			if (responseData?.error) {
				setErrors(form, responseData.error); // Populate form errors if available
			}
			setFlash({ type: 'error', message: errorMessage }, cookies);
			return fail(response.status || 400, { form, error: errorMessage });
		}

		// Set success flash message
		setFlash({ type: 'success', message: 'Attendance recorded successfully!' }, cookies);

		// Return success without redirecting, and reset the form
		return {
			form,
			success: true
		};
	}
};

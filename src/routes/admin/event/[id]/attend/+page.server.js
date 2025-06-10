import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { loadResourceById } from '$lib/utils/data';
import api from '$lib/api';
import { fail } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { runPromise } from '$lib/utils';

// Schema for the attendance form (just card_code)
const attendanceSchema = z.object({
	card_code: z.string().min(1, { message: 'Card code is required.' })
});

// Schema for manual attendance by follower ID
const attendByIdSchema = z.object({
	follower_id: z.number().int().min(1, { message: 'Follower ID is required.' })
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
	attend: async (event) => {
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
			api.post(`event/${eventId}/attend`, form.data, event)
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

		if (!response.ok || !responseData || !responseData.status) {
			const errorMessage =
				responseData?.error?.message ||
				'Failed to record attendance. The card code might be invalid.';
			if (response.status > 500) {
				console.error(
					'API error recording attendance:',
					response.status,
					errorMessage,
					responseData?.error
				);
			}
			setFlash({ type: 'error', message: `${errorMessage}` }, cookies);
			return fail(response.status === 422 ? 422 : 400, { form });
		}

		// Set success flash message
		setFlash({ type: 'success', message: 'Attendance recorded successfully!' }, cookies);

		// Return success without redirecting, and reset the form
		return {
			form,
			success: true
		};
	},

	/**
	 * Handles manual attendance by follower ID.
	 */
	attendById: async (event) => {
		const { request, params, cookies } = event;
		const eventId = params.id;

		const form = await superValidate(request, zod(attendByIdSchema));

		if (!form.valid) {
			setFlash({ type: 'error', message: 'Invalid data. Please check the form.' }, cookies);
			return fail(400, { form });
		}

		// API call to record attendance by follower ID
		// Uses the attend-by-id endpoint as requested
		const [response, fetchError] = await runPromise(
			api.post(`event/${eventId}/attend-by-id`, form.data, event)
		);

		if (fetchError || !response) {
			setFlash(
				{ type: 'error', message: fetchError?.message || 'Failed to connect to the server.' },
				cookies
			);
			return fail(500, { form });
		}

		const responseData = response.data;

		if (!response.ok || !responseData || !responseData.status) {
			const errorMessage =
				responseData?.error?.message ||
				'Failed to record attendance. The card code might be invalid.';
			if (response.status > 500) {
				console.error(
					'API error recording attendance by ID:',
					response.status,
					errorMessage,
					responseData?.error
				);
			}
			setFlash({ type: 'error', message: `${errorMessage}` }, cookies);
			return fail(response.status === 422 ? 422 : 400, { form });
		}

		// Set success flash message
		setFlash({ type: 'success', message: 'Attendance recorded successfully!' }, cookies);

		return {
			form,
			success: true
		};
	}
};

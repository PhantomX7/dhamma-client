import { fail, redirect } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { loginSchema } from '$lib/schema/login';
import api from '$lib/api';

// Check authentication and prepare form
export async function load({ locals }) {
	if (locals.token) {
		throw redirect(303, '/admin');
	}
	return { form: await superValidate(zod(loginSchema)) };
}

// Handle cookie settings
const cookieOptions = {
	path: '/',
	httpOnly: true,
	sameSite: 'strict',
	secure: true
};

// Set authentication cookies
function setAuthCookies(cookies, { access_token, refresh_token }) {
	cookies.set('access_token', access_token, cookieOptions);
	cookies.set('refresh_token', refresh_token, cookieOptions);
}

export const actions = {
	default: async (event) => {
		let { request, locals, cookies } = event;
		// Get form data
		const formData = await request.formData();

		// Validate form
		const form = await superValidate(formData, zod(loginSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			// Authenticate user
			api.setTenant(locals.tenant);
			const response = await api.fetch(
				'/auth/signin',
				{
					method: 'POST',
					body: formData
				},
				event
			);

			const { status, data, error } = await response.json();

			if (!status) {
				// Use the error message from API or fallback to the error detail
				return message(form, error || 'Authentication failed');
			}

			// Set authentication data
			locals.token = {
				accessToken: data.access_token,
				refreshToken: data.refresh_token
			};

			setAuthCookies(cookies, data);

			return { form, success: true };
		} catch (error) {
			console.error('Login error:', error);
			return message(form, 'An unexpected error occurred. Please try again later.');
		}
	}
};

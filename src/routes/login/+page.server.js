import { fail, redirect } from '@sveltejs/kit';
import { superValidate, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { loginSchema } from '$lib/schema/login';
import api from '$lib/api';
import { runPromise } from '$lib/utils';

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

		// Validate form
		const form = await superValidate(request, zod(loginSchema), { dataType: 'json' });
		if (!form.valid) {
			return fail(400, { form });
		}

		// Authenticate user
		const [response, fetchError] = await runPromise(
			api.fetch(
				'/auth/signin',
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

		// Handle fetch errors
		if (fetchError) {
			console.error('Login error:', fetchError);
			return message(form, 'An unexpected error occurred. Please try again later.');
		}

		// Handle API response
		if (!response.ok || !response.data.status) {
			return message(form, response.data.error || 'Invalid Credentials');
		}

		// Set authentication data
		const data = response.data.data;
		locals.token = {
			accessToken: data.access_token,
			refreshToken: data.refresh_token
		};

		setAuthCookies(cookies, data);

		return { form, success: true };
	}
};

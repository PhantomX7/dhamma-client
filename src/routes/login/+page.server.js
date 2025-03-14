import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { loginSchema } from '$lib/schema/login';
import { httpClient } from '$lib/utils/http-client';

export async function load({ parent }) {
	const { isAuthenticated } = await parent();
	if (isAuthenticated) {
		throw redirect(303, '/admin');
	}
	// Create a form using the schema
	const form = await superValidate(zod(loginSchema));

	// Return the form to the page
	return { form };
}

export const actions = {
	default: async ({ request, locals, cookies }) => {
		// Validate the form data against the schema
		const form = await superValidate(request, zod(loginSchema));

		// If form validation fails, return the form with errors
		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			// Set the tenant for the HTTP client
			httpClient.setTenant(locals.tenant);

			// Send the login request using the HTTP client
			const response = await httpClient.fetch('auth/signin', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(form.data)
			});

			const { data, status, message } = await response.json();

			if (!status) {
				// If login fails, return the form with an error message
				return fail(response.status, {
					form,
					error: message || 'Login failed'
				});
			}

			console.log(locals);
			// Set the access token in the locals
			locals.token = {
				accessToken: data.access_token,
				refreshToken: data.refresh_token
			};

			// set cookies
			// Set the token in the cookie
			cookies.set('access_token', data.access_token, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: true
			});

			cookies.set('refresh_token', data.refresh_token, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: true
			});

			// If login succeeds, return the form, success status, and tokens
			return {
				form,
				success: true
			};
		} catch (error) {
			console.error('Login error:', error);
			// If an error occurs, return the form with a generic error message
			return fail(500, {
				form,
				error: 'An error occurred during login'
			});
		}
	}
};

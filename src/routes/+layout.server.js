import { redirect } from '@sveltejs/kit';
import api from '$lib/api';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals, url }) {
	// Define public routes that don't require authentication
	const publicRoutes = ['/login'];
	const isPublicRoute = publicRoutes.some((route) => url.pathname.startsWith(route));

	// If no access token and not a public route, redirect to login
	if (!locals.token && !isPublicRoute) {
		throw redirect(302, '/login');
	}

	// Pass tenant data and auth status to the client
	let user = null;
	if (locals.token) {
		try {
			api.setTenant(locals.tenant);
			const response = await api.fetch('auth/me', {}, locals.token);

			const { data } = await response.json();

			user = data;
		} catch (error) {
			console.error('Failed to fetch user data:', error);
		}
	}

	return {
		tenant: locals.tenant,
		isAuthenticated: !!locals.token,
		user
	};
}

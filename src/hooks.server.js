import { redirect } from '@sveltejs/kit';

const unProtectedRoutes = ['/login'];

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	// Get tokens from cookies
	const accessToken = event.cookies.get('access_token');
	const refreshToken = event.cookies.get('refresh_token');

	if (!accessToken && !unProtectedRoutes.includes(event.url.pathname)) {
		return redirect(302, '/login');
	}

	// Set tokens in locals
	event.locals.token = null;
	if (accessToken) {
		event.locals.token = {
			accessToken,
			refreshToken
		};
	}

	// multi domain handling
	// Get the host header
	const host = event.request.headers.get('host');
	// Extract tenant from subdomain
	let hostSplit = host?.split('.');
	let subdomain = hostSplit[0];
	if (hostSplit?.length < 2 || hostSplit[0] === 'www') {
		subdomain = 'main';
	}

	// Skip tenant check for static assets and favicon
	if (event.url.pathname.startsWith('/favicon.ico') || event.url.pathname.startsWith('/_app/')) {
		return resolve(event);
	}

	// Add tenant info to event.locals
	event.locals.tenant = subdomain;

	// If no valid tenant is found, you might want to redirect to an error page
	if (!subdomain) {
		return new Response('Tenant not found', { status: 404 });
	}

	// Continue with the request
	const response = await resolve(event);
	return response;
}

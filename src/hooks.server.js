import { redirect } from '@sveltejs/kit';

// Configuration constants
const UNPROTECTED_ROUTES = ['/login'];
const STATIC_ASSET_PATHS = ['/favicon.ico', '/_app/'];
const DEFAULT_TENANT = 'main';
const REDIRECT_STATUS = 302;

/**
 * Main request handler for authentication and multi-tenant support
 * @type {import('@sveltejs/kit').Handle}
 */
export async function handle({ event, resolve }) {
	// Early return for static assets to improve performance
	if (isStaticAsset(event.url.pathname)) {
		return resolve(event);
	}

	// Handle authentication
	handleAuthentication(event);

	// Handle multi-tenant setup
	const tenant = extractTenant(event.request);
	if (!tenant) {
		return new Response('Tenant not found', { status: 404 });
	}
	event.locals.tenant = tenant;

	// Continue with the request
	return await resolve(event);
}

/**
 * Check if the request is for a static asset
 * @param {string} pathname - The request pathname
 * @returns {boolean} True if it's a static asset
 */
function isStaticAsset(pathname) {
	return STATIC_ASSET_PATHS.some((path) => pathname.startsWith(path));
}

/**
 * Handle user authentication and token management
 * @param {import('@sveltejs/kit').RequestEvent} event - The request event
 */
function handleAuthentication(event) {
	// Get tokens from cookies
	const accessToken = event.cookies.get('access_token');
	const refreshToken = event.cookies.get('refresh_token');

	// Check if route requires authentication
	if (!accessToken && !UNPROTECTED_ROUTES.includes(event.url.pathname)) {
		return redirect(REDIRECT_STATUS, '/login');
	}

	// Set tokens in locals (initialize as null first)
	event.locals.token = null;
	if (accessToken) {
		event.locals.token = {
			accessToken,
			refreshToken
		};
	}
}

/**
 * Extract tenant information from the request host header
 * @param {Request} request - The incoming request
 * @returns {string|null} The tenant identifier or null if invalid
 */
function extractTenant(request) {
	const host = request.headers.get('host');

	// Handle missing host header
	if (!host) {
		return null;
	}

	// Extract subdomain from host
	const hostParts = host.split('.');
	const subdomain = hostParts[0];

	// Return default tenant for invalid subdomains or www
	if (hostParts.length < 2 || subdomain === 'www') {
		return DEFAULT_TENANT;
	}

	// Validate subdomain format (basic validation)
	if (!isValidSubdomain(subdomain)) {
		return null;
	}

	return subdomain;
}

/**
 * Validate subdomain format
 * @param {string} subdomain - The subdomain to validate
 * @returns {boolean} True if valid subdomain
 */
function isValidSubdomain(subdomain) {
	// Basic validation: alphanumeric and hyphens, not starting/ending with hyphen
	const subdomainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/;
	return subdomainRegex.test(subdomain) && subdomain.length <= 63;
}

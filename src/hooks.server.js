import { redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';

// Configuration
const UNPROTECTED_ROUTES = ['/login', '/signup', '/forgot-password', '/reset-password'];
const API_ROUTES_PREFIX = '/api';
const STATIC_ROUTES = ['/favicon.ico', '/_app/', '/images/', '/assets/'];
const DEFAULT_TENANT = 'main';
const LOCALHOST_PATTERNS = ['localhost', '127.0.0.1', '0.0.0.0'];

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	const pathname = event.url.pathname;

	// Skip processing for static assets early
	if (isStaticRoute(pathname)) {
		return resolve(event);
	}

	// Extract tenant information first
	const host = event.request.headers.get('host');
	const tenant = extractTenant(host);

	// Set tenant in locals
	event.locals.tenant = tenant;

	// Get tokens from cookies
	const accessToken = event.cookies.get('access_token');
	const refreshToken = event.cookies.get('refresh_token');

	// Initialize token locals
	event.locals.token = null;

	// Validate and set tokens if they exist
	if (accessToken && isValidTokenFormat(accessToken)) {
		event.locals.token = {
			accessToken,
			refreshToken: refreshToken || null
		};
	}

	// Check authentication for protected routes
	const needsAuth = !isUnprotectedRoute(pathname) && !pathname.startsWith(API_ROUTES_PREFIX);

	if (needsAuth) {
		// No token at all
		if (!event.locals.token) {
			// Preserve the original URL for redirect after login
			const redirectUrl = `${pathname}${event.url.search}`;
			const loginUrl = `/login${redirectUrl !== '/' ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`;
			return redirect(302, loginUrl);
		}

		// Check if access token is expired
		if (isTokenExpired(event.locals.token.accessToken)) {
			// If we have a refresh token, the HttpClient will handle the refresh
			// If no refresh token, redirect to login
			if (!event.locals.token.refreshToken) {
				// Clear invalid tokens
				event.cookies.delete('access_token', { path: '/' });
				event.cookies.delete('refresh_token', { path: '/' });

				const redirectUrl = `${pathname}${event.url.search}`;
				const loginUrl = `/login${redirectUrl !== '/' ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`;
				return redirect(302, loginUrl);
			}
		}
	}

	// Handle API routes differently - they should return JSON errors instead of redirects
	if (pathname.startsWith(API_ROUTES_PREFIX) && needsAuth && !event.locals.token) {
		return new Response(
			JSON.stringify({
				error: 'Unauthorized',
				message: 'Authentication required'
			}),
			{
				status: 401,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	}

	// Tenant validation (optional - uncomment if you want to restrict tenants)
	/*
	const validTenants = ['main', 'tenant1', 'tenant2']; // Define your valid tenants
	if (!validTenants.includes(tenant)) {
		return new Response('Tenant not found', { 
			status: 404,
			headers: {
				'Content-Type': 'text/plain'
			}
		});
	}
	*/

	// Add security headers
	const response = await resolve(event);

	// Add security headers (optional)
	if (!dev) {
		response.headers.set('X-Frame-Options', 'DENY');
		response.headers.set('X-Content-Type-Options', 'nosniff');
		response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	}

	return response;
}

/**
 * Extract tenant from host header
 * @param {string} host - The host header value
 * @returns {string} - The tenant identifier
 */
function extractTenant(host) {
	if (!host) {
		return DEFAULT_TENANT;
	}

	// Handle localhost and development scenarios
	if (dev && LOCALHOST_PATTERNS.some((pattern) => host.includes(pattern))) {
		return DEFAULT_TENANT;
	}

	const hostParts = host.split('.');

	// If it's a single domain or www subdomain, use main tenant
	if (hostParts.length < 2 || hostParts[0] === 'www') {
		return DEFAULT_TENANT;
	}

	// Return the subdomain as tenant
	return hostParts[0];
}

/**
 * Check if route should skip authentication
 * @param {string} pathname - The request pathname
 * @returns {boolean}
 */
function isUnprotectedRoute(pathname) {
	return UNPROTECTED_ROUTES.some((route) => {
		// Exact match or starts with for nested routes
		return pathname === route || pathname.startsWith(`${route}/`);
	});
}

/**
 * Check if route is a static asset
 * @param {string} pathname - The request pathname
 * @returns {boolean}
 */
function isStaticRoute(pathname) {
	return STATIC_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Validate token structure (basic validation)
 * @param {string} token - JWT token string
 * @returns {boolean}
 */
function isValidTokenFormat(token) {
	if (!token || typeof token !== 'string') {
		return false;
	}

	// Basic JWT format check (3 parts separated by dots)
	const parts = token.split('.');
	return parts.length === 3;
}

/**
 * Check if token is expired (without verification)
 * @param {string} token - JWT token string
 * @returns {boolean}
 */
function isTokenExpired(token) {
	try {
		if (!isValidTokenFormat(token)) {
			return true;
		}

		const payload = JSON.parse(atob(token.split('.')[1]));
		const currentTime = Math.floor(Date.now() / 1000);

		return payload.exp && payload.exp < currentTime;
	} catch (error) {
		console.warn('Error checking token expiration:', error);
		return true; // Assume expired if we can't parse it
	}
}

// Optional: Export utility functions for use in other parts of your app
export { extractTenant, isUnprotectedRoute, isValidTokenFormat, isTokenExpired };

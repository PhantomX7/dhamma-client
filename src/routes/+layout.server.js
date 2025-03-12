import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals, url }) {
    // Get access token from locals
    const accessToken = locals.accessToken;

    // Define public routes that don't require authentication
    const publicRoutes = ['/login'];
    const isPublicRoute = publicRoutes.some(route => url.pathname.startsWith(route));

    // If no access token and not a public route, redirect to login
    if (!accessToken && !isPublicRoute) {
        throw redirect(302, '/login');
    }

    // Pass tenant data and auth status to the client
    return {
        tenant: locals.tenant,
        isAuthenticated: !!accessToken
    };
}
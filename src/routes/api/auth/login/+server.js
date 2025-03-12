import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const { username, password } = await request.json();

		// TODO: Replace this with your actual authentication logic
		// This is just a mock implementation
		if (username === 'admin' && password === 'password') {
			return json({
				success: true,
				user: {
					username,
					role: 'admin'
				}
			});
		}

		return json(
			{
				success: false,
				message: 'Invalid username or password'
			},
			{
				status: 401
			}
		);
	} catch (error) {
		console.log(error);
		return json(
			{
				success: false,
				message: 'Internal server error'
			},
			{
				status: 500
			}
		);
	}
}

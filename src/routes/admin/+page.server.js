export const actions = {
	logout: async ({ cookies, locals }) => {
		cookies.delete('access_token', { path: '/' });
		cookies.delete('refresh_token', { path: '/' });

		locals.token = null;

		return;
	}
};

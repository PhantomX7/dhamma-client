class HttpClient {
	constructor() {
		this.baseUrl = import.meta.env.VITE_API_BASE_URL;
		this.isRefreshing = false;
		this.refreshSubscribers = [];
		this.tenant = null;
	}

	setTenant(tenant) {
		this.tenant = tenant;
	}

	buildUrl(endpoint) {
		// Remove leading slash if present
		endpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;

		// For main tenant or no tenant, use /api prefix
		if (this.tenant === 'main' || !this.tenant) {
			return `${this.baseUrl}/api/${endpoint}`;
		}

		// For other tenants, use tenant-specific path
		return `${this.baseUrl}/${this.tenant}/${endpoint}`;
	}

	async fetch(endpoint, options = {}, tokens = null) {
		const url = this.buildUrl(endpoint);

		// Add authorization header if tokens are provided
		if (tokens?.accessToken) {
			options.headers = {
				...options.headers,
				Authorization: `Bearer ${tokens.accessToken}`
			};
		}

		try {
			const response = await fetch(url, options);

			// If the response is 401 and we have a refresh token, try to refresh
			if (response.status === 401 && tokens?.refreshToken) {
				const newTokens = await this.refreshToken(tokens.refreshToken);
				if (newTokens) {
					// Retry the original request with the new token
					options.headers = {
						...options.headers,
						Authorization: `Bearer ${newTokens.accessToken}`
					};
					return fetch(url, options);
				}
			}

			return response;
		} catch (error) {
			console.error('Request failed:', error);
			throw error;
		}
	}

	async refreshToken(refreshToken) {
		// If we're already refreshing, wait for that to complete
		if (this.isRefreshing) {
			return new Promise((resolve) => {
				this.refreshSubscribers.push((tokens) => resolve(tokens));
			});
		}

		this.isRefreshing = true;

		try {
			if (!refreshToken) {
				return null;
			}

			const refreshEndpoint = 'auth/refresh';
			const response = await fetch(this.buildUrl(refreshEndpoint), {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					refresh_token: refreshToken
				})
			});

			// if (!response.ok) {
			// 	throw new Error('Token refresh failed');
			// }

			const { data, status, message } = await response.json();
			console.log({ data, status, message });
			if (!status) {
				throw new Error(message);
			}

			const newTokens = {
				accessToken: data.access_token,
				refreshToken: data.refresh_token
			};

			// Notify all subscribers about the new tokens
			this.refreshSubscribers.forEach((callback) => callback(newTokens));
			this.refreshSubscribers = [];

			return newTokens;
		} catch (error) {
			console.error('Token refresh failed:', error);

			return null;
		} finally {
			this.isRefreshing = false;
		}
	}
}

// Create and export a singleton instance
export default new HttpClient();

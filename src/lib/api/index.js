class HttpClient {
	constructor() {
		this.baseUrl = import.meta.env.VITE_API_BASE_URL;
		this.tenant = null;
		this.refreshPromise = null; // Prevent concurrent refresh attempts
		
		if (!this.baseUrl) {
			throw new Error('VITE_API_BASE_URL environment variable is required');
		}
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

	async fetch(endpoint, options = {}, event = null, retryCount = 0) {
		const MAX_RETRIES = 1; // Prevent infinite recursion
		
		if (event?.locals?.tenant) {
			this.setTenant(event.locals.tenant);
		}
		
		const url = this.buildUrl(endpoint);
		const tokens = event?.locals?.token;

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
			if (response.status === 401 && tokens?.refreshToken && retryCount < MAX_RETRIES) {
				const newTokens = await this.refreshToken(tokens.refreshToken, event);
				if (newTokens) {
					// Retry the original request with the new token
					const newOptions = {
						...options,
						headers: {
							...options.headers,
							Authorization: `Bearer ${newTokens.accessToken}`
						}
					};
					return this.fetch(endpoint, newOptions, event, retryCount + 1);
				}
			}

			// Check if response contains JSON before parsing
			const contentType = response.headers.get('content-type');
			let data = null;
			
			if (contentType && contentType.includes('application/json')) {
				try {
					data = await response.json();
				} catch (jsonError) {
					console.warn('Failed to parse JSON response:', jsonError);
					data = null;
				}
			} else {
				// For non-JSON responses, get text content
				data = await response.text();
			}

			return {
				ok: response.ok,
				status: response.status,
				data,
				response
			};
		} catch (error) {
			console.error('Request failed:', error);
			throw error;
		}
	}

	async refreshToken(refreshToken, event = null) {
		// Prevent concurrent refresh attempts
		if (this.refreshPromise) {
			return this.refreshPromise;
		}

		this.refreshPromise = this._performTokenRefresh(refreshToken, event);
		
		try {
			const result = await this.refreshPromise;
			return result;
		} finally {
			this.refreshPromise = null;
		}
	}

	async _performTokenRefresh(refreshToken, event = null) {
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

			if (!response.ok) {
				throw new Error(`Token refresh failed with status: ${response.status}`);
			}

			const responseData = await response.json();
			const { data, status, message } = responseData;
			
			if (!status) {
				throw new Error(message || 'Token refresh failed');
			}

			const newTokens = {
				accessToken: data.access_token,
				refreshToken: data.refresh_token
			};

			// Update locals and cookies if event is provided
			if (event) {
				event.locals.token = newTokens;
				const cookieOptions = {
					path: '/',
					httpOnly: true,
					sameSite: 'strict',
					secure: process.env.NODE_ENV === 'production' // Only secure in production
				};
				event.cookies.set('access_token', data.access_token, cookieOptions);
				event.cookies.set('refresh_token', data.refresh_token, cookieOptions);
			}

			return newTokens;
		} catch (error) {
			console.error('Token refresh failed:', error);
			
			// Clear invalid tokens
			if (event) {
				event.locals.token = null;
				event.cookies.delete('access_token', { path: '/' });
				event.cookies.delete('refresh_token', { path: '/' });
			}

			return null;
		}
	}

	// Utility method for common HTTP methods
	async get(endpoint, event = null) {
		return this.fetch(endpoint, { method: 'GET' }, event);
	}

	async post(endpoint, data, event = null) {
		return this.fetch(endpoint, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		}, event);
	}

	async put(endpoint, data, event = null) {
		return this.fetch(endpoint, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		}, event);
	}

	async patch(endpoint, data, event = null) {
		return this.fetch(endpoint, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		}, event);
	}

	async delete(endpoint, event = null) {
		return this.fetch(endpoint, { method: 'DELETE' }, event);
	}
}

// Create and export a singleton instance
export default new HttpClient();
import api from '$lib/api';
import { fail } from '@sveltejs/kit';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { runPromise } from '$lib/utils';

export async function load(event) {
	await event.parent();

	const { params, cookies } = event;
	
	// Fetch user details
	const [userResponse, userFetchError] = await runPromise(
		api.fetch(`user/${params.id}`, {}, event)
	);
	
	if (userFetchError || !userResponse.ok) {
		setFlash({ type: 'error', message: 'User not found' }, cookies);
		throw redirect(303, '/admin/user');
	}
	
	return {
		user: userResponse.data.data
	};
}

// Keep your existing actions for adding/removing domains
export const actions = {
	// Add a single domain
	addDomain: async (event) => {
        console.log('addDomain action triggered');
		const { request, params, cookies } = event;
		const formData = await request.formData();
		const domainId = formData.get('domain_id');
		
		if (!domainId) {
			setFlash({ type: 'error', message: 'Domain ID is required' }, cookies);
			return fail(400);
		}
		
		// Call the API to assign the domain
		const [response, fetchError] = await runPromise(
			api.fetch(
				`user/${params.id}/assign-domain`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ domain_id: domainId })
				},
				event
			)
		);
		
		if (fetchError) {
			console.error('Failed to assign domain:', fetchError);
			setFlash({ type: 'error', message: 'An unexpected error occurred' }, cookies);
			return fail(500);
		}
		
		if (!response.ok) {
			setFlash({ type: 'error', message: 'Failed to assign domain' }, cookies);
			return fail(422);
		}
		
		setFlash({ type: 'success', message: 'Domain assigned successfully' }, cookies);
		return { success: true };
	},
	
	// Add multiple domains
	addMultipleDomains: async (event) => {
		const { request, params, cookies } = event;
		const formData = await request.formData();
		const domainIds = formData.getAll('domain_ids');
		
		if (!domainIds.length) {
			setFlash({ type: 'error', message: 'No domains selected' }, cookies);
			return fail(400);
		}
		
		// Process each domain assignment sequentially
		let successCount = 0;
		let errorCount = 0;
		
		for (const domainId of domainIds) {
			const [response, fetchError] = await runPromise(
				api.fetch(
					`user/${params.id}/assign-domain`,
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ domain_id: domainId })
					},
					event
				)
			);
			
			if (fetchError || !response.ok) {
				errorCount++;
			} else {
				successCount++;
			}
		}
		
		if (errorCount > 0) {
			if (successCount > 0) {
				setFlash({ 
					type: 'warning', 
					message: `${successCount} domains assigned, ${errorCount} failed` 
				}, cookies);
			} else {
				setFlash({ type: 'error', message: 'Failed to assign domains' }, cookies);
			}
		} else {
			setFlash({ type: 'success', message: 'All domains assigned successfully' }, cookies);
		}
		
		return { success: successCount > 0 };
	},
	
	// Remove a domain
	removeDomain: async (event) => {
		const { request, params, cookies } = event;
		const formData = await request.formData();
		const domainId = formData.get('domain_id');
		
		if (!domainId) {
			setFlash({ type: 'error', message: 'Domain ID is required' }, cookies);
			return fail(400);
		}
		
		// Call the API to remove the domain
		const [response, fetchError] = await runPromise(
			api.fetch(
				`user/${params.id}/remove-domain`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ domain_id: domainId })
				},
				event
			)
		);
		
		if (fetchError) {
			console.error('Failed to remove domain:', fetchError);
			setFlash({ type: 'error', message: 'An unexpected error occurred' }, cookies);
			return fail(500);
		}
		
		if (!response.ok) {
			setFlash({ type: 'error', message: 'Failed to remove domain' }, cookies);
			return fail(422);
		}
		
		setFlash({ type: 'success', message: 'Domain removed successfully' }, cookies);
		return { success: true };
	}
};
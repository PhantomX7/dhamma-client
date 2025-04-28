import { fail } from '@sveltejs/kit';
import { redirect, setFlash } from 'sveltekit-flash-message/server';
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { assignUserToDomainSchema, userDomainRoleSchema } from '$lib/schema/userDomainRole';
import { loadResourceById, loadData } from '$lib/utils/data';
import { runPromise } from '$lib/utils';
import api from '$lib/api';
import { setErrors } from '$lib/utils/form'; // Import setErrors

/**
 * Loads data required for the User Domain Roles management page.
 * @param {import('./$types').PageServerLoadEvent} event - The SvelteKit load event.
 */
export async function load(event) {
	const parentData = await event.parent(); // Get parent layout data (e.g., currentUser)

	// Load user details
	const userResult = await loadResourceById(event, '/user', 'User', '/admin/user');

	// Load all active domains
	const domainsResult = await loadData(event, '/domain?limit=1000&is_active=true');

	// Load all active roles
	const rolesResult = await loadData(event, '/role?limit=1000&is_active=true');

	// Load current domain-role assignments for the user
	// Adjust API endpoint as needed, e.g., '/user/{id}/domain-roles'
	const [assignmentsResponse, assignmentsError] = await runPromise(
		api.fetch(`/user/${event.params.id}/domains`, {}, event) // Assuming this endpoint returns domains with roles
	);

	if (assignmentsError || !assignmentsResponse?.ok) {
		console.error('Failed to load user domain assignments:', assignmentsError || assignmentsResponse?.status);
		setFlash({ type: 'error', message: 'Could not load user domain assignments.' }, event.cookies);
		// Allow page to load but show an error, or redirect if critical
	}

	// Extract data, providing defaults
	const user = userResult.user;
	const allDomains = domainsResult?.list ?? [];
	const allRoles = rolesResult?.list ?? [];
	const assignedDomains = assignmentsResponse?.data?.data ?? []; // Adjust based on actual API response structure

	// Prepare a map for quick lookup: domainId -> assignedRoleId
	const assignedRolesMap = assignedDomains.reduce((acc, item) => {
		// Assuming the API returns { domain_id: X, role_id: Y } or similar per item
		// Adjust based on your actual API response structure for user domains/roles
		if (item.pivot?.role_id) { // Example: Check if role info is nested in pivot
			acc[item.id] = item.pivot.role_id;
		} else if (item.role_id) { // Example: Check if role_id is directly on the domain object for this user
            acc[item.id] = item.role_id;
        }
		return acc;
	}, {});


	// Initialize forms
	const assignForm = await superValidate(zod(assignUserToDomainSchema));
	const updateForm = await superValidate(zod(userDomainRoleSchema)); // For potential inline updates

	return {
		user,
		allDomains,
		allRoles,
		assignedDomains, // Pass the raw assigned domains data
		assignedRolesMap, // Pass the map for easier lookup in UI
		assignForm,
		updateForm,
		...parentData // Include parent data like currentUser
	};
}

export const actions = {
	/**
	 * Assigns a user to a new domain with a specific role.
	 */
	assign: async (event) => {
		const { request, params, cookies } = event;
		const form = await superValidate(request, zod(assignUserToDomainSchema));

		if (!form.valid) {
			setFlash({ type: 'error', message: 'Validation failed. Please select both domain and role.' }, cookies);
			return fail(400, { assignForm: form }); // Return under specific key
		}

		const { domain_id, role_id } = form.data;
		const userId = params.id;

		// API Call: Assign user to domain with role
		// Adjust endpoint and payload as needed. Example: PUT /user/{userId}/domains/{domainId} with { role_id: X }
		const [response, fetchError] = await runPromise(
			api.fetch(
				`/user/${userId}/domains/${domain_id}`, // Example endpoint
				{
					method: 'PUT', // Or POST depending on API design
					body: JSON.stringify({ role_id }), // Send role_id in body
					headers: { 'Content-Type': 'application/json' }
				},
				event
			)
		);

		if (fetchError || !response?.ok) {
			const errorData = response?.data;
			const message = errorData?.message || 'Failed to assign domain/role.';
			console.error('API Error Assigning Domain/Role:', fetchError || response?.status, errorData);
			if (errorData?.error) setErrors(form, errorData.error);
			setFlash({ type: 'error', message: `Error: ${message}` }, cookies);
			return fail(response?.status === 422 ? 422 : 500, { assignForm: form });
		}

		setFlash({ type: 'success', message: 'Domain and Role assigned successfully!' }, cookies);
		return { assignForm: form }; // Return form state on success
        // No redirect needed, page should update via invalidation (default behavior)
	},

	/**
	 * Removes a user's assignment from a specific domain (including their role).
	 */
	remove: async (event) => {
		const { request, params, cookies } = event;
		const formData = await request.formData();
		const domainId = formData.get('domain_id');
		const userId = params.id;

		if (!domainId) {
			setFlash({ type: 'error', message: 'Missing domain ID for removal.' }, cookies);
			return fail(400);
		}

		// API Call: Remove user from domain
		// Adjust endpoint as needed. Example: DELETE /user/{userId}/domains/{domainId}
		const [response, fetchError] = await runPromise(
			api.fetch(
				`/user/${userId}/domains/${domainId}`, // Example endpoint
				{ method: 'DELETE' },
				event
			)
		);

		if (fetchError || !response?.ok) {
			const errorData = response?.data;
			const message = errorData?.message || 'Failed to remove domain assignment.';
			console.error('API Error Removing Domain Assignment:', fetchError || response?.status, errorData);
			setFlash({ type: 'error', message: `Error: ${message}` }, cookies);
			return fail(response?.status || 500);
		}

		setFlash({ type: 'success', message: 'Domain assignment removed successfully!' }, cookies);
		return {}; // Indicate success
        // No redirect needed, page should update via invalidation
	},

    /**
	 * Updates the role for a user within an already assigned domain.
	 */
	updateRole: async (event) => {
		const { request, params, cookies } = event;
        // Use superValidate for parsing and validation
		const form = await superValidate(request, zod(userDomainRoleSchema));

        // Extract domain_id separately if it's not part of the schema/form data itself
        // For example, if it's passed as a hidden input or data attribute
        const requestData = await event.request.formData();
        const domainId = requestData.get('domain_id'); // Get domain_id from the submitted form data

		if (!form.valid || !domainId) {
            const message = !domainId ? 'Missing domain ID for update.' : 'Validation failed. Please select a role.';
			setFlash({ type: 'error', message }, cookies);
			// Return form errors under a specific key if needed, or a general fail
            return fail(400, { updateForm: form });
		}

		const { role_id } = form.data;
		const userId = params.id;

		// API Call: Update role for user in domain
		// Adjust endpoint and payload. Example: PUT /user/{userId}/domains/{domainId} with { role_id: X }
		const [response, fetchError] = await runPromise(
			api.fetch(
				`/user/${userId}/domains/${domainId}`, // Example endpoint
				{
					method: 'PUT',
					body: JSON.stringify({ role_id }),
					headers: { 'Content-Type': 'application/json' }
				},
				event
			)
		);

		if (fetchError || !response?.ok) {
			const errorData = response?.data;
			const message = errorData?.message || 'Failed to update role.';
			console.error('API Error Updating Role:', fetchError || response?.status, errorData);
			if (errorData?.error) setErrors(form, errorData.error);
			setFlash({ type: 'error', message: `Error: ${message}` }, cookies);
			return fail(response?.status === 422 ? 422 : 500, { updateForm: form });
		}

		setFlash({ type: 'success', message: 'Role updated successfully!' }, cookies);
		return { updateForm: form }; // Return form state on success
        // No redirect needed
	}
};
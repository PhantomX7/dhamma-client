<script>
	import { Modal, Button, Label, Select, Spinner } from 'flowbite-svelte';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { getContext } from 'svelte';

	// --- Props ---
	// Use $props() to declare and access component properties
	let { user, open = $bindable(false) } = $props();

	// Get current user context to check if superadmin
	const currentUser = getContext('user');
	const isSuperAdmin = $derived(currentUser()?.is_super_admin === true);

	// --- State ---
	let selectedDomainId = $state(null);
	let selectedRoleId = $state(null);
	let availableRoles = $state([]);
	let isLoading = $state(false);
	let errorMessage = $state('');

	// --- Derived State ---
	// Get user's domains safely from the user prop
	const userDomains = $state(user?.domains || []);

	// Filter out domains where the user already has all available roles assigned
	const availableDomains = $derived(
		userDomains.filter((domain) => {
			// If essential data is missing, assume domain is available
			// Access user prop directly
			if (!user?.user_roles || !domain?.roles) return true;

			// Get IDs of roles already assigned to the user in this specific domain
			// Access user prop directly
			const assignedRoleIds = user.user_roles
				.filter((ur) => ur.domain_id === domain.id)
				.map((ur) => ur.role_id);

			// Get IDs of all roles available within this domain
			const domainRoleIds = domain.roles.map((role) => role.id);

			// Domain is available if there's at least one role in it that the user doesn't have
			return domainRoleIds.some((roleId) => !assignedRoleIds.includes(roleId));
		})
	);

	// --- Functions ---

	/**
	 * Resets the modal's internal state to default values.
	 */
	function resetState() {
		selectedDomainId = null;
		selectedRoleId = null;
		availableRoles = [];
		isLoading = false;
		errorMessage = '';
	}

	/**
	 * Handles changes in the domain selection dropdown.
	 * Fetches available roles for the newly selected domain.
	 * @param {Event} event - The change event from the select element.
	 */
	async function handleDomainChange(event) {
		const domainId = parseInt(event.target.value);
		selectedDomainId = domainId;
		selectedRoleId = null; // Reset role selection when domain changes
		errorMessage = '';
		availableRoles = []; // Clear previous roles

		if (domainId) {
			await fetchRolesForDomain(domainId);
		}
	}

	/**
	 * Fetches available roles for a specific domain ID.
	 * @param {number} domainId - The domain ID to fetch roles for.
	 */
	async function fetchRolesForDomain(domainId) {
		isLoading = true;
		try {
			const params = new URLSearchParams();
			params.set('limit', '100');
			params.set('domain_id', `eq:${domainId}`);
			const response = await fetch(`/api/role?${params.toString()}`);
			if (!response.ok) {
				const errorData = await response.json().catch(() => ({})); // Try to get error details
				throw new Error(errorData.message || `Failed to fetch roles (status: ${response.status})`);
			}

			const data = await response.json();
			const rolesFromApi = data.data || []; // Adapt based on API response structure

			// Filter out roles already assigned to this user in this domain
			// Access user prop directly
			const assignedRoleIds =
				user.user_roles?.filter((ur) => ur.domain_id === domainId).map((ur) => ur.role_id) || [];

			availableRoles = rolesFromApi.filter((role) => !assignedRoleIds.includes(role.id));

			if (availableRoles.length === 0) {
				errorMessage = 'No assignable roles found for this domain.';
			}
		} catch (error) {
			console.error('Error fetching roles:', error);
			errorMessage = error.message || 'Failed to load roles. Please try again.';
			availableRoles = [];
		} finally {
			isLoading = false;
		}
	}

	/**
	 * Creates an enhancement function for the form submission.
	 * Handles success and error cases, invalidates data, and closes the modal.
	 * @returns {Function} The enhance callback function.
	 */
	function handleSubmit() {
		return async ({ result, update }) => {
			if (result.type === 'success') {
				await invalidateAll(); // Refresh data
				await update({ invalidateAll: true }); // Update UI
				closeModal(); // Close and reset
			} else if (result.type === 'failure') {
				// Use 'failure' for fail() results
				errorMessage = result.data?.error?.message || 'An error occurred while assigning the role.';
			} else if (result.type === 'error') {
				// Catch unexpected errors
				console.error('Form submission error:', result.error);
				errorMessage = 'An unexpected error occurred.';
			}
		};
	}

	/**
	 * Closes the modal and resets its state.
	 */
	function closeModal() {
		// Access showModal prop directly
		open = false;
		resetState();
	}

	/**
	 * Automatically load roles when modal opens for non-superadmin users
	 * using their first domain ID
	 */
	$effect(() => {
		if (open && !isSuperAdmin && currentUser()) {
			// For non-superadmin, automatically select their domain
			const user = currentUser();
			let domainId = null;

			// Try to get domain_id from user_roles first (most specific)
			if (user.user_roles && user.user_roles.length > 0) {
				domainId = user.user_roles[0].domain_id;
			}
			// Fallback to domains array if user_roles doesn't have domain_id
			else if (user.domains && user.domains.length > 0) {
				domainId = user.domains[0].id;
			}

			if (domainId) {
				selectedDomainId = domainId;
				fetchRolesForDomain(domainId);
			}
		}
	});
</script>

<form method="POST" action="?/assignRole" use:enhance={handleSubmit} class="space-y-6">
	<Modal
		bind:open
		size="md"
		autoclose={false}
		on:close={resetState}
		class="w-full"
		title="Assign Role Modal"
		closeBtnClass="cursor-pointer"
		footerClass="flex items-center justify-between space-x-2 border-t border-gray-200 pt-4 dark:border-gray-600"
	>
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Assign Role to User</h3>

		{#if errorMessage}
			<div
				role="alert"
				class="rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/10 dark:text-red-400"
			>
				{errorMessage}
			</div>
		{/if}

		<!-- Domain Selection - Only shown for superadmin users -->
		{#if isSuperAdmin}
			<div>
				<Label for="domain_id" class="mb-2 block">Select Domain</Label>
				<Select
					id="domain_id"
					name="domain_id"
					required
					value={selectedDomainId ?? ''}
					onchange={handleDomainChange}
					aria-label="Select Domain"
					placeholder="Select a domain"
				>
					{#each availableDomains as domain (domain.id)}
						<option value={domain.id}>{domain.name} ({domain.code})</option>
					{/each}
					{#if availableDomains.length === 0 && !isLoading}
						<option value="" disabled>No available domains with assignable roles</option>
					{/if}
				</Select>
			</div>
		{:else}
			<!-- Hidden domain_id field for non-superadmin users -->
			<input type="hidden" name="domain_id" value={selectedDomainId} />
		{/if}

		<!-- Role Selection -->
		<div>
			<Label for="role_id" class="mb-2 block">Select Role</Label>
			{#if isLoading}
				<div class="flex items-center justify-center py-4" aria-label="Loading roles...">
					<Spinner size="6" />
				</div>
			{:else}
				<Select
					id="role_id"
					name="role_id"
					required
					disabled={!selectedDomainId || availableRoles.length === 0}
					value={selectedRoleId ?? ''}
					onchange={(e) => (selectedRoleId = parseInt(e.target.value))}
					aria-label="Select Role"
					placeholder={selectedDomainId
						? availableRoles.length > 0
							? 'Choose a role...'
							: 'No available roles'
						: isSuperAdmin
							? 'Select a domain first'
							: 'Loading roles...'}
				>
					{#each availableRoles as role (role.id)}
						<option value={role.id}>{role.name}</option>
					{/each}
				</Select>
			{/if}
		</div>

		<!-- Hidden user ID field (Consider if needed, server action already has user context via params.id) -->
		<input type="hidden" name="role_id" value={selectedRoleId} />

		{#snippet footer()}
			<Button class="cursor-pointer" color="alternative" onclick={closeModal}
				>Cancel</Button
			>
			<Button
				type="submit"
				disabled={!selectedDomainId || !selectedRoleId || isLoading}
				aria-label="Assign selected role"
				class="cursor-pointer"
			>
				{#if isLoading}
					<Spinner class="me-2" size="4" /> Assigning...
				{:else}
					Assign Role
				{/if}
			</Button>
		{/snippet}
	</Modal>
</form>

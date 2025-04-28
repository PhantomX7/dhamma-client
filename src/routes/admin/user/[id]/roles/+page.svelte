<script>
	import {
		Alert,
		Button,
		Card,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Select,
		Modal,
		Label // Added Label
	} from 'flowbite-svelte';
	import {
		ExclamationCircleSolid,
		ListOutline,
		UserCircleOutline, // Added UserCircleOutline
		PlusOutline, // Added PlusOutline
		TrashOutline, // Added TrashOutline
		EditOutline // Added EditOutline
	} from 'flowbite-svelte-icons';
	import { superForm } from 'sveltekit-superforms/client';
	import { slide } from 'svelte/transition';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { FormSelect, FormButton } from '$lib/components/form'; // Import FormSelect

	// --- Component Props & State ---
	let { data } = $props();
	let { user, allDomains, allRoles, assignedDomains, assignedRolesMap } = $derived(data);

	// State for the assignment modal
	let showAssignModal = $state(false);

	// --- Forms ---
	// Form for assigning a new domain/role (inside modal)
	const {
		form: assignForm,
		errors: assignErrors,
		enhance: enhanceAssign,
		submitting: submittingAssign,
		delayed: delayedAssign,
		reset: resetAssignForm
	} = superForm(data.assignForm, {
		id: 'assign-form', // Unique ID for the form
		dataType: 'json',
		invalidateAll: true, // Re-run load on success/error
		applyAction: true, // Apply server action results
		resetForm: true, // Reset form on success
		onResult: ({ result }) => {
			if (result.type === 'success') {
				showAssignModal = false; // Close modal on successful assignment
			}
		}
	});

	// Form for inline role updates (we'll use enhance directly later)
	const {
		form: updateForm, // Not directly bound, used for enhance options
		errors: updateErrors, // Potentially display errors near the update select
		enhance: enhanceUpdate,
		submitting: submittingUpdate,
		delayed: delayedUpdate
	} = superForm(data.updateForm, {
		id: 'update-form', // Base ID, will need specifics per row
		dataType: 'json',
		invalidateAll: true,
		applyAction: true,
        resetForm: false // Don't reset the select on update
	});

    // Form for removal (we'll use enhance directly)
    const { enhance: enhanceRemove, submitting: submittingRemove } = superForm(null, {
        id: 'remove-form',
        dataType: 'json',
        invalidateAll: true,
        applyAction: true
    });


	// --- Computed Data ---
	// Options for the Role select dropdowns
	const roleOptions = $derived(
		allRoles.map((role) => ({ value: role.id.toString(), name: role.name })) ?? []
	);

	// Options for the Domain select dropdown (in modal) - exclude already assigned domains
	const availableDomainOptions = $derived(
		allDomains
			.filter((domain) => !assignedRolesMap[domain.id]) // Filter out domains already assigned
			.map((domain) => ({ value: domain.id.toString(), name: `${domain.name} (${domain.code})` })) ?? []
	);

	// Breadcrumb items
	const breadcrumbItems = $derived([
		{ href: '/admin/user', label: 'Users' },
		{ href: `/admin/user/${user.id}`, label: user.username },
		{ label: 'Manage Domain Roles' }
	]);

	// --- Functions ---
	/**
	 * Gets the name of a role by its ID.
	 * @param {number | string | undefined} roleId - The ID of the role.
	 * @returns {string} - The role name or 'N/A'.
	 */
	function getRoleName(roleId) {
		if (!roleId) return 'N/A';
		const role = allRoles.find((r) => r.id === parseInt(roleId.toString()));
		return role ? role.name : 'Unknown Role';
	}
</script>

<!-- Main Page Container -->
<div class="min-h-screen p-4 md:p-6 dark:bg-gray-900">
	<!-- Breadcrumb -->
	<Breadcrumb class="mb-6" items={breadcrumbItems} />

	<!-- Page Header -->
	<div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<div>
			<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Manage Domain Roles</h1>
			<p class="text-gray-600 dark:text-gray-400">User: {user.username}</p>
		</div>
		<div class="flex flex-shrink-0 gap-2">
			<Button onclick={() => (showAssignModal = true)}>
				<PlusOutline class="me-2 h-4 w-4" /> Assign to Domain
			</Button>
			<Button color="alternative" href={`/admin/user/${user.id}`}>
				<UserCircleOutline class="me-2 h-4 w-4" /> Back to User Details
			</Button>
			<Button color="light" href="/admin/user">
				<ListOutline class="me-2 h-4 w-4" /> Back to User List
			</Button>
		</div>
	</div>

	<!-- Assigned Domains Table Card -->
	<Card padding="lg">
		<h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
			Current Domain Assignments
		</h2>
		{#if assignedDomains.length > 0}
			<Table>
				<TableHead>
					<TableHeadCell>Domain Name</TableHeadCell>
					<TableHeadCell>Domain Code</TableHeadCell>
					<TableHeadCell>Assigned Role</TableHeadCell>
					<TableHeadCell>Actions</TableHeadCell>
				</TableHead>
				<TableBody>
					{#each assignedDomains as assignment (assignment.id)}
						{@const domainId = assignment.id}
						{@const currentRoleId = assignedRolesMap[domainId]}
						<TableBodyRow>
							<TableBodyCell>{assignment.name}</TableBodyCell>
							<TableBodyCell>{assignment.code}</TableBodyCell>
							<TableBodyCell>
                                <!-- Form for updating the role -->
                                <form method="POST" action="?/updateRole" use:enhanceUpdate>
                                    <input type="hidden" name="domain_id" value={domainId} />
                                    <Select
                                        name="role_id"
                                        items={roleOptions}
                                        value={currentRoleId?.toString()}
                                        placeholder="Select Role"
                                        class="min-w-[150px]"
                                        onchange={(e) => {
                                            // Automatically submit form on change
                                            e.currentTarget.form?.requestSubmit();
                                        }}
                                        disabled={submittingUpdate}
                                    />
                                    <!-- Display validation errors for this specific update -->
                                    {#if $updateErrors[`${domainId}_role_id`]}
                                        <p class="mt-1 text-xs text-red-500">{$updateErrors[`${domainId}_role_id`]}</p>
                                    {/if}
                                </form>
							</TableBodyCell>
							<TableBodyCell class="flex items-center space-x-2">
                                <!-- Form for removing the assignment -->
								<form method="POST" action="?/remove" use:enhanceRemove>
									<input type="hidden" name="domain_id" value={domainId} />
									<Button
										type="submit"
										color="red"
										size="xs"
										title="Remove Assignment"
                                        disabled={submittingRemove}
									>
										<TrashOutline class="h-4 w-4" />
									</Button>
								</form>
							</TableBodyCell>
						</TableBodyRow>
					{/each}
				</TableBody>
			</Table>
		{:else}
			<div
				class="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center dark:border-gray-600 dark:bg-gray-800"
			>
				<p class="text-gray-500 dark:text-gray-400">This user is not assigned to any domains yet.</p>
				<Button class="mt-4" size="sm" onclick={() => (showAssignModal = true)}>
					<PlusOutline class="me-2 h-4 w-4" /> Assign First Domain
				</Button>
			</div>
		{/if}
	</Card>

	<!-- Assign Domain/Role Modal -->
	<Modal title="Assign User to Domain" bind:open={showAssignModal} autoclose outsideclose>
		<form method="POST" action="?/assign" use:enhanceAssign class="space-y-4">
			<!-- General Form Errors Alert -->
			{#if $assignErrors._errors?.length}
				<Alert color="red" class="mb-4">
					<svelte:fragment slot="icon"><ExclamationCircleSolid class="h-5 w-5" /></svelte:fragment>
					<span class="font-medium">Please fix the following errors:</span>
					<ul class="mt-1.5 list-inside list-disc">
						{#each $assignErrors._errors as error}<li>{error}</li>{/each}
					</ul>
				</Alert>
			{/if}

			<!-- Domain Selection -->
			<div>
				<Label for="assign-domain_id" class="mb-2 block">Domain</Label>
				<FormSelect
					id="assign-domain_id"
					name="domain_id"
					items={availableDomainOptions}
					bind:value={$assignForm.domain_id}
					error={$assignErrors.domain_id?.join(', ')}
					required
					placeholder="-- Select Domain --"
					noneSelectedText="-- Select Domain --"
				/>
			</div>

			<!-- Role Selection -->
			<div>
				<Label for="assign-role_id" class="mb-2 block">Role</Label>
				<FormSelect
					id="assign-role_id"
					name="role_id"
					items={roleOptions}
					bind:value={$assignForm.role_id}
					error={$assignErrors.role_id?.join(', ')}
					required
					placeholder="-- Select Role --"
					noneSelectedText="-- Select Role --"
				/>
			</div>

			<!-- Modal Actions -->
			<div class="mt-6 flex justify-end space-x-2 border-t border-gray-200 pt-4 dark:border-gray-600">
				<Button type="button" color="alternative" onclick={() => (showAssignModal = false)}>
					Cancel
				</Button>
				<FormButton
					type="submit"
					loading={submittingAssign || delayedAssign}
					text="Assign"
					loadingText="Assigning..."
				/>
			</div>
		</form>
	</Modal>
</div>
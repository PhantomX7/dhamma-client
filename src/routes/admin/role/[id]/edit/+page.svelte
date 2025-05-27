<script>
	// Import necessary components and icons
	import { Button, Card } from 'flowbite-svelte'; // Removed Alert
	import { FileLinesOutline, ListOutline } from 'flowbite-svelte-icons'; // Removed InfoCircleSolid
	import { FormInput, FormTextarea, FormToggle, FormButton, ErrorAlert } from '$lib/components/form'; // Added ErrorAlert
	import { superForm } from 'sveltekit-superforms/client';
	import { Container } from '$lib/components/layout'; 

	// Component props
	let { data } = $props();
	const role = $derived(data.role); // Use $derived for reactivity

	// Initialize superForm for form handling
	const { form, enhance, errors, message, submitting, delayed } = superForm(data.form, {
		dataType: 'json',
		resetForm: false, // Keep form data after submission attempt
		multipleSubmits: 'prevent', // Prevent multiple rapid submissions
		taintedMessage: null, // Disable default tainted message
		invalidateAll: true, // Invalidate data on success/error to reflect changes
		applyAction: true // Apply server action results (errors, etc.)
	});

	// Define breadcrumb items dynamically
	const breadcrumbItems = $derived([
		{ href: '/admin/role', label: 'Roles' },
		{ href: `/admin/role/${role?.id}`, label: role?.name || 'Role Details' }, // Link back to details
		{ label: 'Edit' }
	]);
</script>

<!-- Use Container component -->
<Container
	breadcrumb={breadcrumbItems}
	title={`Edit Role: ${role?.name || ''}`}
>
	{#snippet headerActions()}
		<!-- Back buttons container, styled like the reference -->
		<div class="flex flex-shrink-0 gap-2">
			<Button color="light" href={`/admin/role/${role?.id}`}>
				<FileLinesOutline class="me-2 h-4 w-4" /> Back to Details
			</Button>
			<Button color="alternative" href="/admin/role">
				<ListOutline class="me-2 h-4 w-4" /> Back to List
			</Button>
		</div>
	{/snippet}

	<!-- Form Card -->
	<Card size="xl" class="mb-8 p-5">
		<!-- Form element with POST method and superForm enhancement -->
		<form method="POST" use:enhance class="space-y-6">

			<!-- Hidden input to store original data for change detection -->
			<input type="hidden" name="_original" bind:value={$form._original} />

			<!-- Enhanced Error Alert -->
			<ErrorAlert errors={$errors} />

			<!-- Form Fields using grid layout like the reference -->
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<!-- Name Input -->
				<div class="md:col-span-2"> 
					<FormInput
						label="Name"
						id="name"
						name="name"
						bind:value={$form.name}
						error={$errors.name?.join(', ')}
						required
						placeholder="Enter role name"
					/>
				</div>

				<!-- Description Textarea -->
				<div class="md:col-span-2">
					<FormTextarea
						label="Description"
						id="description"
						name="description"
						rows="4"
						bind:value={$form.description}
						error={$errors.description?.join(', ')}
						placeholder="Enter role description (optional)"
						helperText="Optional: Provide a brief description of the role."
					/>
				</div>

				<!-- Status Toggle -->
				<div class="md:col-span-2">
					<FormToggle
						label="Status"
						id="is_active"
						name="is_active"
						bind:value={$form.is_active}
						error={$errors.is_active?.join(', ')} 
						helperText="Inactive roles cannot be assigned." 
					/>
				</div>
			</div>

			<!-- Form Actions section, styled like the reference -->
			<div class="flex items-center justify-start gap-3 border-t border-gray-200 pt-6 dark:border-gray-700">
				<!-- Reusable FormButton for submission with loading state -->
				<FormButton
					type="submit"
					loading={$submitting || $delayed}
					text="Save Changes"
					loadingText="Saving..."
				/>
				<!-- Standard Cancel button linking back to details page -->
				<Button type="button" color="alternative" href={`/admin/role/${role?.id}`}>Cancel</Button>
			</div>
		</form>
	</Card>
</Container>
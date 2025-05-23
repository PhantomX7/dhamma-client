<script>
	// Import necessary components and icons
	import { Button, Alert, Card } from 'flowbite-svelte'; // Added Card
	import { InfoCircleSolid, FileLinesOutline, ListOutline } from 'flowbite-svelte-icons'; // Added Alert, InfoCircleSolid, FileLinesOutline, ListOutline
	import { FormInput, FormTextarea, FormToggle, FormButton } from '$lib/components/form';
	import { superForm } from 'sveltekit-superforms/client';
	import { Container } from '$lib/components/layout'; // Import Container

	// Component props
	let { data } = $props();
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
	const breadcrumbItems = [
		{ href: '/admin/role', label: 'Roles' },
		{ href: `/admin/role/${data.role.id}`, label: data.role.name }, // Link back to details
		{ label: 'Edit' }
	];
</script>

<!-- Use Container component -->
<Container breadcrumb={breadcrumbItems}>
	<!-- Page header section with responsive layout and spacing -->
	<div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<!-- Page title using h1 -->
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Edit Role: {data.role.name}</h1>
		<!-- Back buttons container, styled like the reference -->
		<div class="flex flex-shrink-0 gap-2">
			<Button color="light" href="/admin/role/{data.role.id}">
				<FileLinesOutline class="me-2 h-4 w-4" /> Back to Details
			</Button>
			<Button color="alternative" href="/admin/role">
				<ListOutline class="me-2 h-4 w-4" /> Back to List
			</Button>
		</div>
	</div>

	<!-- Form Card -->
	<Card size="xl" class="mb-8 p-5">
		<!-- Form element with POST method and superForm enhancement -->
		<form method="POST" use:enhance class="space-y-6">

			<!-- Hidden input to store original data for change detection -->
			<input type="hidden" name="_original" bind:value={$form._original} />

			<!-- General Form Errors Alert -->
			{#if $errors._errors}
				<Alert color="red" class="mb-4">
					<InfoCircleSolid slot="icon" class="h-5 w-5" />
					<span class="font-medium">Please fix the following errors:</span>
					<ul class="mt-1.5 list-inside list-disc">
						{#each $errors._errors as error}
							<li>{error}</li>
						{/each}
					</ul>
				</Alert>
			{/if}

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
				<Button type="button" color="alternative" href="/admin/role/{data.role.id}">Cancel</Button>
			</div>
		</form>
	</Card>
</Container>
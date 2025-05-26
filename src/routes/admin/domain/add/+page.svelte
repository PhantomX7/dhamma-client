<script>
	import { Button, Card } from 'flowbite-svelte'; // Removed Alert
	import { ListOutline } from 'flowbite-svelte-icons'; // Removed ExclamationCircleSolid
	import { superForm } from 'sveltekit-superforms/client';
	import { FormInput, FormTextarea, FormToggle, FormButton, ErrorAlert } from '$lib/components/form'; // Added ErrorAlert
	import { Container } from '$lib/components/layout';

	// Component props
	let { data } = $props();

	// Initialize SuperForm
	const { form, errors, enhance, submitting, delayed } = superForm(data.form, {
		resetForm: false, // Keep form data on success/error unless explicitly reset
		taintedMessage: null, // Disable default tainted message
		multipleSubmits: 'prevent', // Prevent multiple submissions while one is in progress
		dataType: 'json', // Expect JSON response from the server
		invalidateAll: true, // Invalidate data on success/error to reflect changes
		applyAction: true // Apply server action results (errors, etc.)
	});

	// Breadcrumb items definition
	const breadcrumbItems = [{ href: '/admin/domain', label: 'Domains' }, { label: 'Add Domain' }];
</script>

<Container breadcrumb={breadcrumbItems}>
	<!-- Page header section -->
	<div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Add New Domain</h1>
		<Button color="alternative" href="/admin/domain">
			<ListOutline class="me-2 h-4 w-4" /> Back to List
		</Button>
	</div>

	<!-- Use Card component as the form container -->
	<Card size="xl" class="mb-8 p-5">
		<form method="POST" use:enhance class="flex flex-col space-y-6">
			<!-- Enhanced Error Alert -->
			<ErrorAlert errors={$errors} />

			<!-- Form fields grid layout -->
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<FormInput
					label="Name"
					id="name"
					name="name"
					bind:value={$form.name}
					error={$errors.name?.join(', ')}
					required
					placeholder="e.g., abc.com"
				/>

				<FormInput
					label="Code"
					id="code"
					name="code"
					bind:value={$form.code}
					error={$errors.code?.join(', ')}
					required
					placeholder="e.g., abc"
					helperText="Unique identifier (domain code)"
				/>

				<div class="md:col-span-2">
					<FormTextarea
						label="Description"
						id="description"
						name="description"
						bind:value={$form.description}
						error={$errors.description?.join(', ')}
						placeholder="Optional: Provide a brief description of the domain."
						rows={3}
					/>
				</div>

				<div class="md:col-span-2">
					<FormToggle
						label="Status"
						id="is_active"
						name="is_active"
						bind:value={$form.is_active}
						error={$errors.is_active?.join(', ')}
						helperText="Inactive domains cannot be used."
					/>
					<!-- Removed the extra paragraph, helperText in FormToggle is sufficient -->
				</div>
			</div>

			<!-- Form actions section with border and padding -->
			<div
				class="flex items-center justify-start gap-3 border-t border-gray-200 pt-6 dark:border-gray-700"
			>
				<FormButton
					type="submit"
					loading={$submitting || $delayed}
					text="Create Domain"
					loadingText="Creating..."
				/>
				<Button type="button" color="alternative" href="/admin/domain">Cancel</Button>
			</div>
		</form>
	</Card>
</Container>

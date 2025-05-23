<script>
	import { Alert, Button, Card } from 'flowbite-svelte';
	import { ExclamationCircleSolid, ListOutline } from 'flowbite-svelte-icons';
	import { superForm } from 'sveltekit-superforms/client';
	// Import the new component and remove FormTextarea if no longer needed elsewhere
	import {
		FormInput,
		FormTextarea,
		FormToggle,
		FormButton,
		FormSearchSelect
	} from '$lib/components/form';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { getContext } from 'svelte';

	// Component props
	let { data } = $props();
	const currentUser = getContext('user');

	// Initialize SuperForm
	// Ensure the server load function initializes form with domain_id: null or appropriate default
	const { form, errors, enhance, submitting, delayed } = superForm(data.form, {
		resetForm: false, // Keep false or set to true depending on desired behavior after creation
		taintedMessage: null,
		multipleSubmits: 'prevent',
		dataType: 'json',
		invalidateAll: true, // Invalidate data on success/error to reflect changes
		applyAction: true // Apply server action results (errors, etc.)
	});

	// Breadcrumb items definition
	const breadcrumbItems = [{ href: '/admin/role', label: 'Roles' }, { label: 'Add Role' }];
</script>

<!-- Main page container -->
<div class="min-h-screen p-4 md:p-6 dark:bg-gray-900">
	<!-- Breadcrumb navigation -->
	<Breadcrumb class="mb-6" items={breadcrumbItems} />

	<!-- Page header -->
	<div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Add New Role</h1>
		<Button color="alternative" href="/admin/role">
			<ListOutline class="me-2 h-4 w-4" /> Back to List
		</Button>
	</div>

	<!-- Use Card component for the form container -->
	<Card size="xl" class="mb-8 p-5">
		<form method="POST" use:enhance class="flex flex-col space-y-6">
			<!-- General form errors display -->
			{#if $errors._errors}
				<Alert color="red" class="mb-0">
					<svelte:fragment slot="icon">
						<ExclamationCircleSolid class="h-5 w-5" />
					</svelte:fragment>
					<span class="font-medium">Please fix the following errors:</span>
					<ul class="mt-1.5 list-inside list-disc">
						{#each $errors._errors as error}
							<li>{error}</li>
						{/each}
					</ul>
				</Alert>
			{/if}

			<!-- Form fields grid layout -->
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<!-- Domain Selection -->
				{#if currentUser().is_super_admin}
					<div class="md:col-span-2">
						<FormSearchSelect
							label="Domain"
							id="domain_id"
							name="domain_id"
							bind:value={$form.domain_id}
							error={$errors.domain_id?.join(', ')}
							required
							placeholder="Click to select Domain"
							apiPath="/api/domain"
							searchParam="code"
							displayField="name"
							valueField="id"
							helperText="Select the domain this role belongs to."
						/>
					</div>
				{/if}

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
						bind:value={$form.description}
						error={$errors.description?.join(', ')}
						placeholder="Enter role description (optional)"
						rows={3}
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

			<!-- Form actions section with border and padding -->
			<div
				class="flex items-center justify-start gap-3 border-t border-gray-200 pt-6 dark:border-gray-700"
			>
				<FormButton
					type="submit"
					loading={$submitting || $delayed}
					text="Create Role"
					loadingText="Creating..."
				/>
				<Button type="button" color="alternative" href="/admin/role">Cancel</Button>
			</div>
		</form>
	</Card>
</div>

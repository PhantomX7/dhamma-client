<script>
	import { Button, Card } from 'flowbite-svelte';
	import { FileLinesOutline, ListOutline } from 'flowbite-svelte-icons';
	import { FormInput, FormTextarea, FormToggle, FormButton, ErrorAlert } from '$lib/components/form';
	import { superForm } from 'sveltekit-superforms/client';
	import { Container } from '$lib/components/layout';

	let { data } = $props();
	
	// Success toast state
	let showSuccessToast = $state(false);

	const { form, enhance, errors, submitting, delayed, message } = superForm(data.form, {
		dataType: 'json',
		resetForm: false,
		multipleSubmits: 'prevent',
	});

	// Define breadcrumb items
	const breadcrumbItems = [
		{ href: '/admin/domain', label: 'Domains' },
		{ href: `/admin/domain/${data.domain.id}`, label: data.domain.name },
		{ label: 'Edit' }
	];
</script>

<!-- Main page container -->
<Container breadcrumb={breadcrumbItems}>
	<!-- Page header -->
	<div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">
			Edit Domain: {data.domain.name}
		</h1>
		<div class="flex flex-shrink-0 gap-2">
			<Button color="light" href="/admin/domain/{data.domain.id}">
				<FileLinesOutline class="me-2 h-4 w-4" /> Back to Details
			</Button>
			<Button color="alternative" href="/admin/domain">
				<ListOutline class="me-2 h-4 w-4" /> Back to List
			</Button>
		</div>
	</div>

	<!-- Form Card -->
	<Card size="xl" class="mb-8 p-5">
		<form method="POST" use:enhance class="space-y-6">
			<!-- Hidden field to store original data for comparison -->
			<input type="hidden" name="_original" bind:value={$form._original} />

			<!-- Enhanced Error Alert -->
			<ErrorAlert errors={$errors} />

			<!-- Form Fields -->
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<FormInput
					label="Name"
					id="name"
					name="name"
					bind:value={$form.name}
					error={$errors.name?.join(', ')}
					required
				/>

				<FormInput
					label="Code"
					id="code"
					name="code"
					bind:value={$form.code}
					error={$errors.code?.join(', ')}
					required
				/>

				<div class="md:col-span-2">
					<FormTextarea
						label="Description"
						id="description"
						name="description"
						rows="4"
						bind:value={$form.description}
						error={$errors.description?.join(', ')}
						helperText="Optional: Provide a brief description of the domain."
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
				</div>
			</div>

			<!-- Form Actions -->
			<div class="flex items-center justify-start gap-3 border-t border-gray-200 pt-6 dark:border-gray-700">
				<FormButton
					type="submit"
					loading={$submitting || $delayed}
					text="Save Changes"
					loadingText="Saving..."
				/>
				<Button type="button" color="alternative" href="/admin/domain/{data.domain.id}">Cancel</Button>
			</div>
		</form>
	</Card>
</Container>

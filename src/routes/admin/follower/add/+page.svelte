<script>
	import { Alert, Button, Card } from 'flowbite-svelte';
	import { ExclamationCircleSolid, ListOutline } from 'flowbite-svelte-icons';
	import { superForm } from 'sveltekit-superforms/client';
	import { FormInput, FormToggle, FormButton, FormSearchSelect } from '$lib/components/form'; // Removed FormTextarea if not needed
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { getContext } from 'svelte';

	const currentUser = getContext('user');

	// Component props
	let { data } = $props();

	// Initialize SuperForm
	const { form, errors, enhance, submitting, delayed } = superForm(data.form, {
		resetForm: false,
		taintedMessage: null,
		multipleSubmits: 'prevent',
		dataType: 'json'
	});

	// Breadcrumb items definition
	const breadcrumbItems = [
		{ href: '/admin/follower', label: 'Followers' },
		{ label: 'Add Follower' }
	];
</script>

<!-- Main page container -->
<div class="min-h-screen p-4 md:p-6 dark:bg-gray-900">
	<!-- Breadcrumb navigation -->
	<Breadcrumb class="mb-6" items={breadcrumbItems} />

	<!-- Page header -->
	<div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Add New Follower</h1>
		<Button color="alternative" href="/admin/follower">
			<ListOutline class="me-2 h-4 w-4" /> Back to List
		</Button>
	</div>

	<!-- Form Card -->
	<Card size="xl" class="mb-8 p-5">
		<form method="POST" use:enhance class="flex flex-col space-y-6">
			{#if $errors._errors}
				<Alert color="red" class="mb-0">
					{#snippet icon()}
						<ExclamationCircleSolid class="h-5 w-5" />
					{/snippet}
					<span class="font-medium">Please fix the following errors:</span>
					<ul class="mt-1.5 list-inside list-disc">
						{#each $errors._errors as error}
							<li>{error}</li>
						{/each}
					</ul>
				</Alert>
			{/if}

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

				<FormInput
					label="Name"
					id="name"
					name="name"
					bind:value={$form.name}
					error={$errors.name?.join(', ')}
					required
					placeholder="e.g., John Doe"
				/>

				<FormInput
					label="Phone"
					id="phone"
					name="phone"
					bind:value={$form.phone}
					error={$errors.phone?.join(', ')}
					placeholder="e.g., 08123456789"
				/>

				<div class="md:col-span-1">
					<FormToggle
						label="Is Muda Mudi?"
						id="is_youth"
						name="is_youth"
						bind:value={$form.is_youth}
						error={$errors.is_youth?.join(', ')}
						helperText="Check if this follower is part of Muda Mudi."
					/>
				</div>
			</div>

			<div
				class="flex items-center justify-start gap-3 border-t border-gray-200 pt-6 dark:border-gray-700"
			>
				<FormButton
					type="submit"
					loading={$submitting || $delayed}
					text="Create Follower"
					loadingText="Creating..."
				/>
				<Button type="button" color="alternative" href="/admin/follower">Cancel</Button>
			</div>
		</form>
	</Card>
</div>

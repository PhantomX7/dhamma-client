<script>
	import { Alert, Button, Card } from 'flowbite-svelte';
	import { ExclamationCircleSolid, ListOutline } from 'flowbite-svelte-icons';
	import { superForm } from 'sveltekit-superforms/client';
	import { FormInput, FormTextarea, FormButton, FormSearchSelect } from '$lib/components/form';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { getContext } from 'svelte';

	const currentUser = getContext('user');

	// Component props
	let { data } = $props();

	// Initialize SuperForm
	const { form, errors, enhance, submitting, delayed, message } = superForm(data.form, {
		resetForm: true,
		taintedMessage: null,
		multipleSubmits: 'prevent',
		dataType: 'json',
		invalidateAll: false,
		applyAction: true
	});

	// Breadcrumb items definition
	const breadcrumbItems = $derived([
		{ href: '/admin/event', label: 'Events' },
		{ label: 'Add Event' }
	]);
</script>

<!-- Main page container -->
<div class="min-h-screen p-4 md:p-6 dark:bg-gray-900">
	<!-- Breadcrumb navigation -->
	<Breadcrumb class="mb-6" items={breadcrumbItems} />

	<!-- Page header -->
	<div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Add New Event</h1>
		<Button color="alternative" href="/admin/event">
			<ListOutline class="me-2 h-4 w-4" /> Back to List
		</Button>
	</div>

	<!-- Form Card -->
	<Card padding="lg" size="2xl" class="mb-8">
		<form method="POST" use:enhance class="flex flex-col space-y-6">
			{#if $message?.text}
				<Alert
					color={$message.type === 'error' ? 'red' : 'green'}
					dismissable
					class="items-center"
				>
					<svelte:fragment slot="icon">
						<ExclamationCircleSolid class="me-2 h-5 w-5 flex-shrink-0" />
					</svelte:fragment>
					<span class="text-sm">{$message.text}</span>
				</Alert>
			{/if}
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

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<!-- Domain Selection -->
				{#if currentUser()?.is_super_admin}
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
							helperText="Select the domain this event belongs to."
						/>
					</div>
				{:else if $form.domain_id}
					<input type="hidden" name="domain_id" bind:value={$form.domain_id} />
				{/if}

				<FormInput
					label="Event Name"
					id="name"
					name="name"
					bind:value={$form.name}
					error={$errors.name?.join(', ')}
					required
					placeholder="e.g., Vesak Day Celebration"
					class="md:col-span-2"
				/>

				<FormTextarea
					label="Description"
					id="description"
					name="description"
					bind:value={$form.description}
					error={$errors.description?.join(', ')}
					placeholder="Enter a description for the event (optional)"
					rows="4"
					class="md:col-span-2"
				/>

				<FormInput
					label="Points Awarded"
					id="points_awarded"
					name="points_awarded"
					type="number"
					bind:value={$form.points_awarded}
					error={$errors.points_awarded?.join(', ')}
					required
					min="0"
					placeholder="e.g., 10"
				/>
			</div>

			<div
				class="flex items-center justify-start gap-3 border-t border-gray-200 pt-6 dark:border-gray-700"
			>
				<FormButton
					type="submit"
					loading={$submitting || $delayed}
					text="Create Event"
					loadingText="Creating..."
				/>
				<Button type="button" color="alternative" href="/admin/event">Cancel</Button>
			</div>
		</form>
	</Card>
</div>
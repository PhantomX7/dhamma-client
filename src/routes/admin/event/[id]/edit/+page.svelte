<script>
	import { Button, Alert, Card } from 'flowbite-svelte';
	import { InfoCircleSolid, FileLinesOutline, ListOutline, ExclamationCircleSolid } from 'flowbite-svelte-icons';
	import { FormInput, FormTextarea, FormButton, FormSearchSelect } from '$lib/components/form';
	import { superForm } from 'sveltekit-superforms/client';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import { getContext } from 'svelte';

	const currentUser = getContext('user');

	let { data } = $props(); // Contains event and form from load function
	const eventDetails = $derived(data.event); // Original event data for display

	const { form, enhance, errors, submitting, delayed, message } = superForm(data.form, {
		dataType: 'json',
		resetForm: false, // Don't reset form on successful submit, redirect will occur
		multipleSubmits: 'prevent',
		taintedMessage: null, // Disable "are you sure?" for unsaved changes
		invalidateAll: false,
		applyAction: true
	});

	// Define breadcrumb items
	const breadcrumbItems = $derived([
		{ href: '/admin/event', label: 'Events' },
		{ href: `/admin/event/${eventDetails?.id}`, label: eventDetails?.name || 'Event' },
		{ label: 'Edit' }
	]);
</script>

<!-- Main page container -->
<div class="min-h-screen p-4 md:p-6 dark:bg-gray-900">
	<!-- Breadcrumb navigation -->
	<Breadcrumb class="mb-6" items={breadcrumbItems} />

	<!-- Page header -->
	<div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">
			Edit Event: {eventDetails?.name || ''}
		</h1>
		<div class="flex flex-shrink-0 gap-2">
			{#if eventDetails?.id}
			<Button color="light" href={`/admin/event/${eventDetails.id}`}>
				<FileLinesOutline class="me-2 h-4 w-4" /> Back to Details
			</Button>
			{/if}
			<Button color="alternative" href="/admin/event">
				<ListOutline class="me-2 h-4 w-4" /> Back to List
			</Button>
		</div>
	</div>

	<!-- Form Card -->
	<Card size="xl" class="mb-8 p-5">
		<form method="POST" use:enhance class="space-y-6">
			<input type="hidden" name="_original" bind:value={$form._original} />
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

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
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

			<div class="flex items-center justify-start gap-3 border-t border-gray-200 pt-6 dark:border-gray-700">
				<FormButton
					type="submit"
					loading={$submitting || $delayed}
					text="Save Changes"
					loadingText="Saving..."
				/>
				{#if eventDetails?.id}
				<Button type="button" color="alternative" href={`/admin/event/${eventDetails.id}`}>
					Cancel
				</Button>
				{/if}
			</div>
		</form>
	</Card>
</div>
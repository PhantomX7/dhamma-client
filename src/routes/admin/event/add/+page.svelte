<script>
	import { Button, Card } from 'flowbite-svelte'; // Removed Alert
	import { ListOutline } from 'flowbite-svelte-icons'; // Removed ExclamationCircleSolid
	import { superForm } from 'sveltekit-superforms/client';
	import { FormInput, FormTextarea, FormButton, FormSearchSelect, ErrorAlert } from '$lib/components/form'; // Added ErrorAlert
	import { Container } from '$lib/components/layout'; 
	import { getContext } from 'svelte';

	const currentUser = getContext('user');

	// Component props
	let { data } = $props();

	// Initialize SuperForm
	const { form, errors, enhance, submitting, delayed, message } = superForm(data.form, {
		resetForm: false,
		taintedMessage: null,
		multipleSubmits: 'prevent',
		dataType: 'json',
		invalidateAll: true,
		applyAction: true
	});

	// Breadcrumb items definition
	const breadcrumbItems = $derived([
		{ href: '/admin/event', label: 'Events' },
		{ label: 'Add Event' }
	]);
</script>

<!-- Use Container component -->
<Container breadcrumb={breadcrumbItems} title="Add New Event">
	{#snippet headerActions()}
		<Button color="alternative" href="/admin/event">
			<ListOutline class="me-2 h-4 w-4" /> Back to List
		</Button>
	{/snippet}

	<!-- Form Card -->
	<Card size="xl" class="mb-8 p-5">
		<form method="POST" use:enhance class="flex flex-col space-y-6">
			<!-- Enhanced Error Alert -->
			<ErrorAlert errors={$errors} />

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
</Container>
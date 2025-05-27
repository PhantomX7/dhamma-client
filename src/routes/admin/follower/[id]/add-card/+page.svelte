<script>
	import { Button, Card, Alert } from 'flowbite-svelte';
	import { ListOutline, ExclamationCircleSolid, ArrowLeftOutline } from 'flowbite-svelte-icons';
	import { superForm } from 'sveltekit-superforms/client';
	import { FormInput, FormButton } from '$lib/components/form'; // Removed Breadcrumb import
	import { Container } from '$lib/components/layout'; // Import Container

	let { data } = $props(); // Contains form, follower, followerId from load function
	const follower = $derived(data.follower);
	const followerId = $derived(data.followerId);

	// Initialize SuperForm for client-side form handling
	const { form, errors, enhance, submitting, delayed, message } = superForm(data.form, {
		resetForm: true, // Reset form fields on successful submission
		taintedMessage: null, // Disable "are you sure?" message for unsaved changes
		multipleSubmits: 'prevent', // Prevent multiple submissions
		dataType: 'json',
		invalidateAll: false, // Redirection on success will handle data refresh
		applyAction: true // Apply server action results to the form
	});

	// Define breadcrumb items for navigation
	const breadcrumbItems = $derived([
		{ href: '/admin/follower', label: 'Followers' },
		{
			href: `/admin/follower/${followerId}`,
			label: follower?.name || `Follower ${followerId}`
		},
		{ label: 'Add Card' }
	]);
</script>

<!-- Use Container component -->
<Container
	breadcrumb={breadcrumbItems}
	title={`Add New Card to ${follower?.name || `Follower ${followerId}`}`}
>
	{#snippet headerActions()}
		{#if followerId}
			<Button color="alternative" href={`/admin/follower/${followerId}`}>
				<ArrowLeftOutline class="me-2 h-4 w-4" />
				Back to Follower
			</Button>
		{/if}
	{/snippet}

	<Card size="xl" class="mb-8 p-4">
		<form method="POST" use:enhance class="space-y-6">
			<!-- Display server-set flash messages or form messages -->
			{#if $message?.text}
				<Alert color={$message.type === 'error' ? 'red' : 'green'} dismissable class="items-center">
					{#snippet icon()}
						<ExclamationCircleSolid class="me-2 h-5 w-5 flex-shrink-0" />
					{/snippet}
					<span class="text-sm">{$message.text}</span>
				</Alert>
			{/if}

			<!-- Card Code Input -->
			<FormInput
				bind:value={$form.code}
				name="code"
				label="Card Code"
				placeholder="Enter the card code (e.g., XYZ123)"
				required={true}
				error={$errors.code?.join(', ')}
				autocomplete="off"
			/>

			<div class="flex items-center justify-end space-x-3 pt-2">
				{#if followerId}
					<Button type="button" color="alternative" href={`/admin/follower/${followerId}`}>
						Cancel
					</Button>
				{/if}
				<FormButton
					type="submit"
					loading={$submitting || $delayed}
					text="Add Card"
					loadingText="Adding..."
				/>
			</div>
		</form>
	</Card>
</Container>

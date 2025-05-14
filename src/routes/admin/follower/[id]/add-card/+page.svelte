<script>
	import { Button, Card, Alert } from 'flowbite-svelte';
	import { ListOutline, ExclamationCircleSolid, ArrowLeftOutline } from 'flowbite-svelte-icons';
	import { superForm } from 'sveltekit-superforms/client';
	import { FormInput, FormButton } from '$lib/components/form';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

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

<div class="min-h-screen p-4 md:p-6 dark:bg-gray-900">
	<Breadcrumb class="mb-6" items={breadcrumbItems} />

	<div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">
			Add New Card to {follower?.name || `Follower ${followerId}`}
		</h1>
		{#if followerId}
			<Button color="alternative" href="/admin/follower/{followerId}">
				<ArrowLeftOutline class="me-2 h-4 w-4" />
				Back to Follower
			</Button>
		{/if}
	</div>

	<Card padding="lg" size="xl" class="mb-8">
		<form method="POST" use:enhance class="space-y-6">
			<!-- Display server-set flash messages or form messages -->
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

			<!-- Card Code Input -->
			<FormInput
				bind:value={$form.code}
				name="code"
				label="Card Code"
				placeholder="Enter the card code (e.g., XYZ123)"
				required={true}
				errors={$errors.code}
				autocomplete="off"
			/>

			<div class="flex items-center justify-end space-x-3 pt-2">
				{#if followerId}
					<Button type="button" color="alternative" href="/admin/follower/{followerId}">
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
</div>
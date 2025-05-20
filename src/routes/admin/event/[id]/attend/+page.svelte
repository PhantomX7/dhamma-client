<script>
	import { Button, Card, Alert } from 'flowbite-svelte';
	import { ArrowLeftOutline, ExclamationCircleSolid, CheckCircleSolid } from 'flowbite-svelte-icons';
	import { superForm } from 'sveltekit-superforms/client';
	import { FormInput, FormButton } from '$lib/components/form';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	// Component props
	let { data } = $props();
	const eventDetails = $derived(data.event);
	const eventId = $derived(data.eventId);

	// Initialize SuperForm for client-side form handling
	const { form, errors, enhance, submitting, delayed, message } = superForm(data.form, {
		resetForm: true, // Reset form on successful submission if staying on page
		taintedMessage: null,
		multipleSubmits: 'prevent',
		dataType: 'json',
		invalidateAll: false, // Redirection or specific invalidation will handle data refresh
		applyAction: true
	});

	// Breadcrumb items
	const breadcrumbItems = $derived([
		{ href: '/admin/event', label: 'Events' },
		{
			href: `/admin/event/${eventId}`,
			label: eventDetails?.name || `Event ${eventId}`
		},
		{ label: 'Attend' }
	]);

	// Reactive effect to clear form message after a delay if it's a success message
	$effect(() => {
		if ($message?.type === 'success' && $message?.text) {
			const timer = setTimeout(() => {
				message.set(null); // Clear the message
			}, 3000); // Clear after 3 seconds
			return () => clearTimeout(timer); // Cleanup timer
		}
	});
</script>

<div class="min-h-screen p-4 md:p-6 dark:bg-gray-900">
	<Breadcrumb class="mb-6" items={breadcrumbItems} />

	<div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">
			Record Attendance for: {eventDetails?.name || 'Event'}
		</h1>
		{#if eventId}
			<Button color="alternative" href={`/admin/event/${eventId}`}>
				<ArrowLeftOutline class="me-2 h-4 w-4" />
				Back to Event Details
			</Button>
		{/if}
	</div>

	<Card padding="lg" size="xl" class="mb-8 max-w-2xl mx-auto">
		<form method="POST" use:enhance class="space-y-6">
			<!-- Display server-set flash messages or form messages -->
			{#if $message?.text}
				<Alert
					color={$message.type === 'error' ? 'red' : 'green'}
					dismissable
					onclose={() => message.set(null)}
					class="items-center"
				>
					<svelte:fragment slot="icon">
						{#if $message.type === 'error'}
							<ExclamationCircleSolid class="me-2 h-5 w-5 flex-shrink-0" />
						{:else}
							<CheckCircleSolid class="me-2 h-5 w-5 flex-shrink-0" />
						{/if}
					</svelte:fragment>
					<span class="text-sm">{$message.text}</span>
				</Alert>
			{/if}

			<!-- Card Code Input -->
			<FormInput
				bind:value={$form.card_code}
				name="card_code"
				label="Follower Card Code"
				placeholder="Enter the follower's card code"
				required={true}
                error={$errors.card_code?.join(', ')}
				autocomplete="off"
				autofocus
			/>

			<div class="flex items-center justify-end space-x-3 pt-2">
				{#if eventId}
					<Button type="button" color="alternative" href={`/admin/event/${eventId}`}>
						Cancel
					</Button>
				{/if}
				<FormButton
					type="submit"
					loading={$submitting || $delayed}
					text="Submit Attendance"
					loadingText="Submitting..."
				/>
			</div>
		</form>
	</Card>
</div>
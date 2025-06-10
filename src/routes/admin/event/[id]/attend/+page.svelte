<script>
	import { onMount } from 'svelte';
	import { Button, Card, Alert } from 'flowbite-svelte';
	import {
		ArrowLeftOutline,
		ExclamationCircleSolid,
		CheckCircleSolid,
		UserAddOutline
	} from 'flowbite-svelte-icons';
	import { superForm } from 'sveltekit-superforms/client';
	import { FormInput, FormButton } from '$lib/components/form';
	import { Container } from '$lib/components/layout';
	import ManualAttendModal from '$lib/components/modal/ManualAttendModal.svelte';

	// Component props
	let { data } = $props();
	const event = $derived(data.event);
	const eventId = $derived(data.event.id);

	// Force focus variables
	let shouldMaintainFocus = $state(true);

	let scanButtonElement;

	// Modal state
	let isManualAttendModalOpen = $state(false);

	// Initialize SuperForm for client-side form handling
	const { form, errors, enhance, submitting, delayed, message, submit } = superForm(data.form, {
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
			label: event?.name || `Event ${eventId}`
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

	// Auto-submit functionality for RFID scanner
	let debounceTimer;

	/**
	 * Handles input changes and auto-submits after typing stops
	 * @param {Event} e - The input event
	 */
	function handleCardCodeInput(e) {
		// Clear any existing timer
		if (debounceTimer) clearTimeout(debounceTimer);

		// Set a new timer to submit the form after typing stops
		debounceTimer = setTimeout(() => {
			const value = e.target.value.trim();
			if (value && !$submitting && !$delayed) {
				submit(scanButtonElement); // Submit the form
			}
		}, 500); // 500ms delay - adjust if needed for your RFID scanner
	}

	let elementRef = $state();

	// Force focus event handlers
	function handleBlur() {
		if (shouldMaintainFocus && elementRef) {
			setTimeout(() => {
				elementRef?.focus();
			}, 0);
		}
	}

	function handleDocumentClick(e) {
		// Only refocus if not clicking on interactive elements
		if (
			shouldMaintainFocus &&
			elementRef &&
			!e.target.matches(
				'button, a, select, input, textarea, [tabindex], [role="button"], .alert button'
			)
		) {
			setTimeout(() => {
				elementRef?.focus();
			}, 0);
		}
	}

	// Effect to focus the input when the component mounts and manage force focus
	$effect(() => {
		if (elementRef && typeof document !== 'undefined') {
			// Initial focus
			if (document.activeElement !== elementRef) {
				elementRef.focus();
			}

			// Add blur event listener to the input element
			elementRef.addEventListener('blur', handleBlur);

			// Cleanup function
			return () => {
				if (elementRef) {
					elementRef.removeEventListener('blur', handleBlur);
				}
			};
		}
	});

	// Mount effect for document click listener
	onMount(() => {
		document.addEventListener('click', handleDocumentClick);

		return () => {
			document.removeEventListener('click', handleDocumentClick);
		};
	});

	// Form submission handler with data refresh
	function handleSubmit() {
		return async ({ result, update }) => {
			if (result.type === 'success') {
				await invalidateAll();
				await update({ invalidateAll: true });
				isManualAttendModalOpen = false;
			}
		};
	}
</script>

<Container breadcrumb={breadcrumbItems} title={`Record Attendance for: ${event?.name || 'Event'}`}>
	{#snippet headerActions()}
		<div class="flex gap-2">
			<Button color="green" onclick={() => (isManualAttendModalOpen = true)}>
				<UserAddOutline class="me-2 h-4 w-4" />
				Manual Attend
			</Button>
			<Button color="alternative" href={`/admin/event/${eventId}`}>
				<ArrowLeftOutline class="me-2 h-4 w-4" />
				Back to Event Details
			</Button>
		</div>
	{/snippet}

	<Card size="xl" class="mb-8 p-4">
		<form method="POST" use:enhance class="space-y-6">
			<!-- Display server-set flash messages or form messages -->
			{#if $message?.text}
				<Alert
					color={$message.type === 'error' ? 'red' : 'green'}
					dismissable
					onclose={() => message.set(null)}
					class="items-center"
				>
					{#snippet icon()}
						{#if $message.type === 'error'}
							<ExclamationCircleSolid class="me-2 h-5 w-5 flex-shrink-0" />
						{:else}
							<CheckCircleSolid class="me-2 h-5 w-5 flex-shrink-0" />
						{/if}
					{/snippet}
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
				oninput={handleCardCodeInput}
				bind:elementRef
			/>

			<button
				type="submit"
				bind:this={scanButtonElement}
				formaction="?/attend"
				class="hidden"
				aria-hidden="true"
			>
				Scan Submit
			</button>

			<div class="flex items-center justify-end space-x-3 pt-2">
				<Button
					color={shouldMaintainFocus ? 'red' : 'green'}
					onclick={() => (shouldMaintainFocus = !shouldMaintainFocus)}
					size="sm"
				>
					Force Focus: {shouldMaintainFocus ? 'ON' : 'OFF'}
				</Button>
				<Button type="button" color="alternative" href={`/admin/event/${eventId}`}>Cancel</Button>
			</div>
		</form>
	</Card>

	<!-- Manual Attendance Modal -->
	<ManualAttendModal
		bind:open={isManualAttendModalOpen}
		{eventId}
		domainId={event.domain.id}
		{handleSubmit}
	/>
</Container>

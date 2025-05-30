<script>
	import { Button, Card } from 'flowbite-svelte';
	import { FileLinesOutline, ListOutline } from 'flowbite-svelte-icons';
	import {
		FormInput,
		FormTextarea,
		FormToggle,
		FormButton,
		FormSearchSelect,
		ErrorAlert
	} from '$lib/components/form';
	import { superForm } from 'sveltekit-superforms/client';
	import { Container } from '$lib/components/layout';
	import { getContext } from 'svelte';

	const currentUser = getContext('user');

	let { data } = $props();
	const chatTemplate = $derived(data.chatTemplate);

	// Derived state for showing domain select
	const showDomainSelect = $derived(currentUser().is_super_admin && data.tenant === 'main');

	const { form, enhance, errors, submitting, delayed } = superForm(data.form, {
		dataType: 'json',
		resetForm: false,
		multipleSubmits: 'prevent',
		taintedMessage: null
	});

	// Define breadcrumb items
	const breadcrumbItems = $derived([
		{ href: '/admin/chat-template', label: 'Chat Templates' },
		{
			href: `/admin/chat-template/${chatTemplate?.id}`,
			label: chatTemplate?.name || 'Template Details'
		},
		{ label: 'Edit' }
	]);
</script>

<!-- Use Container component -->
<Container breadcrumb={breadcrumbItems} title={`Edit Chat Template: ${chatTemplate?.name || ''}`}>
	{#snippet headerActions()}
		<div class="flex flex-shrink-0 gap-2">
			<Button color="light" href={`/admin/chat-template/${chatTemplate?.id}`}>
				<FileLinesOutline class="me-2 h-4 w-4" /> Back to Details
			</Button>
			<Button color="alternative" href="/admin/chat-template">
				<ListOutline class="me-2 h-4 w-4" /> Back to List
			</Button>
		</div>
	{/snippet}

	<Card size="xl" class="p-6">
		<form method="POST" use:enhance class="space-y-6">
			<!-- Enhanced Error Alert -->
			<ErrorAlert errors={$errors} />

			<!-- Form Fields -->
			<div class="grid gap-6 md:grid-cols-2">
				<!-- Template Name -->
				<FormInput
					label="Template Name"
					name="name"
					bind:value={$form.name}
					error={$errors.name}
					required
					placeholder="Enter template name"
				/>
			</div>

			<!-- Description -->
			<FormTextarea
				label="Description"
				name="description"
				bind:value={$form.description}
				error={$errors.description}
				placeholder="Enter template description (optional)"
				rows={3}
			/>

			<!-- Template Content -->
			<FormTextarea
				label="Template Content"
				name="content"
				bind:value={$form.content}
				error={$errors.content}
				required
				placeholder="Enter the chat template content"
				rows={8}
			/>

			<!-- Active Status -->
			<div class="md:col-span-2">
				<FormToggle
					label="Active Status"
					name="is_active"
					bind:value={$form.is_active}
					helperText="Enable this template for use in chat applications"
					error={$errors.is_active}
				/>
			</div>

			<!-- Set Default Status -->
			<div class="md:col-span-2">
				<FormToggle
					label="Set as Default"
					name="is_default"
					bind:value={$form.is_default}
					helperText="Set this template as the default for new chats"
					error={$errors.is_default}
				/>
			</div>

			<!-- Submit Button -->
			<div class="flex justify-end space-x-4">
				<Button color="alternative" href={`/admin/chat-template/${chatTemplate?.id}`}>
					Cancel
				</Button>
				<FormButton {submitting} {delayed}>Update Template</FormButton>
			</div>
		</form>
	</Card>
</Container>

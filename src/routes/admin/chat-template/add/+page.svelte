<script>
	import { Button, Card } from 'flowbite-svelte';
	import { ListOutline } from 'flowbite-svelte-icons';
	import { superForm } from 'sveltekit-superforms/client';
	import {
		FormInput,
		FormTextarea,
		FormToggle,
		FormButton,
		FormSearchSelect,
		ErrorAlert
	} from '$lib/components/form';
	import { Container } from '$lib/components/layout';
	import { getContext } from 'svelte';

	// Component props
	let { data } = $props();
	const currentUser = getContext('user');

	// Derived state for showing domain select
	const showDomainSelect = $derived(data.tenant === 'main');

	// Initialize SuperForm
	const { form, errors, enhance, submitting, delayed } = superForm(data.form, {
		resetForm: false,
		taintedMessage: null,
		multipleSubmits: 'prevent',
		dataType: 'json',
		invalidateAll: true,
		applyAction: true
	});

	// Breadcrumb items definition
	const breadcrumbItems = $derived([
		{ href: '/admin/chat-template', label: 'Chat Templates' },
		{ label: 'Add Template' }
	]);
</script>

<!-- Use Container component -->
<Container breadcrumb={breadcrumbItems} title="Add New Chat Template">
	{#snippet headerActions()}
		<Button color="alternative" href="/admin/chat-template">
			<ListOutline class="me-2 h-4 w-4" /> Back to List
		</Button>
	{/snippet}

	<!-- Use Card component for the form container -->
	<Card size="xl" class="mb-8 p-5">
		<form method="POST" use:enhance class="flex flex-col space-y-6">
			<!-- Enhanced Error Alert -->
			<ErrorAlert errors={$errors} />

			<!-- Form Fields -->
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<!-- Domain Selection (conditional) -->
				{#if showDomainSelect}
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
							helperText="Select the domain this chat template belongs to."
						/>
					</div>
				{:else}
					<!-- Hidden input for domain_id when not showing select -->
					<input type="hidden" name="domain_id" bind:value={$form.domain_id} />
				{/if}

				<!-- Template Name -->
				<FormInput
					label="Template Name"
					name="name"
					bind:value={$form.name}
					placeholder="Enter template name"
					helperText="A descriptive name for the chat template"
					error={$errors.name}
					required
				/>

				<!-- Description -->
				<div class="md:col-span-2">
					<FormTextarea
						label="Description"
						name="description"
						bind:value={$form.description}
						placeholder="Enter a brief description of the template"
						helperText="Optional description explaining the purpose of this template"
						error={$errors.description}
						rows={3}
					/>
				</div>

				<!-- Template Content -->
				<div class="md:col-span-2">
					<FormTextarea
						label="Template Content"
						name="content"
						bind:value={$form.content}
						placeholder="Enter the chat template content here..."
						helperText="The actual message content that will be used in chats. You can use variables like {'{name}'}, {'{date}'}, etc."
						error={$errors.content}
						rows={8}
						required
					/>
				</div>
				

				<!-- Active Status -->
				<div class="md:col-span-2">
					<FormToggle
						label="Active Status"
						name="is_active"
						bind:checked={$form.is_active}
						helperText="Enable this template for use in chat applications"
						error={$errors.is_active}
					/>
				</div>

				<!-- Set Default Status -->
				<div class="md:col-span-2">
					<FormToggle
						label="Set as Default"
						name="is_default"
						bind:checked={$form.is_default}
						helperText="Set this template as the default for new chats"
						error={$errors.is_default}
					/>
				</div>
			</div>

			<!-- Submit Button -->
			<div class="flex justify-end">
				<FormButton
					type="submit"
					loading={$submitting}
					delayed={$delayed}
					loadingText="Creating Template..."
				>
					Create Chat Template
				</FormButton>
			</div>
		</form>
	</Card>
</Container>

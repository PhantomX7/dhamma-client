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
		{ href: '/admin/role', label: 'Roles' },
		{ label: 'Add Role' }
	]);
</script>

<!-- Use Container component -->
<Container breadcrumb={breadcrumbItems} title="Add New Role">
	{#snippet headerActions()}
		<Button color="alternative" href="/admin/role">
			<ListOutline class="me-2 h-4 w-4" /> Back to List
		</Button>
	{/snippet}

	<!-- Use Card component for the form container -->
	<Card size="xl" class="mb-8 p-5">
		<form method="POST" use:enhance class="flex flex-col space-y-6">
			<!-- Enhanced Error Alert -->
			<ErrorAlert errors={$errors} />

			<!-- Form fields grid layout -->
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<!-- Domain Selection -->
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
							helperText="Select the domain this role belongs to."
						/>
					</div>
				{:else}
					<input type="hidden" name="domain_id" bind:value={$form.domain_id} />
				{/if}

				<!-- Name Input -->
				<div class="md:col-span-2">
					<FormInput
						label="Name"
						id="name"
						name="name"
						bind:value={$form.name}
						error={$errors.name?.join(', ')}
						required
						placeholder="Enter role name"
					/>
				</div>

				<!-- Description Textarea -->
				<div class="md:col-span-2">
					<FormTextarea
						label="Description"
						id="description"
						name="description"
						bind:value={$form.description}
						error={$errors.description?.join(', ')}
						placeholder="Enter role description (optional)"
						rows={3}
						helperText="Optional: Provide a brief description of the role."
					/>
				</div>

				<!-- Status Toggle -->
				<div class="md:col-span-2">
					<FormToggle
						label="Status"
						id="is_active"
						name="is_active"
						bind:value={$form.is_active}
						error={$errors.is_active?.join(', ')}
						helperText="Inactive roles cannot be assigned."
					/>
				</div>
			</div>

			<!-- Form actions section with border and padding -->
			<div
				class="flex items-center justify-start gap-3 border-t border-gray-200 pt-6 dark:border-gray-700"
			>
				<FormButton
					type="submit"
					loading={$submitting || $delayed}
					text="Create Role"
					loadingText="Creating..."
				/>
				<Button type="button" color="alternative" href="/admin/role">Cancel</Button>
			</div>
		</form>
	</Card>
</Container>

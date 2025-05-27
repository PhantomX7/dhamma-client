<script>
	import { Button, Card } from 'flowbite-svelte'; // Removed Alert
	import { ListOutline } from 'flowbite-svelte-icons'; // Removed ExclamationCircleSolid
	import { superForm } from 'sveltekit-superforms/client';
	import {
		FormInput,
		FormButton,
		ErrorAlert // Added ErrorAlert
	} from '$lib/components/form';
	import { Container } from '$lib/components/layout'; 

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
	const breadcrumbItems = $derived([{ href: '/admin/user', label: 'Users' }, { label: 'Add User' }]);
</script>

<!-- Main page container -->
<!-- Use Container component -->
<Container breadcrumb={breadcrumbItems} title="Add New User">
	{#snippet headerActions()}
		<Button color="alternative" href="/admin/user">
			<ListOutline class="me-2 h-4 w-4" />
			Back to List
		</Button>
	{/snippet}

	<!-- Use Card component for the form container -->
	<Card size="xl" class="mb-8 p-5">
		<form method="POST" use:enhance class="space-y-6">
			<!-- Enhanced Error Alert -->
			<ErrorAlert errors={$errors} />

			<!-- Form Fields (Simplified) -->
			<div class="space-y-4">
				<!-- Username -->
				<FormInput
					label="Username"
					id="username"
					name="username"
					bind:value={$form.username}
					error={$errors.username?.join(', ')}
					required
					placeholder="Enter username"
				/>

				<!-- Password -->
				<FormInput
					label="Password"
					type="password"
					id="password"
					name="password"
					bind:value={$form.password}
					error={$errors.password?.join(', ')}
					required
					placeholder="••••••••"
					helperText="Must be at least 8 characters."
				/>
			</div>

			<!-- Form Actions -->
			<div class="flex items-center justify-start gap-3 border-t border-gray-200 pt-6 dark:border-gray-700">
				<FormButton
					type="submit"
					loading={$submitting || $delayed}
					text="Create User"
					loadingText="Creating..."
				/>
				<Button type="button" color="alternative" href="/admin/user">Cancel</Button>
			</div>
		</form>
	</Card>
</Container>
<script>
	import { Alert, Button, Card } from 'flowbite-svelte';
	import { ExclamationCircleSolid, ListOutline } from 'flowbite-svelte-icons';
	import { superForm } from 'sveltekit-superforms/client';
	import {
		FormInput,
		FormButton
	} from '$lib/components/form';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	// Component props
	let { data } = $props();

	// Initialize SuperForm
	const { form, errors, enhance, submitting, delayed, message } = superForm(data.form, {
		resetForm: false,
		taintedMessage: null,
		multipleSubmits: 'prevent',
		dataType: 'json',
		invalidateAll: false,
		applyAction: true
	});

	// Breadcrumb items definition
	const breadcrumbItems = [{ href: '/admin/user', label: 'Users' }, { label: 'Add User' }];
</script>

<!-- Main page container -->
<div class="min-h-screen p-4 md:p-6 dark:bg-gray-900">
	<!-- Breadcrumb navigation -->
	<Breadcrumb class="mb-6" items={breadcrumbItems} />

	<!-- Page header -->
	<div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Add New User</h1>
		<Button color="alternative" href="/admin/user">
			<ListOutline class="me-2 h-4 w-4" />
			Back to List
		</Button>
	</div>

	<!-- Use Card component for the form container -->
	<Card padding="lg" size="2xl" class="mb-8">
		<form method="POST" use:enhance class="space-y-6">
			<!-- General Form Errors Alert -->
			{#if $errors._errors?.length}
				<Alert color="red" class="mb-0">
					<svelte:fragment slot="icon">
						<ExclamationCircleSolid class="h-5 w-5" />
					</svelte:fragment>
					<span class="font-medium">Please fix the following errors:</span>
					<ul class="mt-1.5 list-inside list-disc">
						{#each $errors._errors as error}
							<li>{error}</li>
						{/each}
					</ul>
				</Alert>
			{/if}

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
</div>
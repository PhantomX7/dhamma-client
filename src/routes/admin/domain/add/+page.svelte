<script>
	import { Alert, Button } from 'flowbite-svelte';
	import { ExclamationCircleSolid } from 'flowbite-svelte-icons';
	import { superForm } from 'sveltekit-superforms/client';
	import { FormInput, FormTextarea, FormToggle, FormButton } from '$lib/components/form';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	let { data } = $props();

	const { form, errors, enhance, submitting, delayed, tainted } = superForm(data.form, {
		resetForm: false,
		taintedMessage: null,
		multipleSubmits: 'prevent',
		dataType: 'json'
	});

	const breadcrumbItems = [{ href: '/admin/domain', label: 'Domains' }, { label: 'Add Domain' }];
</script>

<div class="p-4">
	<Breadcrumb items={breadcrumbItems} />

	<div class="mb-6 flex items-center justify-between">
		<h2 class="text-xl font-bold">Add New Domain</h2>
		<Button color="light" href="/admin/domain">Back to List</Button>
	</div>

	<div class="rounded-lg border bg-white p-6 shadow-sm">
		<form method="POST" use:enhance>
			{#if $errors._errors}
				<Alert color="red" class="mb-4">
					<svelte:fragment slot="icon">
						<ExclamationCircleSolid class="h-4 w-4" />
					</svelte:fragment>
					<p class="font-medium">Please fix the following errors:</p>
					<ul class="mt-1 list-inside list-disc">
						{#each $errors._errors as error}
							<li>{error}</li>
						{/each}
					</ul>
				</Alert>
			{/if}

			<div class="mb-6 space-y-6">
				<div>
					<FormInput
						label="Name"
						name="name"
						bind:value={$form.name}
						error={$errors.name}
						required
						placeholder="Enter domain name"
					/>
				</div>

				<div>
					<FormInput
						label="Code"
						name="code"
						bind:value={$form.code}
						error={$errors.code}
						required
						placeholder="Enter domain code"
					/>
				</div>

				<div>
					<FormTextarea
						label="Description"
						name="description"
						bind:value={$form.description}
						error={$errors.description}
						placeholder="Enter domain description"
					/>
				</div>

				<div>
					<FormToggle
						label="Status"
						name="is_active"
						bind:value={$form.is_active}
						error={$errors.is_active?.join(', ')}
					/>
					<p class="mt-1 text-sm text-gray-500">
						{$form.is_active
							? 'Domain is active and available for use'
							: 'Domain is inactive and unavailable'}
					</p>
				</div>
			</div>

			<div class="flex gap-2 border-t pt-4">
				<FormButton
					type="submit"
					loading={$submitting || $delayed}
					text={$submitting ? 'Creating...' : 'Create Domain'}
				/>
				<Button type="button" color="light" href="/admin/domain">Cancel</Button>
			</div>
		</form>
	</div>
</div>

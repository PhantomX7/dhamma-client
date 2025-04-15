<script>
	import { Button, Alert } from 'flowbite-svelte';
	import { FormInput, FormTextarea, FormToggle, FormButton } from '$lib/components/form';
	import { superForm } from 'sveltekit-superforms/client';
	import { ExclamationCircleSolid, HomeSolid, ChevronDoubleRightOutline } from 'flowbite-svelte-icons';
	import { fade } from 'svelte/transition';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	let { data } = $props();
	const { form, enhance, errors, message, submitting, delayed, tainted } = superForm(data.form, {
		dataType: 'json',
		multipleSubmits: 'prevent',
		taintedMessage: null
	});

	const breadcrumbItems = [
		{ href: '/admin/domain', label: 'Domains' },
		{ href: `/admin/domain/${data.domain.id}`, label: data.domain.name },
		{ label: 'Edit' }
	];
</script>

<!-- Breadcrumb navigation -->
<div class="p-4">
	<Breadcrumb items={breadcrumbItems} />
	<div class="mb-6 flex items-center justify-between">
		<h2 class="text-xl font-bold">Edit Domain</h2>
		<div class="flex gap-2">
			<Button color="light" href="/admin/domain/{data.domain.id}">Back to Details</Button>
			<Button color="light" href="/admin/domain">Back to List</Button>
		</div>
	</div>

	<!-- Form validation errors summary -->
	{#if Object.keys($errors).length > 0}
		<div class="mb-4" transition:fade={{ duration: 200 }}>
			<Alert color="red">
				<svelte:fragment slot="icon">
					<ExclamationCircleSolid class="h-4 w-4" />
				</svelte:fragment>
				<p class="font-medium">Please fix the following errors:</p>
				<ul class="mt-1.5 list-inside list-disc">
					{#each Object.entries($errors) as [field, fieldErrors]}
						<li>{field}: {fieldErrors.join(', ')}</li>
					{/each}
				</ul>
			</Alert>
		</div>
	{/if}

	<div class="space-y-8 rounded-lg border bg-white p-6 shadow-sm">
		<form method="POST" use:enhance class="space-y-6">
			<div class="space-y-4">
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<FormInput
							label="Name"
							id="name"
							name="name"
							bind:value={$form.name}
							error={$errors.name?.join(', ')}
							required
							placeholder="Enter domain name"
						/>
					</div>

					<div>
						<FormInput
							label="Code"
							id="code"
							name="code"
							bind:value={$form.code}
							error={$errors.code?.join(', ')}
							required
							placeholder="Enter domain code"
							helperText="Unique identifier for this domain"
						/>
					</div>
				</div>

				<div>
					<FormTextarea
						label="Description"
						id="description"
						name="description"
						rows="4"
						bind:value={$form.description}
						error={$errors.description?.join(', ')}
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
					text={$submitting ? 'Saving...' : 'Save Changes'}
					disabled={!$tainted}
				/>
				<Button type="button" color="light" href="/admin/domain/{data.domain.id}">Cancel</Button>
			</div>
		</form>
	</div>
</div>

<script>
	import { Button, Alert } from 'flowbite-svelte';
	import { InfoCircleSolid, FileLinesOutline, ListOutline } from 'flowbite-svelte-icons';
	import { FormInput, FormToggle, FormButton } from '$lib/components/form'; // Removed FormTextarea
	import { superForm } from 'sveltekit-superforms/client'; // Removed Breadcrumb import
	import { Container } from '$lib/components/layout'; // Import Container

	let { data } = $props();
	const { form, enhance, errors, submitting, delayed } = superForm(data.form, {
		dataType: 'json',
		resetForm: false,
		multipleSubmits: 'prevent',
		taintedMessage: null
	});

	// Define breadcrumb items
	const breadcrumbItems = [
		{ href: '/admin/follower', label: 'Followers' },
		{ href: `/admin/follower/${data.follower.id}`, label: data.follower.name },
		{ label: 'Edit' }
	];
</script>

<!-- Use Container component -->
<Container breadcrumb={breadcrumbItems}>

	<!-- Page header -->
	<div class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Edit Follower: {data.follower.name}</h1>
		<div class="flex flex-shrink-0 gap-2">
			<Button color="light" href="/admin/follower/{data.follower.id}">
				<FileLinesOutline class="me-2 h-4 w-4" /> Back to Details
			</Button>
			<Button color="alternative" href="/admin/follower">
				<ListOutline class="me-2 h-4 w-4" /> Back to List
			</Button>
		</div>
	</div>

	<!-- Form Card -->
	<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
		<form method="POST" use:enhance class="space-y-6">
			<input type="hidden" name="_original" bind:value={$form._original} />

			{#if $errors._errors}
				<Alert color="red" class="mb-4">
					<InfoCircleSolid slot="icon" class="h-5 w-5" />
					<span class="font-medium">Please fix the following errors:</span>
					<ul class="mt-1.5 list-inside list-disc">
						{#each $errors._errors as error}
							<li>{error}</li>
						{/each}
					</ul>
				</Alert>
			{/if}

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<FormInput
					label="Name"
					id="name"
					name="name"
					bind:value={$form.name}
					error={$errors.name?.join(', ')}
					required
				/>
				
				<FormInput
					label="Phone"
					id="phone"
					name="phone"
					bind:value={$form.phone}
					error={$errors.phone?.join(', ')}
				/>

				<div class="md:col-span-1">
					<FormToggle
						label="Is Muda Mudi?"
						id="is_youth"
						name="is_youth"
						bind:value={$form.is_youth}
						error={$errors.is_youth?.join(', ')}
					/>
				</div>
			</div>

			<div class="flex items-center justify-start gap-3 border-t border-gray-200 pt-6 dark:border-gray-700">
				<FormButton
					type="submit"
					loading={$submitting || $delayed}
					text="Save Changes"
					loadingText="Saving..."
				/>
				<Button type="button" color="alternative" href="/admin/follower/{data.follower.id}">Cancel</Button>
			</div>
		</form>
	</div>
</Container>
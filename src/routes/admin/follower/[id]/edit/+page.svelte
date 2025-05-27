<script>
	import { Button, Card } from 'flowbite-svelte';
	import { FileLinesOutline, ListOutline } from 'flowbite-svelte-icons';
	import { FormInput, FormToggle, FormButton, ErrorAlert } from '$lib/components/form'; 
	import { superForm } from 'sveltekit-superforms/client'; 
	import { Container } from '$lib/components/layout'; 

	let { data } = $props();
	const follower = $derived(data.follower);

	const { form, enhance, errors, submitting, delayed } = superForm(data.form, {
		dataType: 'json',
		resetForm: false,
		multipleSubmits: 'prevent',
		taintedMessage: null
	});

	// Define breadcrumb items
	const breadcrumbItems = $derived([
		{ href: '/admin/follower', label: 'Followers' },
		{ href: `/admin/follower/${follower?.id}`, label: follower?.name || 'Follower Details' },
		{ label: 'Edit' }
	]);
</script>

<!-- Use Container component -->
<Container
	breadcrumb={breadcrumbItems}
	title={`Edit Follower: ${follower?.name || ''}`}
>
	{#snippet headerActions()}
		<div class="flex flex-shrink-0 gap-2">
			<Button color="light" href={`/admin/follower/${follower?.id}`}>
				<FileLinesOutline class="me-2 h-4 w-4" /> Back to Details
			</Button>
			<Button color="alternative" href="/admin/follower">
				<ListOutline class="me-2 h-4 w-4" /> Back to List
			</Button>
		</div>
	{/snippet}
	<Card size="xl" class="p-6">
		<form method="POST" use:enhance class="space-y-6">
			<input type="hidden" name="_original" bind:value={$form._original} />

			<!-- Enhanced Error Alert -->
			<ErrorAlert errors={$errors} />

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
				<Button type="button" color="alternative" href={`/admin/follower/${follower?.id}`}>Cancel</Button>
			</div>
		</form>
	</Card>
</Container>
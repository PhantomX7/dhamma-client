<script>
	import { Button, Input, Label, Textarea, Alert } from 'flowbite-svelte';
	import FormInput from '$lib/components/FormInput.svelte';
	import FormToggle from '$lib/components/FormToggle.svelte';
	import { superForm } from 'sveltekit-superforms/client';

	let { data } = $props();
	const { form, enhance, errors, message } = superForm(data.form, {
		onSubmit({ formData }) {
			// Convert boolean value to string for FormData
			const isActive = formData.get('is_active');
			formData.set('is_active', isActive ==='' ? 'true' : 'false');
		}
	});
</script>

<div class="p-4">
	<div class="mb-6 flex items-center justify-between">
		<h2 class="text-xl font-bold">Edit Domain</h2>
		<Button color="light" href="/admin/domain/{data.domain.id}">Back to Details</Button>
		<Button color="light" href="/admin/domain">Back to List</Button>
	</div>

	<div class="space-y-8 rounded-lg border bg-white p-6 shadow-sm">
		{#if $message}
			<Alert color={$message.includes('success') ? 'green' : 'red'} dismissable>
				{$message}
			</Alert>
		{/if}

		<form method="POST" use:enhance class="space-y-6">
			<input type="hidden" name="_original" value={JSON.stringify(data.domain)} />
			
			<div class="space-y-4">
				<div>
					<FormInput label="Name" id="name" name="name" bind:value={$form.name} error={$errors.name?.join(', ')} />
				</div>

				<div>
					<FormInput label="Code" id="code" name="code" bind:value={$form.code} error={$errors.code?.join(', ')} />
				</div>

				<div>
					<Label for="description">Description</Label>
					<Textarea
						id="description"
						name="description"
						rows="4"
						bind:value={$form.description}
						error={$errors.description?.join(', ')}
					/>
				</div>

				<div>
					<FormToggle 
						label="Status" 
						name="is_active" 
						bind:checked={$form.is_active} 
					/>
				</div>
			</div>

			<div class="flex gap-2">
				<Button type="submit" color="blue">Save Changes</Button>
				<Button type="button" color="light" href="/admin/domain/{data.domain.id}">Cancel</Button>
			</div>
		</form>
	</div>
</div>

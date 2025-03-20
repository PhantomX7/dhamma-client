<script>
	import { Button, Input, Label, Toggle, Textarea, Alert } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms/client';

	let { data } = $props();
	const { form, enhance, errors, message, isTainted } = superForm(data.form, {
		onSubmit({ formData, cancel }) {
			// Get all form field names
			const allFields = Array.from(formData.keys());

			// Delete untainted fields from formData
			allFields.forEach((key) => {
				if (!isTainted(key)) {
					formData.delete(key);
				}
			});

			// Cancel if no fields were changed
			if (Array.from(formData.keys()).length === 0) {
				cancel();
				return;
			}
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
			<div class="space-y-4">
				<div>
					<Label for="name">Name</Label>
					<Input id="name" name="name" bind:value={$form.name} error={$errors.name?.join(', ')} />
				</div>

				<div>
					<Label for="code">Code</Label>
					<Input id="code" name="code" bind:value={$form.code} error={$errors.code?.join(', ')} />
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
					<Label>Status</Label>
					<Toggle name="is_active" bind:checked={$form.is_active}>
						{$form.is_active ? 'Active' : 'Inactive'}
					</Toggle>
				</div>
			</div>

			<div class="flex gap-2">
				<Button type="submit" color="blue">Save Changes</Button>
				<Button type="button" color="light" href="/admin/domain/{data.domain.id}">Cancel</Button>
			</div>
		</form>
	</div>
</div>

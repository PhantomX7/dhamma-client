<script>
	import { Button } from 'flowbite-svelte';
	import { FormInput, FormTextarea, FormToggle, FormButton } from '$lib/components/form';
	import { superForm } from 'sveltekit-superforms/client';

	let { data } = $props();
	const { form, enhance, errors, message, submitting } = superForm(data.form, {
		onSubmit({ formData }) {
			const isActive = formData.get('is_active');
			formData.set('is_active', isActive === '' ? 'true' : 'false');
		}
	});
</script>

<div class="p-4">
	<div class="mb-6 flex items-center justify-between">
		<h2 class="text-xl font-bold">Edit Domain</h2>
		<div class="flex gap-2">
			<Button color="light" href="/admin/domain/{data.domain.id}">Back to Details</Button>
			<Button color="light" href="/admin/domain">Back to List</Button>
		</div>
	</div>

	<div class="space-y-8 rounded-lg border bg-white p-6 shadow-sm">
		<form method="POST" use:enhance class="space-y-6">
			<input type="hidden" name="_original" value={JSON.stringify(data.domain)} />

			<div class="space-y-4">
				<div>
					<FormInput
						label="Name"
						id="name"
						name="name"
						bind:value={$form.name}
						error={$errors.name?.join(', ')}
					/>
				</div>

				<div>
					<FormInput
						label="Code"
						id="code"
						name="code"
						bind:value={$form.code}
						error={$errors.code?.join(', ')}
					/>
				</div>

				<div>
					<FormTextarea
						label="Description"
						id="description"
						name="description"
						rows="4"
						bind:value={$form.description}
						error={$errors.description?.join(', ')}
					/>
				</div>

				<div>
					<FormToggle label="Status" name="is_active" bind:checked={$form.is_active} />
				</div>
			</div>

			<div class="flex gap-2">
				<FormButton type="submit" loading={$submitting} text="Save Changes" />
				<Button type="button" color="light" href="/admin/domain/{data.domain.id}">Cancel</Button>
			</div>
		</form>
	</div>
</div>

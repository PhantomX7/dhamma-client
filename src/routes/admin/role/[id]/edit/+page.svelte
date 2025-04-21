<script>
	import { Button } from 'flowbite-svelte';
	import { FormInput, FormTextarea, FormToggle, FormButton } from '$lib/components/form';
	import { superForm } from 'sveltekit-superforms/client';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	let { data } = $props();
	const { form, enhance, errors, message, submitting, delayed } = superForm(data.form, {
		dataType: 'json',
        taintedMessage: null,
        resetForm: false,
        multipleSubmits: 'prevent'
	});

    const breadcrumbItems = [
        { href: '/admin/role', label: 'Roles' },
        { href: `/admin/role/${data.role.id}`, label: data.role.name },
        { label: 'Edit' }
    ];
</script>

<div class="p-4">
    <Breadcrumb items={breadcrumbItems} />

	<div class="mb-6 flex items-center justify-between">
		<h2 class="text-xl font-bold">Edit Role</h2> <!-- Changed title -->
		<div class="flex gap-2">
			<Button color="light" href="/admin/role/{data.role.id}">Back to Details</Button> <!-- Changed link -->
			<Button color="light" href="/admin/role">Back to List</Button> <!-- Changed link -->
		</div>
	</div>

	<div class="space-y-8 rounded-lg border bg-white p-6 shadow-sm">
		<form method="POST" use:enhance class="space-y-6">
			<input type="hidden" name="_original" bind:value={$form._original} />

			<div class="space-y-4">
				<div>
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

				<div>
					<FormTextarea
						label="Description"
						id="description"
						name="description"
						rows="4"
						bind:value={$form.description} 
						error={$errors.description?.join(', ')}
                        placeholder="Enter role description"
					/>
				</div>

				<div>
					<FormToggle 
                        label="Status" 
                        name="is_active" 
                        bind:value={$form.is_active}  /> <!-- Use role form data -->
                    <p class="mt-1 text-sm text-gray-500">
						{$form.is_active
							? 'Role is active and can be assigned'
							: 'Role is inactive and cannot be assigned'}
					</p>
				</div>
			</div>

			<div class="flex gap-2 border-t pt-4">
				<FormButton type="submit" loading={$submitting || $delayed} text={$submitting ? 'Saving...' : 'Save Changes'} /> <!-- Changed button text -->
				<Button type="button" color="light" href="/admin/role/{data.role.id}">Cancel</Button> <!-- Changed link -->
			</div>
		</form>
	</div>
</div>
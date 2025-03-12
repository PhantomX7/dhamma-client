<script>
	import { Input, Label, Button, Alert } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { loginSchema } from '$lib/schema/login';
	import { goto } from '$app/navigation';

	let { data } = $props();

	// Initialize the form with superForm
	const { form, errors, enhance, submitting, message } = superForm(data.form, {
		validationMethod: 'auto',
		validator: zodClient(loginSchema),
		onSubmit: async ({ form }) => {
            console.log('form', JSON.stringify(form));
			// Handle successful login
			if (form.success) {
				// Redirect to home page using SvelteKit's goto
				await goto('/', { replaceState: true });
			}
		}
	});
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
	<div class="w-full max-w-md space-y-8">
		<div>
			<h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
				Sign in to your account { JSON.stringify(errors) }
			</h2>
		</div>
		<form class="mt-8 space-y-6" method="POST" use:enhance>
			{#if $message}
				<Alert color="red" class="mb-4">{$message}</Alert>
			{/if}
			<div class="-space-y-px rounded-md shadow-sm">
				<div class="mb-6">
					<Label for="username" class="mb-2 block">Username</Label>
					<Input
						id="username"
						type="text"
						name="username"
						bind:value={$form.username}
						placeholder="Enter your username"
						color={$errors.username ? 'red' : undefined}
					/>
					{#if $errors.username}
						<p class="mt-2 text-sm text-red-600">{$errors.username}</p>
					{/if}
				</div>
				<div class="mb-6">
					<Label for="password" class="mb-2 block">Password</Label>
					<Input
						id="password"
						type="password"
						name="password"
						bind:value={$form.password}
						placeholder="Enter your password"
						color={$errors.password ? 'red' : undefined}
					/>
					{#if $errors.password}
						<p class="mt-2 text-sm text-red-600">{$errors.password}</p>
					{/if}
				</div>
			</div>
			<div>
				<Button type="submit" class="w-full" disabled={$submitting}>
					{$submitting ? 'Signing in...' : 'Sign in'}
				</Button>
			</div>
		</form>
	</div>
</div>

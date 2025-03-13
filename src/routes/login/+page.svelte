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
		onUpdate: async ({ form }) => {
			console.log('form', JSON.stringify(form));
			// Handle successful login
			if (form.success) {
				// Redirect to home page using SvelteKit's goto
				await goto('/', { replaceState: true });
			}
		}
	});
</script>

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-blue-50 px-4 py-12 sm:px-6 lg:px-8"
>
	<div class="w-full max-w-md">
		<div class="space-y-6 rounded-2xl bg-white p-8 shadow-xl">
			<div class="text-center">
				<!-- Add your logo here -->
				<div
					class="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary-100"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-12 w-12 text-primary-600"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
						/>
					</svg>
				</div>
				<h2 class="mb-2 text-3xl font-bold text-gray-900">Welcome Back</h2>
				<p class="text-gray-600">Please sign in to your account</p>
			</div>

			{#if $message}
				<Alert color="red" class="mb-4">{$message}</Alert>
			{/if}

			<form class="space-y-6" method="POST" use:enhance>
				<div class="space-y-4">
					<div>
						<Label for="username" class="text-sm font-medium text-gray-700">Username</Label>
						<Input
							id="username"
							type="text"
							name="username"
							bind:value={$form.username}
							placeholder="Enter your username"
							class="mt-1 block w-full rounded-lg focus:border-primary-500 focus:ring-primary-500"
							color={$errors.username ? 'red' : undefined}
						/>
						{#if $errors.username}
							<p class="mt-2 text-sm text-red-600">{$errors.username}</p>
						{/if}
					</div>

					<div>
						<Label for="password" class="text-sm font-medium text-gray-700">Password</Label>
						<Input
							id="password"
							type="password"
							name="password"
							bind:value={$form.password}
							placeholder="Enter your password"
							class="mt-1 block w-full rounded-lg focus:border-primary-500 focus:ring-primary-500"
							color={$errors.password ? 'red' : undefined}
						/>
						{#if $errors.password}
							<p class="mt-2 text-sm text-red-600">{$errors.password}</p>
						{/if}
					</div>
				</div>

				<Button
					type="submit"
					class="w-full rounded-lg bg-primary-600 py-2.5 font-medium text-white transition-colors hover:bg-primary-700"
					disabled={$submitting}
				>
					{$submitting ? 'Signing in...' : 'Sign in'}
				</Button>

				<div class="text-center text-sm text-gray-600">
					<a href="/forgot-password" class="hover:text-primary-600">Forgot your password?</a>
				</div>
			</form>
		</div>
	</div>
</div>

<script>
	import { Input, Label, Button, Alert } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { loginSchema } from '$lib/schema/login';
	import { goto } from '$app/navigation';
	import FormInput from '$lib/components/FormInput.svelte';
	import FormButton from '$lib/components/FormButton.svelte';

	let { data } = $props();

	// Initialize the form with superForm
	const { form, errors, enhance, submitting, message } = superForm(data.form, {
		validationMethod: 'auto',
		validator: zodClient(loginSchema)
	});
</script>

<div
	class="from-primary-50 flex min-h-screen items-center justify-center bg-gradient-to-br to-blue-50 px-4 py-12 sm:px-6 lg:px-8"
>
	<div class="w-full max-w-md">
		<div class="space-y-6 rounded-2xl bg-white p-8 shadow-xl">
			<div class="text-center">
				<!-- Add your logo here -->
				<div
					class="bg-primary-100 mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="text-primary-600 h-12 w-12"
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
					<FormInput
						id="username"
						label="Username"
						type="text"
						name="username"
						bind:value={$form.username}
						placeholder="Enter your username"
						error={$errors.username}
					/>

					<FormInput
						id="password"
						label="Password"
						type="password"
						name="password"
						bind:value={$form.password}
						placeholder="Enter your password"
						error={$errors.password}
					/>
				</div>

				<FormButton
					type="submit"
					loading={$submitting}
					loadingText="Signing in..."
					text="Sign in"
				/>

				<div class="text-center text-sm text-gray-600">
					<a href="/forgot-password" class="hover:text-primary-600">Forgot your password?</a>
				</div>
			</form>
		</div>
	</div>
</div>

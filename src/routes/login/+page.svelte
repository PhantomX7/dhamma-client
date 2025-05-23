<script>
	import { Alert } from 'flowbite-svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { goto } from '$app/navigation';
	import { FormInput, FormButton } from '$lib/components/form';
	import { Container } from '$lib/components/layout';

	let { data } = $props();

	const { form, errors, enhance, submitting, message } = superForm(data.form, {
		resetForm: false,
		dataType: 'json' // Add JSON data type for better form handling
	});
</script>

<Container>
	<div class="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
		<div class="w-full max-w-md space-y-8">
		<div class="text-center">
			<div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-600">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-8 w-8 text-white"
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
			<h2 class="text-3xl font-extrabold text-gray-900">Welcome back</h2>
			<p class="mt-2 text-sm text-gray-600">
				Sign in to your account
			</p>
		</div>

		{#if $message}
			<Alert color="red" class="rounded-lg shadow-sm">
				{$message}
			</Alert>
		{/if}

		<div class="rounded-lg bg-white py-8 px-6 shadow sm:px-10">
			<form class="space-y-6" method="POST" use:enhance>
				<div class="space-y-4">
					<FormInput
						id="username"
						label="Username"
						type="text"
						name="username"
						bind:value={$form.username}
						placeholder="username@example.com"
						error={$errors.username}
						required
					/>

					<FormInput
						id="password"
						label="Password"
						type="password"
						name="password"
						bind:value={$form.password}
						placeholder="••••••••"
						error={$errors.password}
						required
					/>
				</div>

				<div class="flex items-center justify-between">
					<div class="flex items-center">
						<input
							id="remember-me"
							name="remember-me"
							type="checkbox"
							class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
						/>
						<label for="remember-me" class="ml-2 block text-sm text-gray-900">
							Remember me
						</label>
					</div>

					<div class="text-sm">
						<a
							href="/forgot-password"
							class="font-medium text-primary-600 hover:text-primary-500 transition-colors"
						>
							Forgot password?
						</a>
					</div>
				</div>

				<FormButton
					type="submit"
					loading={$submitting}
					loadingText="Signing in..."
					text="Sign in"
					size="lg"
					color="primary"
					class="w-full justify-center"
				/>
			</form>
		</div>
	</div>
</Container>

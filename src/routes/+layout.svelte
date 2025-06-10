<script>
	import '../app.css';
	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/stores';
	import { setContext } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import { Toast } from 'flowbite-svelte';
	import {
		CheckCircleSolid,
		ExclamationCircleSolid,
		InfoCircleSolid,
		CloseCircleSolid
	} from 'flowbite-svelte-icons';
	import { fade, fly } from 'svelte/transition';

	let { data, children } = $props();

	const flash = getFlash(page);

	// Auto-dismiss flash messages after 5 seconds
	$effect(() => {
		if ($flash) {
			const timer = setTimeout(() => {
				$flash = null;
			}, 5000);
			return () => clearTimeout(timer);
		}
	});

	// Get appropriate icon based on flash type
	function getFlashIcon(type) {
		switch (type) {
			case 'success':
				return CheckCircleSolid;
			case 'error':
				return CloseCircleSolid;
			case 'warning':
				return ExclamationCircleSolid;
			case 'info':
			default:
				return InfoCircleSolid;
		}
	}

	// Get appropriate color based on flash type
	function getFlashColor(type) {
		switch (type) {
			case 'success':
				return 'green';
			case 'error':
				return 'red';
			case 'warning':
				return 'yellow';
			case 'info':
			default:
				return 'blue';
		}
	}

	// Set context values for all children components
	setContext('domain', () => data.tenant);
	setContext('user', () => data.user);
</script>

<div>
	{#if data.error && data.errorType == 'connection'}
		<section class="container mx-auto p-6 py-12">
			<div class="my-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div class="bg-white px-4 pt-2 pb-5 shadow sm:rounded-lg sm:px-10">
					<div class="border-b border-gray-200 bg-white px-3 py-3 text-center sm:px-6">
						<h3 class="text-2xl leading-6 font-medium text-gray-900">
							Mohon periksa kembali jaringan anda
						</h3>
					</div>
					<button
						class="bg-primary-400 hover:bg-primary-500 disabled:hover:bg-primary-400 mx-2 inline-flex w-full items-center justify-center rounded-full border border-transparent px-3.5 py-2 text-sm leading-4 font-medium text-white shadow-sm disabled:opacity-50"
						onclick={() => {
							invalidateAll();
						}}
					>
						REFRESH
					</button>
				</div>
			</div>
		</section>
	{:else}
		{#if $flash}
			<Toast
				transition={fly}
				params={{ x: 200 }}
				position="top-right"
				dismissable
				simple
				color={getFlashColor($flash.type)}
				class="border border-gray-100 shadow-lg top-20 right-4 z-50"
			>
				{#snippet icon()}
					{@const FlashIcon = getFlashIcon($flash.type)}
					<FlashIcon class="h-5 w-5" />
				{/snippet}
				<div class="ml-3 text-sm font-normal">
					{$flash.message}
				</div>
			</Toast>
			<!-- </div> -->
		{/if}
		{@render children()}
	{/if}
</div>

<style>
	:global(.flash) {
		animation: fadeOut 5s forwards;
	}

	@keyframes fadeOut {
		0% {
			opacity: 1;
		}
		70% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
</style>

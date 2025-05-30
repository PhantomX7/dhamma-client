
<script>
	// Define props for the component using Svelte 5 runes
	let { 
		label = '', 
		value = undefined, 
		class: className = '', 
		size = 'md', 
		variant = 'default',
		icon = undefined,
		copyable = false,
		children 
	} = $props();

	// Copy functionality
	let copied = $state(false);
	
	const copyToClipboard = async () => {
		if (value && navigator.clipboard) {
			try {
				await navigator.clipboard.writeText(String(value));
				copied = true;
				setTimeout(() => copied = false, 2000);
			} catch (err) {
				console.error('Failed to copy:', err);
			}
		}
	};

	// Size configurations
	const sizeConfig = {
		sm: { text: 'text-sm', spacing: 'p-3', gap: 'gap-2' },
		md: { text: 'text-base', spacing: 'p-4', gap: 'gap-3' },
		lg: { text: 'text-lg', spacing: 'p-5', gap: 'gap-4' }
	};

	// Variant configurations
	const variantConfig = {
		default: 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700',
		accent: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800',
		success: 'bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 border-emerald-200 dark:border-emerald-800',
		warning: 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800'
	};

	const config = sizeConfig[size] || sizeConfig.md;
	const variantStyles = variantConfig[variant] || variantConfig.default;
</script>

<!-- Modern DetailItem component with glassmorphism and micro-interactions -->
<div class="group relative overflow-hidden rounded-xl border backdrop-blur-sm transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 {variantStyles} {config.spacing} {className}">
	<!-- Subtle gradient overlay for depth -->
	<div class="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-white/5"></div>
	
	<!-- Content container -->
	<div class="relative flex flex-col {config.gap}">
		<!-- Header with label and optional icon -->
		<div class="flex items-center justify-between">
			<dt class="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
				{#if icon}
					<span class="flex h-4 w-4 items-center justify-center">
						{@html icon}
					</span>
				{/if}
				<span class="transition-colors duration-200 group-hover:text-gray-600 dark:group-hover:text-gray-300">
					{label}
				</span>
			</dt>
			
			<!-- Copy button if copyable -->
			{#if copyable && value !== undefined}
				<button
					onclick={copyToClipboard}
					class="flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 opacity-0 transition-all duration-200 hover:bg-gray-200 group-hover:opacity-100 dark:bg-gray-800 dark:hover:bg-gray-700"
					title="Copy to clipboard"
				>
					{#if copied}
						<svg class="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
						</svg>
					{:else}
						<svg class="h-3 w-3 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
						</svg>
					{/if}
				</button>
			{/if}
		</div>
		
		<!-- Value content with enhanced typography -->
		<dd class="min-h-0 {config.text} font-medium leading-relaxed text-gray-900 dark:text-white">
			{#if value !== undefined}
				<!-- Display value with enhanced styling -->
				<div class="break-words transition-colors duration-200 group-hover:text-gray-800 dark:group-hover:text-gray-100">
					{value}
				</div>
			{:else if children}
				<!-- Render children with consistent styling -->
				<div class="transition-colors duration-200 group-hover:text-gray-800 dark:group-hover:text-gray-100">
					{@render children()}
				</div>
			{:else}
				<!-- Enhanced empty state -->
				<div class="flex items-center gap-2 text-gray-400 dark:text-gray-500">
					<div class="h-1 w-1 rounded-full bg-current opacity-50"></div>
					<span class="text-sm italic">No data available</span>
				</div>
			{/if}
		</dd>
	</div>
	
	<!-- Subtle bottom border accent -->
	<div class="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"></div>
</div>
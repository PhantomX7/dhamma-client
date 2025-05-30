<script>
	import { Badge, Button, Card } from 'flowbite-svelte';
	import { ListOutline, EditOutline, MessageDotsOutline } from 'flowbite-svelte-icons';
	import { formatDate } from '$lib/utils';
	import { Container, DetailItem } from '$lib/components/layout';
	import { hasPermission } from '$lib/utils/permissions';
	import { getContext } from 'svelte';

	const currentUser = getContext('user');

	// Component props
	let { data } = $props();
	let chatTemplate = $derived(data.chatTemplate);

	// Breadcrumb items
	const breadcrumbItems = $derived([
		{ href: '/admin/chat-template', label: 'Chat Templates' },
		{ label: chatTemplate?.name || 'Template Details' }
	]);
</script>

<!-- Use Container component -->
<Container
	breadcrumb={breadcrumbItems}
	title={`Chat Template Details: ${chatTemplate?.name || ''}`}
>
	{#snippet headerActions()}
		<div class="flex flex-shrink-0 gap-2">
			{#if chatTemplate?.id}
				{#if hasPermission(currentUser(), 'chat-template/update')}
					<Button href={`/admin/chat-template/${chatTemplate.id}/edit`} color="blue">
						<EditOutline class="me-2 h-4 w-4" /> Edit Template
					</Button>
				{/if}
			{/if}
			<Button color="alternative" href="/admin/chat-template">
				<ListOutline class="me-2 h-4 w-4" /> Back to List
			</Button>
		</div>
	{/snippet}

	<!-- Template Details Card -->
	<Card size="xl" class="mb-8 p-6">
		<div class="mb-6 flex items-center gap-3">
			<MessageDotsOutline class="h-8 w-8 text-blue-500" />
			<h2 class="text-2xl font-bold text-gray-900 dark:text-white">
				{chatTemplate?.name || 'Chat Template'}
			</h2>
		</div>

		<div class="grid gap-6 md:grid-cols-2">
			<!-- Basic Information -->
			<div class="space-y-4">
				<DetailItem label="Set As Default">
					<Badge color={chatTemplate?.is_default ? 'yellow' : 'gray'} class="text-xs">
						{chatTemplate?.is_default ? 'Yes' : 'No'}
					</Badge>
				</DetailItem>
				<DetailItem label="ID">
					<span class="font-mono text-sm">{chatTemplate?.id}</span>
				</DetailItem>
				<DetailItem label="Name">
					<span class="font-semibold">{chatTemplate?.name}</span>
				</DetailItem>
				{#if currentUser().is_super_admin}
					<DetailItem label="Domain">
						<span class="font-medium">{chatTemplate?.domain?.name || 'N/A'}</span>
					</DetailItem>
				{/if}
				<DetailItem label="Category">
					<Badge color="blue" class="text-xs">{chatTemplate?.category || 'N/A'}</Badge>
				</DetailItem>
				<DetailItem label="Status">
					<Badge color={chatTemplate?.is_active ? 'green' : 'red'} class="text-xs">
						{chatTemplate?.is_active ? 'Active' : 'Inactive'}
					</Badge>
				</DetailItem>
			</div>

			<!-- Metadata -->
			<div class="space-y-4">
				<DetailItem label="Created At">
					<span class="text-gray-700 dark:text-gray-300">{formatDate(chatTemplate?.created_at)}</span>
				</DetailItem>
				<DetailItem label="Updated At">
					<span class="text-gray-700 dark:text-gray-300">{formatDate(chatTemplate?.updated_at)}</span>
				</DetailItem>
				<DetailItem label="Description">
					<span class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{chatTemplate?.description || 'No description provided'}</span>
				</DetailItem>
			</div>
		</div>
	</Card>

	<!-- Template Content Card -->
	<Card size="xl" class="mb-8 p-6">
		<h3 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Template Content</h3>
		<div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
			<pre
				class="text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300">{chatTemplate?.content ||
					'No content available'}</pre>
		</div>
	</Card>
</Container>

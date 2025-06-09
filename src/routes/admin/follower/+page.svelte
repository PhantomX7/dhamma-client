<script>
	import { Button } from 'flowbite-svelte';
	import { PlusOutline } from 'flowbite-svelte-icons';
	import DataTable from '$lib/components/DataTable.svelte';
	import AdminTable from '$lib/components/AdminTable.svelte';
	import { FilterType } from '$lib/utils/filter';
	import { getContext } from 'svelte';
	import { Container } from '$lib/components/layout';
	import { hasPermission } from '$lib/utils/permissions';
	import { getFollowerTableConfig } from '$lib/utils/tableConfig/follower.js';
	import { createFormActionHandler } from '$lib/utils/formActionHandler.js';
	import { createSmartAction } from '$lib/utils/tableConfig/index.js';

	const currentUser = getContext('user');

	// Component props
	let { data } = $props();

	// Breadcrumb items definition
	const breadcrumbItems = $derived([{ label: 'Followers', href: '/admin/follower' }]);

	// Configuration for the DataTable filter component
	const filterConfig = $derived({
		name: {
			type: FilterType.STRING,
			label: 'Name'
		},
		...(currentUser()?.is_super_admin && {
			// Conditionally add domain_name filter for super admins
			domain_name: {
				type: FilterType.STRING,
				label: 'Domain Name'
			}
		}),
		phone: {
			type: FilterType.STRING,
			label: 'Phone'
		},
		is_youth: {
			type: FilterType.BOOL,
			label: 'Muda Mudi'
		},
		created_at: {
			type: FilterType.DATE,
			label: 'Created Date'
		}
	});

	let showSuccessAlert = $state(false);
	let showErrorAlert = $state(false);
	let alertMessage = $state('');

	// WhatsApp chat function
	const chatWhatsApp = async (follower) => {
		try {
			if (!follower.phone) {
				showErrorAlert = true;
				alertMessage = `Follower don't have a phone number`;
				return;
			}

			// Get domain ID from current user or follower
			const domainId = follower.domain_id;

			// Fetch default chat template
			const response = await fetch(`/api/chat-template/${domainId}`);

			if (!response.ok) {
				if (response.status === 404) {
					showErrorAlert = true;
					alertMessage = 'No default chat template found for this domain';
				} else {
					showErrorAlert = true;
					alertMessage = 'Failed to fetch chat template';
				}
				return;
			}

			const template = await response.json();

			// Replace placeholders in template with follower data
			let message = template.content || 'Hello!';
			message = message.replace(/\{name\}/g, follower.name || 'there');
			message = message.replace(/\{phone\}/g, follower.phone || '');

			// Clean phone number (remove non-digits)
			// const cleanPhone = follower.phone.replace(/\D/g, '');
			const cleanPhone = follower.phone;

			// Create WhatsApp URL
			const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

			// Open WhatsApp in new tab
			window.open(whatsappUrl, '_blank');
		} catch (error) {
			console.error('Error opening WhatsApp chat:', error);
		}
	};

	// Table configuration with custom action handlers
	const tableConfig = $derived({
		...getFollowerTableConfig(currentUser()?.is_super_admin),
		actions: [
			...getFollowerTableConfig(currentUser()?.is_super_admin).actions,
			createSmartAction('Chat', 'green', null, 'chat-template/get-default', chatWhatsApp)
		]
	});
</script>

<!-- Use Container component -->
<Container
	breadcrumb={breadcrumbItems}
	title="Followers"
	{showSuccessAlert}
	{showErrorAlert}
	{alertMessage}
	onCloseErrorAlert={() => (showErrorAlert = false)}
>
	{#snippet headerActions()}
		{#if hasPermission(currentUser(), 'follower/create')}
			<Button href="/admin/follower/add">
				<PlusOutline class="me-2 h-4 w-4" /> Add Follower
			</Button>
		{/if}
	{/snippet}

	<!-- DataTable component wrapping the AdminTable -->
	<DataTable data={data.followers} meta={data.meta} {filterConfig}>
		<AdminTable data={data.followers} config={tableConfig} />
	</DataTable>
</Container>

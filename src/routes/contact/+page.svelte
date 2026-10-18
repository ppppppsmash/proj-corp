<script lang="ts">
	import * as m from '#lib/paraglide/messages.js';
	import PageHeader from '#lib/components/ui/PageHeader.svelte';
	import ContactForm from '#lib/components/forms/ContactForm.svelte';
</script>

<svelte:head>
	<title>{m.nav_contact()} | {m.site_name()}</title>
	<meta name="description" content={m.contact_lead()} />
</svelte:head>

<PageHeader label="Contact" title={m.nav_contact()} lead={m.contact_lead()} />

<section class="container-site pb-section">
	<div class="relative max-w-[44rem]">
		<ContactForm />
	</div>
</section>

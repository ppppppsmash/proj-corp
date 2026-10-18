<script lang="ts">
	import * as m from '#lib/paraglide/messages.js';
	import Seo from '#lib/components/Seo.svelte';
	import PageHeader from '#lib/components/ui/PageHeader.svelte';
	import ContactForm from '#lib/components/forms/ContactForm.svelte';
</script>

<Seo title={m.nav_contact()} description={m.contact_lead()} />

<PageHeader label="Contact" title={m.nav_contact()} lead={m.contact_lead()} />

<section class="container-site pb-section">
	<div class="relative max-w-[44rem]">
		<ContactForm />
	</div>
</section>

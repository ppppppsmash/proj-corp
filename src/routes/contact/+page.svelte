<script lang="ts">
	import * as m from '#lib/paraglide/messages.js';
	import PageHeader from '#lib/components/ui/PageHeader.svelte';
</script>

<svelte:head>
	<title>{m.nav_contact()} | {m.site_name()}</title>
</svelte:head>

<PageHeader label="Contact" title={m.nav_contact()} />

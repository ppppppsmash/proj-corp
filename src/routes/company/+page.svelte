<script lang="ts">
	import * as m from '#lib/paraglide/messages.js';
	import PageHeader from '#lib/components/ui/PageHeader.svelte';
</script>

<svelte:head>
	<title>{m.nav_company()} | {m.site_name()}</title>
</svelte:head>

<PageHeader label="Company" title={m.nav_company()} />

<script lang="ts">
	import * as m from '#lib/paraglide/messages.js';
	import PageHeader from '#lib/components/ui/PageHeader.svelte';
</script>

<svelte:head>
	<title>{m.nav_business()} | {m.site_name()}</title>
</svelte:head>

<PageHeader label="Business" title={m.nav_business()} />

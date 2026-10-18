<script lang="ts">
	import * as m from '#lib/paraglide/messages.js';
	import PageHeader from '#lib/components/ui/PageHeader.svelte';
</script>

<svelte:head>
	<title>{m.footer_privacy()} | {m.site_name()}</title>
</svelte:head>

<PageHeader label="Privacy Policy" title={m.footer_privacy()} />

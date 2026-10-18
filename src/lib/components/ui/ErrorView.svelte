<script lang="ts">
	import * as m from '#lib/paraglide/messages.js';
	import Button from '#lib/components/ui/Button.svelte';
	import { localHref } from '#lib/utils/href.js';

	let { status }: { status: number } = $props();
	const notFound = $derived(status === 404);
	const title = $derived(notFound ? m.not_found_title() : m.error_generic_title());
	const body = $derived(notFound ? m.not_found_body() : m.error_generic_body());
</script>

<svelte:head>
	<title>{title} | {m.site_name()}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="container-site py-24 md:py-40">
	<p class="font-latin text-6xl text-gold-500 tabular-nums md:text-8xl">{status}</p>
	<h1 class="mt-6 text-2xl md:text-4xl">{title}</h1>
	<p class="mt-6 max-w-[38em] text-sumi-700">{body}</p>
	<div class="mt-12">
		<Button href={localHref('/')}>{m.back_to_home()}</Button>
	</div>
</section>

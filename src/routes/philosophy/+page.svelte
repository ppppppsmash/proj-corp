<script lang="ts">
	import * as m from '#lib/paraglide/messages.js';
	import { getLocale } from '#lib/paraglide/runtime.js';
	import { reveal } from '#lib/actions/reveal.js';
	import { company } from '#lib/data/company.js';
	import { getPage } from '#lib/content/pages.js';
	import PageHeader from '#lib/components/ui/PageHeader.svelte';
	import PineMotif from '#lib/components/ui/PineMotif.svelte';

	const locale = getLocale();
	const Philosophy = getPage(locale, 'philosophy')?.default;
	const Greeting = getPage(locale, 'greeting')?.default;
</script>

<svelte:head>
	<title>{m.nav_philosophy()} | {m.site_name()}</title>
	<meta name="description" content={m.philosophy_lead()} />
</svelte:head>

<PageHeader label="Philosophy" title={m.nav_philosophy()} lead={m.philosophy_lead()} />

<!-- 理念本文。右に縦書きのアクセント -->
<section class="container-site grid gap-12 pb-section md:grid-cols-12">
	<div class="prose-site md:col-span-7" use:reveal>
		{#if Philosophy}<Philosophy />{/if}
	</div>
	<div class="hidden justify-end md:col-span-5 md:flex" use:reveal={{ delay: 150 }}>
		<p class="font-mincho writing-vertical text-2xl tracking-[0.3em] text-pine-700">
			{m.site_tagline()}
		</p>
	</div>
</section>

<!-- 代表挨拶 -->
<section class="border-t border-kinari-300 bg-kinari-50">
	<div class="container-site grid gap-12 py-section md:grid-cols-12 md:gap-16">
		<!-- TODO: 代表の肖像写真(enhanced:img)に差し替える -->
		<div
			class="relative aspect-[3/4] overflow-hidden bg-pine-900 text-pine-500/70 md:col-span-4"
			use:reveal
		>
			<PineMotif class="absolute inset-0 h-full w-full" />
			<p
				class="absolute bottom-6 left-6 font-latin text-xs tracking-label text-kinari-200/70 uppercase"
			>
				Portrait
			</p>
		</div>
		<div class="md:col-span-8" use:reveal={{ delay: 120 }}>
			<p class="text-label">Message</p>
			<p class="mt-2 text-sm text-sumi-500">{m.greeting_label()}</p>
			<h2 class="mt-6 max-w-[20em] text-2xl md:text-3xl">{m.greeting_title()}</h2>
			<div class="prose-site mt-8 max-w-[38em]">
				{#if Greeting}<Greeting />{/if}
			</div>
			<p class="mt-12 border-t border-kinari-300 pt-6 text-sm text-sumi-700">
				{locale === 'ja' ? company.nameJa : company.nameEn}<br />
				<span class="text-sumi-500">{m.greeting_role()}</span>
				<span class="ml-3 font-mincho text-lg text-sumi-900">{company.representative[locale]}</span>
			</p>
		</div>
	</div>
</section>

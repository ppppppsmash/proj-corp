<script lang="ts">
	import * as m from '#lib/paraglide/messages.js';
	import { getLocale } from '#lib/paraglide/runtime.js';
	import { categoryLabel, formatDate, getNewsEntry } from '#lib/content/news.js';
	import { localHref } from '#lib/utils/href.js';
	import TextLink from '#lib/components/ui/TextLink.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const Content = $derived(getNewsEntry(getLocale(), data.slug)?.content);
</script>

<svelte:head>
	<title>{data.title} | {m.nav_news()} | {m.site_name()}</title>
</svelte:head>

<article class="container-site pt-16 pb-section md:pt-24">
	<header class="max-w-[40em]">
		<p class="flex items-center gap-4 text-sm">
			<time datetime={data.date} class="font-latin tracking-wider text-sumi-500 tabular-nums">
				{formatDate(data.date)}
			</time>
			<span class="text-xs tracking-wider text-gold-700">{categoryLabel[data.category]()}</span>
		</p>
		<h1 class="mt-5 text-2xl leading-[1.5] md:text-4xl">{data.title}</h1>
		<hr class="mt-8 w-16 border-gold-500" />
	</header>

	<div class="prose-site mt-10 max-w-[40em]">
		{#if Content}<Content />{/if}
	</div>

	<div class="mt-16 border-t border-kinari-300 pt-8">
		<TextLink href={localHref('/news')}>{m.news_back()}</TextLink>
	</div>
</article>

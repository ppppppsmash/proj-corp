<script lang="ts">
	import * as m from '#lib/paraglide/messages.js';
	import { getLocale } from '#lib/paraglide/runtime.js';
	import { reveal } from '#lib/actions/reveal.js';
	import { categoryLabel, formatDate, getNews } from '#lib/content/news.js';
	import { localHrefParams } from '#lib/utils/href.js';
	import PageHeader from '#lib/components/ui/PageHeader.svelte';

	const locale = getLocale();
	const news = getNews(locale);
</script>

<svelte:head>
	<title>{m.nav_news()} | {m.site_name()}</title>
	<meta name="description" content={m.news_lead()} />
</svelte:head>

<PageHeader label="News" title={m.nav_news()} lead={m.news_lead()} />

<section class="container-site pb-section">
	{#if news.length === 0}
		<p class="text-sumi-500">{m.news_empty()}</p>
	{:else}
		<ul class="border-t border-kinari-300" use:reveal>
			{#each news as item (item.slug)}
				<li class="border-b border-kinari-300">
					<a
						href={localHrefParams('/news/[slug]', { slug: item.slug })}
						class="grid gap-2 py-6 no-underline transition-colors hover:text-pine-700 md:grid-cols-12 md:gap-8"
					>
						<time
							datetime={item.date}
							class="font-latin text-sm tracking-wider text-sumi-500 tabular-nums md:col-span-2"
						>
							{formatDate(item.date)}
						</time>
						<span class="text-xs tracking-wider text-gold-700 md:col-span-2">
							{categoryLabel[item.category]()}
						</span>
						<span class="md:col-span-8">{item.title}</span>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</section>

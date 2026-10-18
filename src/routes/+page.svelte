<script lang="ts">
	import * as m from '#lib/paraglide/messages.js';
	import { getLocale } from '#lib/paraglide/runtime.js';
	import { reveal } from '#lib/actions/reveal.js';
	import { product } from '#lib/data/company.js';
	import { categoryLabel, formatDate, getNews } from '#lib/content/news.js';
	import { localHref, localHrefParams } from '#lib/utils/href.js';
	import Button from '#lib/components/ui/Button.svelte';
	import PineMotif from '#lib/components/ui/PineMotif.svelte';
	import SectionHeading from '#lib/components/ui/SectionHeading.svelte';
	import TextLink from '#lib/components/ui/TextLink.svelte';

	const locale = getLocale();
	const news = getNews(locale, 3);
	const amazonUrl = product.amazonUrl;

	const businesses = [
		{ no: '01', title: m.business_brand_title, body: m.business_brand_body, en: 'Own Brand' },
		{ no: '02', title: m.business_oem_title, body: m.business_oem_body, en: 'OEM / ODM' }
	];
</script>

<svelte:head>
	<title>{m.site_name()} | {m.site_tagline()}</title>
	<meta name="description" content={m.home_hero_lead()} />
</svelte:head>

<!-- ============ Hero ============
     TODO: 背景は松の実写(霧や雪の中の松)に差し替える。
     それまでは深緑の面 + 松葉モチーフで代用。 -->
<section class="relative flex min-h-svh items-end overflow-hidden bg-pine-950 text-kinari-50">
	<PineMotif class="absolute inset-0 h-full w-full text-pine-500/60" />
	<div class="relative container-site pb-20 md:pb-28">
		<p class="text-label text-gold-300">Kanshodo</p>
		<h1 class="mt-6 text-4xl leading-[1.3] md:text-6xl">{m.site_tagline()}</h1>
		<p class="mt-8 max-w-[30em] text-kinari-200 md:text-lg">{m.home_hero_lead()}</p>
	</div>
	<div
		class="absolute right-5 bottom-0 hidden flex-col items-center gap-3 md:right-16 md:flex"
		aria-hidden="true"
	>
		<span class="font-latin writing-vertical text-xs tracking-label text-kinari-200 uppercase">
			{m.home_scroll()}
		</span>
		<span class="block h-16 w-px bg-gold-500"></span>
	</div>
</section>

<!-- ============ Philosophy ============ -->
<section class="container-site grid gap-12 py-section md:grid-cols-12">
	<div class="md:col-span-7" use:reveal>
		<p class="text-label">Philosophy</p>
		<h2 class="mt-4 max-w-[17em] text-3xl md:text-4xl">{m.home_philosophy_title()}</h2>
		<p class="mt-8 max-w-[36em] text-sumi-700">{m.home_philosophy_body()}</p>
		<div class="mt-10">
			<TextLink href={localHref('/philosophy')}>{m.cta_read_more()}</TextLink>
		</div>
	</div>
	<div class="hidden justify-end md:col-span-5 md:flex" use:reveal={{ delay: 150 }}>
		<p class="font-mincho writing-vertical text-2xl tracking-[0.3em] text-pine-700">
			{m.home_philosophy_vertical()}
		</p>
	</div>
</section>

<!-- ============ Business ============ -->
<section class="border-y border-kinari-300 bg-kinari-50">
	<div class="container-site py-section">
		<div use:reveal>
			<SectionHeading label="Business" title={m.home_business_title()}>
				{#snippet aside()}
					<TextLink href={localHref('/business')}>{m.cta_read_more()}</TextLink>
				{/snippet}
			</SectionHeading>
		</div>
		<ol class="mt-16 border-t border-kinari-300">
			{#each businesses as b, i (b.no)}
				<li class="border-b border-kinari-300" use:reveal={{ delay: i * 120 }}>
					<div class="grid gap-6 py-10 md:grid-cols-12 md:gap-10 md:py-14">
						<p class="font-latin text-4xl text-gold-500 tabular-nums md:col-span-2">{b.no}</p>
						<div class="md:col-span-4">
							<h3 class="text-2xl">{b.title()}</h3>
							<p class="mt-2 font-latin text-xs tracking-label text-sumi-400 uppercase">{b.en}</p>
						</div>
						<p class="text-sumi-700 md:col-span-6">{b.body()}</p>
					</div>
				</li>
			{/each}
		</ol>
	</div>
</section>

<!-- ============ Product ============
     TODO: 左カラムはパッケージの物撮り写真(enhanced:img)に差し替える。 -->
<section class="container-site grid items-center gap-12 py-section md:grid-cols-12 md:gap-16">
	<div
		class="relative aspect-[4/5] overflow-hidden bg-pine-900 text-pine-500/70 md:col-span-5"
		use:reveal
	>
		<PineMotif class="absolute inset-0 h-full w-full" />
		<p
			class="absolute bottom-6 left-6 font-latin text-xs tracking-label text-kinari-200/70 uppercase"
		>
			Product photo
		</p>
	</div>
	<div class="md:col-span-7" use:reveal={{ delay: 120 }}>
		<p class="text-label">Product</p>
		<h2 class="mt-4 text-2xl leading-[1.5] break-keep md:text-3xl">{m.product_name()}</h2>
		<p class="mt-6 max-w-[36em] text-sumi-700">{m.product_summary()}</p>

		<dl
			class="mt-10 grid grid-cols-[auto_1fr] gap-x-8 gap-y-4 border-t border-kinari-300 pt-8 text-sm"
		>
			<dt class="text-sumi-500">{m.spec_content()}</dt>
			<dd>{m.spec_content_value()}</dd>
			<dt class="text-sumi-500">{m.spec_intake()}</dt>
			<dd>{m.spec_intake_value()}</dd>
			<dt class="text-sumi-500">{m.spec_factory()}</dt>
			<dd>{m.spec_factory_value()}</dd>
			<dt class="text-sumi-500">JAN</dt>
			<dd class="font-latin tracking-wider tabular-nums">{product.jan}</dd>
		</dl>

		<div class="mt-10 flex flex-wrap items-center gap-4">
			<Button href={localHref('/products')}>{m.cta_read_more()}</Button>
			{#if amazonUrl}
				<Button variant="solid" href={amazonUrl} target="_blank" rel="noopener">
					{m.cta_buy_amazon()}
				</Button>
			{:else}
				<p class="text-sm text-sumi-500">{m.amazon_coming_soon()}</p>
			{/if}
		</div>
	</div>
</section>

<!-- ============ News ============ -->
<section class="border-t border-kinari-300">
	<div class="container-site py-section">
		<div use:reveal>
			<SectionHeading label="News" title={m.home_news_title()}>
				{#snippet aside()}
					<TextLink href={localHref('/news')}>{m.view_all_news()}</TextLink>
				{/snippet}
			</SectionHeading>
		</div>
		<ul class="mt-12 border-t border-kinari-300">
			{#each news as item, i (item.slug)}
				<li class="border-b border-kinari-300" use:reveal={{ delay: i * 100 }}>
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
	</div>
</section>

<!-- ============ Contact ============ -->
<section class="bg-pine-900 text-kinari-50">
	<div class="container-site grid gap-10 py-section md:grid-cols-12 md:items-center">
		<div class="md:col-span-7" use:reveal>
			<p class="text-label text-gold-300">Contact</p>
			<h2 class="mt-4 text-3xl md:text-4xl">{m.home_contact_title()}</h2>
			<p class="mt-6 max-w-[32em] text-kinari-200">{m.home_contact_body()}</p>
		</div>
		<div
			class="flex flex-col items-start gap-4 md:col-span-5 md:items-end"
			use:reveal={{ delay: 120 }}
		>
			<Button tone="light" variant="solid" href={localHref('/contact')}>{m.cta_contact()}</Button>
			<Button tone="light" href={localHref('/contact')}>{m.cta_oem()}</Button>
		</div>
	</div>
</section>

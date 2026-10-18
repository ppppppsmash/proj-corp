<script lang="ts">
	import { page } from '$app/state';
	import * as m from '#lib/paraglide/messages.js';
	import { deLocalizeHref, getLocale, locales, localizeHref } from '#lib/paraglide/runtime.js';
	import { config } from '#lib/config.js';

	/**
	 * 各ページの <head>。title / description / OGP / canonical / hreflang / JSON-LD をまとめる。
	 * 絶対 URL が必要なもの(canonical, hreflang, og:url, og:image)は config.siteUrl が
	 * 設定されるまで出力しない。
	 */
	type Props = {
		title?: string;
		description?: string;
		type?: 'website' | 'article';
		image?: string;
		noindex?: boolean;
		jsonLd?: Record<string, unknown> | Record<string, unknown>[];
	};
	let {
		title,
		description,
		type = 'website',
		image = '/og.png',
		noindex = false,
		jsonLd
	}: Props = $props();

	const locale = getLocale();
	const ogLocale = { ja: 'ja_JP', en: 'en_US', zh: 'zh_CN' }[locale];

	const fullTitle = $derived(
		title ? `${title} | ${m.site_name()}` : `${m.site_name()} | ${m.site_tagline()}`
	);
	const desc = $derived(description ?? m.home_hero_lead());
	const abs = (p: string) => (config.siteUrl ? config.siteUrl + p : undefined);
	const canonical = $derived(abs(page.url.pathname));
	const alternates = $derived(
		config.siteUrl
			? locales.map((l) => ({
					l,
					href: config.siteUrl + localizeHref(deLocalizeHref(page.url.pathname), { locale: l })
				}))
			: []
	);
	const ogImage = $derived(abs(image));
	// JSON-LD は自前のデータのみを直列化する(ユーザー入力は含まない)
	// script 終了タグが文字列中に現れないよう "<" はエスケープし、タグ自体も連結で組み立てる
	const ldTag = $derived(
		jsonLd
			? '<script type="application/ld+json">' +
					JSON.stringify(jsonLd).replaceAll('<', '\\u003c') +
					'<' +
					'/script>'
			: ''
	);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={desc} />
	{#if noindex}
		<meta name="robots" content="noindex, follow" />
	{/if}
	{#if canonical}
		<link rel="canonical" href={canonical} />
	{/if}
	{#each alternates as a (a.l)}
		<link rel="alternate" hreflang={a.l} href={a.href} />
	{/each}
	{#if alternates.length}
		<link rel="alternate" hreflang="x-default" href={alternates[0].href} />
	{/if}

	<meta property="og:site_name" content={m.site_name()} />
	<meta property="og:type" content={type} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={desc} />
	<meta property="og:locale" content={ogLocale} />
	{#if canonical}
		<meta property="og:url" content={canonical} />
	{/if}
	{#if ogImage}
		<meta property="og:image" content={ogImage} />
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
	{/if}
	<meta name="twitter:card" content="summary_large_image" />

	{#if ldTag}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- 自前データの JSON-LD のみ -->
		{@html ldTag}
	{/if}
</svelte:head>

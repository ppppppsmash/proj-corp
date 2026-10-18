<script lang="ts">
	import type { Path } from '$app/types';
	import { onNavigate } from '$app/navigation';
	import { asset, resolve } from '$app/paths';
	import { page } from '$app/state';
	import * as m from '#lib/paraglide/messages.js';
	import { getLocale, locales, localizeHref } from '#lib/paraglide/runtime.js';
	import SiteHeader from '#lib/components/layout/SiteHeader.svelte';
	import SiteFooter from '#lib/components/layout/SiteFooter.svelte';
	import './layout.css';
	import fontsUrl from '#lib/styles/fonts.css?url';
	import fontsZhUrl from '#lib/styles/fonts-zh.css?url';
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	// トップページだけヘッダーをヒーロー写真に重ねる
	const isHome = $derived(page.route.id === '/');

	// Web フォントの CSS は @font-face が数百件あり重いので、描画をブロックしないよう
	// SSR では preload だけ出し、ハイドレーション後に stylesheet として適用する。
	// JS 無効環境は <noscript> で通常読み込み。font-display: swap なので文字は先に出る。
	const fontSheets = $derived(getLocale() === 'zh' ? [fontsUrl, fontsZhUrl] : [fontsUrl]);

	$effect(() => {
		for (const href of fontSheets) {
			if (document.head.querySelector(`link[rel="stylesheet"][href="${href}"]`)) continue;
			const link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = href;
			document.head.append(link);
		}
	});

	// ページ遷移は View Transitions API で短くクロスフェード(対応ブラウザのみ)
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} type="image/svg+xml" />
	<link rel="apple-touch-icon" href={asset('apple-touch-icon.png')} />
	<meta name="theme-color" content="#0f201a" />
	{#each fontSheets as href (href)}
		<link rel="preload" as="style" {href} />
		<noscript><link rel="stylesheet" {href} /></noscript>
	{/each}
</svelte:head>

<a
	href="#main"
	class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-sumi-900 focus:px-4 focus:py-2 focus:text-kinari-50"
>
	{m.skip_to_content()}
</a>

<SiteHeader transparent={isHome} />

<main id="main" class={['min-h-svh', isHome ? '' : 'pt-16 md:pt-20']}>
	{@render children()}
</main>

<SiteFooter />

<!-- 静的生成時にクローラーへ全言語のURLを教えるための隠しリンク -->
<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }) as Path)}>{locale}</a>
	{/each}
</div>

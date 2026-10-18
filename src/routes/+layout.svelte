<script lang="ts">
	import type { Path } from '$app/types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { getLocale, locales, localizeHref } from '#lib/paraglide/runtime.js';
	import './layout.css';
	import fontsUrl from '#lib/styles/fonts.css?url';
	import fontsZhUrl from '#lib/styles/fonts-zh.css?url';
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

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
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	{#each fontSheets as href (href)}
		<link rel="preload" as="style" {href} />
		<noscript><link rel="stylesheet" {href} /></noscript>
	{/each}
</svelte:head>

{@render children()}

<!-- 静的生成時にクローラーへ全言語のURLを教えるための隠しリンク -->
<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }) as Path)}>{locale}</a>
	{/each}
</div>

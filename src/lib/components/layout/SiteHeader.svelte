<script lang="ts">
	import { page } from '$app/state';
	import { navItems } from '#lib/nav.js';
	import { localHref, isCurrentPath } from '#lib/utils/href.js';
	import LangSwitcher from './LangSwitcher.svelte';
	import MobileMenu from './MobileMenu.svelte';

	/**
	 * transparent: トップのヒーロー写真の上に重ねる(スクロール前は背景なし・文字は白)。
	 * スクロール後はどのページでも生成り背景 + 下罫線に切り替わる。
	 */
	let { transparent = false }: { transparent?: boolean } = $props();

	let scrollY = $state(0);
	const scrolled = $derived(scrollY > 24);
	const onDark = $derived(transparent && !scrolled);
</script>

<svelte:window bind:scrollY />

<header
	class={[
		'fixed inset-x-0 top-0 z-30 transition-[background-color,border-color,height] duration-500',
		scrolled ? 'border-b border-kinari-300 bg-kinari-100' : 'border-b border-transparent',
		onDark ? 'text-kinari-50' : 'text-sumi-900'
	]}
>
	<div
		class={[
			'container-site flex items-center justify-between transition-[height] duration-500',
			scrolled ? 'h-14 md:h-16' : 'h-16 md:h-20'
		]}
	>
		<a href={localHref('/')} class="flex items-baseline gap-3 no-underline">
			<span class="font-mincho text-xl font-bold tracking-heading md:text-2xl">漢松堂</span>
			<span
				class={[
					'hidden font-latin text-xs tracking-label uppercase sm:inline',
					onDark ? 'text-gold-300' : 'text-gold-700'
				]}
			>
				Kanshodo
			</span>
		</a>

		<nav class="hidden lg:block" aria-label="Global">
			<ul class="flex items-center gap-8">
				{#each navItems as item (item.href)}
					{@const current = isCurrentPath(page.url.pathname, item.href)}
					<li>
						<a
							href={localHref(item.href)}
							aria-current={current ? 'page' : undefined}
							class={[
								'relative py-2 text-sm tracking-wider no-underline transition-colors',
								'after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300',
								'hover:after:scale-x-100 aria-[current=page]:after:scale-x-100',
								onDark ? 'hover:text-gold-300' : 'hover:text-pine-700'
							]}
						>
							{item.label()}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<div class="flex items-center gap-6">
			<LangSwitcher tone={onDark ? 'light' : 'dark'} class="hidden lg:block" />
			<MobileMenu tone={onDark ? 'light' : 'dark'} />
		</div>
	</div>
</header>

<script lang="ts">
	import { page } from '$app/state';
	import * as m from '#lib/paraglide/messages.js';
	import { getLocale, locales, localizeHref } from '#lib/paraglide/runtime.js';

	let { tone = 'dark', class: className = '' }: { tone?: 'dark' | 'light'; class?: string } =
		$props();

	const labels = { ja: m.lang_ja, en: m.lang_en, zh: m.lang_zh } as const;
	const current = getLocale();
</script>

<!-- 言語切替。URL で言語を決めているため、確実に切り替わるよう全ページ再読込にする -->
<nav aria-label={m.lang_switch_label()} class={className}>
	<ul class="flex items-center gap-4 font-latin text-sm tracking-wider">
		{#each locales as locale, i (locale)}
			{#if i > 0}
				<li aria-hidden="true" class={tone === 'light' ? 'text-pine-300' : 'text-kinari-300'}>/</li>
			{/if}
			<li>
				<a
					href={localizeHref(page.url.pathname, { locale })}
					hreflang={locale}
					lang={locale}
					data-sveltekit-reload
					aria-current={locale === current ? 'true' : undefined}
					class={[
						'no-underline transition-colors',
						locale === current
							? tone === 'light'
								? 'text-kinari-50'
								: 'text-sumi-900'
							: tone === 'light'
								? 'text-pine-200 hover:text-kinari-50'
								: 'text-sumi-400 hover:text-sumi-900'
					]}
				>
					{labels[locale]()}
				</a>
			</li>
		{/each}
	</ul>
</nav>

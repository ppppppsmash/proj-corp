<script lang="ts">
	import * as m from '#lib/paraglide/messages.js';
	import { getLocale } from '#lib/paraglide/runtime.js';
	import { company } from '#lib/data/company.js';
	import { navItems } from '#lib/nav.js';
	import { localHref } from '#lib/utils/href.js';
	import LangSwitcher from './LangSwitcher.svelte';

	const locale = getLocale();
	const year = new Date().getFullYear();
</script>

<footer class="border-t border-gold-700 bg-pine-950 text-kinari-100">
	<div class="container-site grid gap-12 py-16 md:grid-cols-12 md:py-24">
		<div class="md:col-span-5">
			<p class="font-mincho text-2xl font-bold tracking-heading">漢松堂</p>
			<p class="mt-1 font-latin text-xs tracking-label text-gold-300 uppercase">
				{company.nameEn}
			</p>
			<p class="mt-8 max-w-[22em] font-mincho text-lg text-kinari-200">{m.site_tagline()}</p>
		</div>

		<nav class="md:col-span-3" aria-label={m.footer_sitemap()}>
			<p class="text-label text-gold-300">{m.footer_sitemap()}</p>
			<ul class="mt-5 flex flex-col gap-3 text-sm">
				{#each navItems as item (item.href)}
					<li>
						<a
							href={localHref(item.href)}
							class="text-kinari-200 no-underline transition-colors hover:text-kinari-50"
						>
							{item.label()}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<address class="text-sm not-italic md:col-span-4">
			<p class="text-label text-gold-300">{m.footer_company_info()}</p>
			<dl class="mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-kinari-200">
				<dt class="text-pine-300">{m.label_address()}</dt>
				<dd>〒{company.postalCode}<br />{company.address[locale]}</dd>
				<dt class="text-pine-300">{m.label_tel()}</dt>
				<dd>
					<a href="tel:{company.telIntl}" class="no-underline hover:text-kinari-50">
						{locale === 'ja' ? company.tel : company.telIntl}
					</a>
				</dd>
			</dl>
		</address>
	</div>

	<div class="border-t border-pine-700">
		<div
			class="container-site flex flex-col gap-5 py-6 text-xs text-pine-200 md:flex-row md:items-center md:justify-between"
		>
			<div class="flex items-center gap-6">
				<a href={localHref('/privacy')} class="no-underline hover:text-kinari-50">
					{m.footer_privacy()}
				</a>
				<LangSwitcher tone="light" />
			</div>
			<p class="font-latin tracking-wider">{m.footer_copyright({ year: String(year) })}</p>
		</div>
	</div>
</footer>

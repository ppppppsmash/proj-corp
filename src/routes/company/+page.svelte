<script lang="ts">
	import * as m from '#lib/paraglide/messages.js';
	import { getLocale } from '#lib/paraglide/runtime.js';
	import { reveal } from '#lib/actions/reveal.js';
	import { company } from '#lib/data/company.js';
	import PageHeader from '#lib/components/ui/PageHeader.svelte';
	import TextLink from '#lib/components/ui/TextLink.svelte';

	const locale = getLocale();
	const countries = { CN: m.country_cn, HK: m.country_hk, US: m.country_us } as const;
	const fullAddress = `〒${company.postalCode} ${company.address[locale]}`;
	// 埋め込み地図は重く、中国本土では表示できないため外部リンクにする
	const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.address.ja)}`;

	const rows: [string, string][] = [
		[
			m.company_name_label(),
			locale === 'ja' ? `${company.nameJa} / ${company.nameEn}` : company.nameEn
		],
		[m.company_founded(), m.company_founded_value()],
		[m.company_capital(), m.company_capital_value()],
		[m.company_rep(), company.representative[locale]],
		[m.company_address(), fullAddress],
		[m.company_tel(), locale === 'ja' ? company.tel : company.telIntl],
		[m.company_business(), m.company_business_value()],
		[
			m.company_countries(),
			company.tradingCountries.map((c) => countries[c]()).join(locale === 'en' ? ', ' : '、')
		],
		[m.company_bank(), company.bank[locale]]
	];
</script>

<svelte:head>
	<title>{m.nav_company()} | {m.site_name()}</title>
	<meta name="description" content="{company.nameJa} {m.company_business_value()}" />
</svelte:head>

<PageHeader label="Company" title={m.nav_company()} />

<section class="container-site pb-section">
	<dl class="border-t border-kinari-300" use:reveal>
		{#each rows as [label, value] (label)}
			<div class="grid gap-1 border-b border-kinari-300 py-5 md:grid-cols-12 md:gap-8 md:py-6">
				<dt class="text-sm text-sumi-500 md:col-span-3">{label}</dt>
				<dd class="md:col-span-9">{value}</dd>
			</div>
		{/each}
	</dl>
</section>

<section class="border-t border-kinari-300 bg-kinari-50">
	<div class="container-site grid gap-8 py-section md:grid-cols-12">
		<div class="md:col-span-4" use:reveal>
			<p class="text-label">Access</p>
			<h2 class="mt-4 text-2xl md:text-3xl">{m.access_title()}</h2>
		</div>
		<div class="md:col-span-8" use:reveal={{ delay: 120 }}>
			<p class="text-sumi-700">{fullAddress}</p>
			<p class="mt-2 text-sumi-700">
				<a href="tel:{company.telIntl}" class="no-underline hover:text-pine-700">
					{m.company_tel()}: {locale === 'ja' ? company.tel : company.telIntl}
				</a>
			</p>
			<div class="mt-8">
				<TextLink href={mapUrl}>{m.access_map_link()}</TextLink>
			</div>
		</div>
	</div>
</section>

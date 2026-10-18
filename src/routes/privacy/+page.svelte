<script lang="ts">
	import * as m from '#lib/paraglide/messages.js';
	import Seo from '#lib/components/Seo.svelte';
	import { getLocale } from '#lib/paraglide/runtime.js';
	import { company } from '#lib/data/company.js';
	import { getPage } from '#lib/content/pages.js';
	import PageHeader from '#lib/components/ui/PageHeader.svelte';

	const locale = getLocale();
	// 本文は src/content/pages/{locale}/privacy.md(法務確認後の修正はそちらで)
	const Policy = getPage(locale, 'privacy')?.default;
</script>

<Seo title={m.footer_privacy()} noindex />

<PageHeader label="Privacy Policy" title={m.footer_privacy()} />

<section class="container-site pb-section">
	<div class="prose-site max-w-[44rem] prose-headings:mt-12 prose-headings:text-xl">
		{#if Policy}<Policy />{/if}
	</div>
	<p class="mt-16 max-w-[44rem] border-t border-kinari-300 pt-6 text-right text-sm text-sumi-500">
		{m.privacy_established()}: {m.privacy_date()}<br />
		{locale === 'ja' ? company.nameJa : company.nameEn}
	</p>
</section>

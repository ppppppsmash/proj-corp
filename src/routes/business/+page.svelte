<script lang="ts">
	import * as m from '#lib/paraglide/messages.js';
	import Seo from '#lib/components/Seo.svelte';
	import { getLocale } from '#lib/paraglide/runtime.js';
	import { reveal } from '#lib/actions/reveal.js';
	import { getPage } from '#lib/content/pages.js';
	import { localHref } from '#lib/utils/href.js';
	import Button from '#lib/components/ui/Button.svelte';
	import PageHeader from '#lib/components/ui/PageHeader.svelte';
	import TextLink from '#lib/components/ui/TextLink.svelte';

	const locale = getLocale();
	const Brand = getPage(locale, 'brand')?.default;
	const Oem = getPage(locale, 'oem')?.default;

	const steps = [
		{ title: m.oem_step1_title, body: m.oem_step1_body },
		{ title: m.oem_step2_title, body: m.oem_step2_body },
		{ title: m.oem_step3_title, body: m.oem_step3_body },
		{ title: m.oem_step4_title, body: m.oem_step4_body }
	];
</script>

<Seo title={m.nav_business()} description={m.business_lead()} />

<PageHeader label="Business" title={m.nav_business()} lead={m.business_lead()} />

<!-- 01 自社ブランド事業 -->
<section id="brand" class="container-site grid gap-10 pb-section md:grid-cols-12 md:gap-12">
	<div class="md:col-span-4" use:reveal>
		<p class="font-latin text-5xl text-gold-500 tabular-nums">01</p>
		<h2 class="mt-6 text-2xl md:text-3xl">{m.business_brand_title()}</h2>
		<p class="mt-2 font-latin text-xs tracking-label text-sumi-400 uppercase">Own Brand</p>
	</div>
	<div class="md:col-span-8" use:reveal={{ delay: 120 }}>
		<div class="prose-site max-w-[38em]">
			{#if Brand}<Brand />{/if}
		</div>
		<div class="mt-8">
			<TextLink href={localHref('/products')}>{m.nav_products()}</TextLink>
		</div>
	</div>
</section>

<!-- 02 OEM・ODM -->
<section id="oem" class="border-t border-kinari-300 bg-kinari-50">
	<div class="container-site grid gap-10 py-section md:grid-cols-12 md:gap-12">
		<div class="md:col-span-4" use:reveal>
			<p class="font-latin text-5xl text-gold-500 tabular-nums">02</p>
			<h2 class="mt-6 text-2xl md:text-3xl">{m.business_oem_title()}</h2>
			<p class="mt-2 font-latin text-xs tracking-label text-sumi-400 uppercase">OEM / ODM</p>
		</div>
		<div class="md:col-span-8" use:reveal={{ delay: 120 }}>
			<div class="prose-site max-w-[38em]">
				{#if Oem}<Oem />{/if}
			</div>

			<h3 class="mt-16 text-xl">{m.oem_process_title()}</h3>
			<ol class="mt-6 border-t border-kinari-300">
				{#each steps as step, i (i)}
					<li
						class="grid grid-cols-[3rem_1fr] gap-4 border-b border-kinari-300 py-6 md:grid-cols-[4rem_16rem_1fr] md:gap-8"
					>
						<span class="font-latin text-2xl text-gold-500 tabular-nums">
							{String(i + 1).padStart(2, '0')}
						</span>
						<h4 class="text-lg">{step.title()}</h4>
						<p class="col-start-2 text-sm text-sumi-700 md:col-start-3">{step.body()}</p>
					</li>
				{/each}
			</ol>

			<p class="mt-10 max-w-[36em] text-sumi-700">{m.oem_cta_body()}</p>
			<div class="mt-8">
				<Button href="{localHref('/contact')}?type=oem">{m.cta_oem()}</Button>
			</div>
		</div>
	</div>
</section>

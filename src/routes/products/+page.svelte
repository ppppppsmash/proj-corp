<script lang="ts">
	import * as m from '#lib/paraglide/messages.js';
	import Seo from '#lib/components/Seo.svelte';
	import { reveal } from '#lib/actions/reveal.js';
	import { company, product } from '#lib/data/company.js';
	import { config } from '#lib/config.js';
	import Button from '#lib/components/ui/Button.svelte';
	import PageHeader from '#lib/components/ui/PageHeader.svelte';
	import ProductImage from '#lib/components/ui/ProductImage.svelte';

	const amazonUrl = config.amazonUrl;
	const p = product.perServing;

	const features = [
		{ title: m.feature1_title, body: m.feature1_body },
		{ title: m.feature2_title, body: m.feature2_body },
		{ title: m.feature3_title, body: m.feature3_body }
	];

	const nutrition = [
		[m.nutrition_energy, `${p.energyKcal} kcal`],
		[m.nutrition_protein, `${p.proteinG} g`],
		[m.nutrition_fat, `${p.fatG} g`],
		[m.nutrition_carb, `${p.carbG} g`],
		[m.nutrition_salt, `${p.saltG} g`]
	] as const;
</script>

<Seo
	title={m.product_name()}
	description={m.product_summary()}
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'Product',
		name: m.product_name(),
		description: m.product_summary(),
		gtin13: product.jan,
		brand: { '@type': 'Brand', name: 'KANSHODO' },
		manufacturer: { '@type': 'Organization', name: company.nameJa },
		...(config.siteUrl ? { image: `${config.siteUrl}/og.png` } : {})
	}}
/>

<PageHeader label="Products" title={m.nav_products()} />

<!-- 製品概要 -->
<section class="container-site grid gap-12 pb-section md:grid-cols-12 md:gap-16">
	<div class="overflow-hidden md:col-span-5" use:reveal>
		<ProductImage class="aspect-[4/5] h-auto w-full object-cover" priority />
	</div>
	<div class="md:col-span-7" use:reveal={{ delay: 120 }}>
		<p class="text-label">NMN 45000 + CoQ10</p>
		<h2 class="mt-4 text-2xl leading-[1.5] break-keep md:text-3xl">{m.product_name()}</h2>
		<p class="mt-6 max-w-[36em] text-sumi-700">{m.product_summary()}</p>

		<dl
			class="mt-10 grid grid-cols-[auto_1fr] gap-x-8 gap-y-4 border-t border-kinari-300 pt-8 text-sm"
		>
			<dt class="text-sumi-500">{m.spec_supply()}</dt>
			<dd>{m.spec_supply_value()}</dd>
			<dt class="text-sumi-500">{m.spec_intake()}</dt>
			<dd>{m.spec_intake_value()}</dd>
			<dt class="text-sumi-500">{m.spec_factory()}</dt>
			<dd>{m.spec_factory_value()}</dd>
		</dl>

		<div class="mt-10 flex flex-wrap items-center gap-4">
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

<!-- 特長 -->
<section class="border-t border-kinari-300 bg-kinari-50">
	<div class="container-site py-section">
		<p class="text-label" use:reveal>Features</p>
		<h2 class="mt-4 text-3xl md:text-4xl" use:reveal>{m.product_features_title()}</h2>
		<ol class="mt-12 border-t border-kinari-300">
			{#each features as f, i (i)}
				<li class="border-b border-kinari-300" use:reveal={{ delay: i * 100 }}>
					<div class="grid gap-4 py-8 md:grid-cols-12 md:gap-10 md:py-10">
						<span class="font-latin text-3xl text-gold-500 tabular-nums md:col-span-2">
							{String(i + 1).padStart(2, '0')}
						</span>
						<h3 class="text-xl md:col-span-4">{f.title()}</h3>
						<p class="text-sumi-700 md:col-span-6">{f.body()}</p>
					</div>
				</li>
			{/each}
		</ol>
	</div>
</section>

<!-- 製品情報(表示) -->
<section class="container-site py-section">
	<p class="text-label" use:reveal>Specifications</p>
	<h2 class="mt-4 text-3xl md:text-4xl" use:reveal>{m.spec_title()}</h2>

	<div class="mt-12 border-t border-kinari-300 text-sm" use:reveal>
		<dl class="divide-y divide-kinari-300">
			<div class="grid gap-2 py-5 md:grid-cols-12 md:gap-8">
				<dt class="text-sumi-500 md:col-span-3">{m.spec_jan()}</dt>
				<dd class="font-latin text-base tracking-wider tabular-nums md:col-span-9">
					{product.jan}
				</dd>
			</div>
			<div class="grid gap-2 py-5 md:grid-cols-12 md:gap-8">
				<dt class="text-sumi-500 md:col-span-3">{m.spec_ingredients()}</dt>
				<dd class="leading-relaxed md:col-span-9">{m.spec_ingredients_value()}</dd>
			</div>
			<div class="grid gap-2 py-5 md:grid-cols-12 md:gap-8">
				<dt class="text-sumi-500 md:col-span-3">{m.spec_net()}</dt>
				<dd class="md:col-span-9">{m.spec_net_value()}</dd>
			</div>
			<div class="grid gap-2 py-5 md:grid-cols-12 md:gap-8">
				<dt class="text-sumi-500 md:col-span-3">
					{m.spec_nutrition()}<br />
					<span class="text-xs">{m.spec_per_serving()}</span>
				</dt>
				<dd class="md:col-span-9">
					<table class="w-full max-w-md text-left">
						<tbody class="divide-y divide-kinari-200">
							{#each nutrition as [label, value] (label)}
								<tr>
									<th scope="row" class="py-2 pr-4 font-normal text-sumi-700">{label()}</th>
									<td class="py-2 text-right font-latin text-base tabular-nums">{value}</td>
								</tr>
							{/each}
						</tbody>
					</table>
					<p class="mt-2 text-xs text-sumi-500">({m.nutrition_estimated()})</p>
				</dd>
			</div>
			<div class="grid gap-2 py-5 md:grid-cols-12 md:gap-8">
				<dt class="text-sumi-500 md:col-span-3">
					{m.spec_active()}<br />
					<span class="text-xs">{m.spec_per_serving()}</span>
				</dt>
				<dd class="md:col-span-9">
					<table class="w-full max-w-md text-left">
						<tbody class="divide-y divide-kinari-200">
							<tr>
								<th scope="row" class="py-2 pr-4 font-normal text-sumi-700">{m.active_nmn()}</th>
								<td class="py-2 text-right font-latin text-base tabular-nums">{p.nmnMg} mg</td>
							</tr>
							<tr>
								<th scope="row" class="py-2 pr-4 font-normal text-sumi-700">{m.active_coq10()}</th>
								<td class="py-2 text-right font-latin text-base tabular-nums"
									>{p.reducedCoq10Mg} mg</td
								>
							</tr>
						</tbody>
					</table>
				</dd>
			</div>
			<div class="grid gap-2 py-5 md:grid-cols-12 md:gap-8">
				<dt class="text-sumi-500 md:col-span-3">{m.spec_usage()}</dt>
				<dd class="md:col-span-9">{m.spec_usage_value()}</dd>
			</div>
			<div class="grid gap-2 py-5 md:grid-cols-12 md:gap-8">
				<dt class="text-sumi-500 md:col-span-3">{m.spec_storage()}</dt>
				<dd class="md:col-span-9">{m.spec_storage_value()}</dd>
			</div>
		</dl>
	</div>
	<p class="mt-8 text-xs text-sumi-500">{m.product_note()}</p>
</section>

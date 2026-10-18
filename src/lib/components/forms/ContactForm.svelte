<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { superForm, defaults } from 'sveltekit-superforms';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import * as m from '#lib/paraglide/messages.js';
	import { getLocale } from '#lib/paraglide/runtime.js';
	import { config } from '#lib/config.js';
	import { company } from '#lib/data/company.js';
	import {
		contactSchema,
		contactDefaults,
		inquiryTypes,
		inquiryTypeLabel,
		type InquiryType
	} from '#lib/forms/contact.js';
	import { localHref } from '#lib/utils/href.js';
	import Button from '#lib/components/ui/Button.svelte';

	/**
	 * 静的サイトなのでサーバーの form action は使えない。
	 * superforms の SPA モードでクライアント側バリデーションを行い、
	 * config.contactEndpoint に JSON を POST する(Formspree / Worker など差し替え可)。
	 */
	type Status = 'idle' | 'sent' | 'failed' | 'unavailable';
	let status = $state<Status>('idle');
	const locale = getLocale();

	const { form, errors, submitting, enhance, constraints } = superForm(
		defaults(contactDefaults, valibotClient(contactSchema)),
		{
			SPA: true,
			validators: valibotClient(contactSchema),
			validationMethod: 'oninput',
			resetForm: false,
			async onUpdate({ form: f }) {
				if (!f.valid) return;
				if (f.data.website) {
					// ハニーポットに入力あり: 成功を装って捨てる
					status = 'sent';
					return;
				}
				if (!config.contactEndpoint) {
					status = 'unavailable';
					return;
				}
				try {
					const res = await fetch(config.contactEndpoint, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
						body: JSON.stringify({ ...f.data, website: undefined, locale, page: page.url.href })
					});
					status = res.ok ? 'sent' : res.status === 503 ? 'unavailable' : 'failed';
				} catch {
					status = 'failed';
				}
			}
		}
	);

	// /contact?type=oem のように種別を事前選択できる(事業ページの CTA から)
	onMount(() => {
		const t = page.url.searchParams.get('type');
		if (t && (inquiryTypes as readonly string[]).includes(t)) $form.type = t as InquiryType;
	});

	const fieldClass =
		'w-full border-0 border-b border-kinari-300 bg-transparent px-0 py-3 text-base text-sumi-900 ' +
		'placeholder:text-sumi-300 focus:border-pine-700 focus:ring-0 focus:outline-none ' +
		'aria-[invalid=true]:border-error';
</script>

{#if status === 'sent'}
	<div class="border-t border-gold-500 pt-8" role="status" aria-live="polite">
		<h2 class="text-2xl">{m.contact_success_title()}</h2>
		<p class="mt-4 max-w-[36em] text-sumi-700">{m.contact_success_body()}</p>
	</div>
{:else}
	<form method="POST" use:enhance novalidate class="grid gap-10">
		<!-- 種別 -->
		<fieldset>
			<legend class="text-sm text-sumi-700">
				{m.contact_type()}
				<span class="ml-2 text-xs text-gold-700">{m.contact_required()}</span>
			</legend>
			<div class="mt-4 flex flex-wrap gap-x-8 gap-y-3">
				{#each inquiryTypes as t (t)}
					<label class="inline-flex cursor-pointer items-center gap-3 text-sm">
						<input
							type="radio"
							name="type"
							value={t}
							bind:group={$form.type}
							class="h-4 w-4 accent-pine-900"
						/>
						{inquiryTypeLabel[t]()}
					</label>
				{/each}
			</div>
		</fieldset>

		<div class="grid gap-8 md:grid-cols-2">
			<!-- 会社名 -->
			<div>
				<label for="company" class="text-sm text-sumi-700">
					{m.contact_company()}
					<span class="ml-2 text-xs text-sumi-400">{m.contact_optional()}</span>
				</label>
				<input
					id="company"
					name="company"
					type="text"
					autocomplete="organization"
					bind:value={$form.company}
					class={fieldClass}
					{...$constraints.company}
				/>
			</div>

			<!-- お名前 -->
			<div>
				<label for="name" class="text-sm text-sumi-700">
					{m.contact_name()}
					<span class="ml-2 text-xs text-gold-700">{m.contact_required()}</span>
				</label>
				<input
					id="name"
					name="name"
					type="text"
					autocomplete="name"
					bind:value={$form.name}
					aria-invalid={$errors.name ? 'true' : undefined}
					aria-describedby={$errors.name ? 'name-error' : undefined}
					class={fieldClass}
					required
				/>
				{#if $errors.name}<p id="name-error" class="mt-2 text-sm text-error">
						{$errors.name[0]}
					</p>{/if}
			</div>

			<!-- メール -->
			<div>
				<label for="email" class="text-sm text-sumi-700">
					{m.contact_email()}
					<span class="ml-2 text-xs text-gold-700">{m.contact_required()}</span>
				</label>
				<input
					id="email"
					name="email"
					type="email"
					autocomplete="email"
					inputmode="email"
					bind:value={$form.email}
					aria-invalid={$errors.email ? 'true' : undefined}
					aria-describedby={$errors.email ? 'email-error' : undefined}
					class={fieldClass}
					required
				/>
				{#if $errors.email}<p id="email-error" class="mt-2 text-sm text-error">
						{$errors.email[0]}
					</p>{/if}
			</div>

			<!-- 電話 -->
			<div>
				<label for="tel" class="text-sm text-sumi-700">
					{m.contact_tel()}
					<span class="ml-2 text-xs text-sumi-400">{m.contact_optional()}</span>
				</label>
				<input
					id="tel"
					name="tel"
					type="tel"
					autocomplete="tel"
					inputmode="tel"
					bind:value={$form.tel}
					aria-invalid={$errors.tel ? 'true' : undefined}
					aria-describedby={$errors.tel ? 'tel-error' : undefined}
					class={fieldClass}
				/>
				{#if $errors.tel}<p id="tel-error" class="mt-2 text-sm text-error">{$errors.tel[0]}</p>{/if}
			</div>
		</div>

		<!-- 内容 -->
		<div>
			<label for="message" class="text-sm text-sumi-700">
				{m.contact_message()}
				<span class="ml-2 text-xs text-gold-700">{m.contact_required()}</span>
			</label>
			<textarea
				id="message"
				name="message"
				rows="7"
				bind:value={$form.message}
				aria-invalid={$errors.message ? 'true' : undefined}
				aria-describedby="message-hint{$errors.message ? ' message-error' : ''}"
				class="{fieldClass} resize-y leading-relaxed"
				required></textarea>
			<p id="message-hint" class="mt-2 text-xs text-sumi-500">{m.contact_message_hint()}</p>
			{#if $errors.message}<p id="message-error" class="mt-2 text-sm text-error">
					{$errors.message[0]}
				</p>{/if}
		</div>

		<!-- ハニーポット(画面外。人間は触らない) -->
		<div class="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
			<label for="website">Website</label>
			<input
				id="website"
				name="website"
				type="text"
				tabindex="-1"
				autocomplete="off"
				bind:value={$form.website}
			/>
		</div>

		<!-- 同意 -->
		<div>
			<label class="inline-flex cursor-pointer items-start gap-3 text-sm">
				<input
					type="checkbox"
					name="agree"
					bind:checked={$form.agree}
					aria-invalid={$errors.agree ? 'true' : undefined}
					class="mt-1 h-4 w-4 accent-pine-900"
				/>
				<span>
					{m.contact_agree()}
					<a
						href={localHref('/privacy')}
						class="ml-2 text-pine-700 underline"
						target="_blank"
						rel="noopener"
					>
						{m.footer_privacy()}
					</a>
				</span>
			</label>
			{#if $errors.agree}<p class="mt-2 text-sm text-error">{$errors.agree[0]}</p>{/if}
		</div>

		{#if status === 'failed'}
			<p class="border-l-2 border-error pl-4 text-sm text-error" role="alert">
				{m.contact_error_body()}
			</p>
		{:else if status === 'unavailable'}
			<p class="border-l-2 border-gold-500 pl-4 text-sm text-sumi-700" role="alert">
				{m.contact_unavailable()}
			</p>
		{/if}

		<div class="flex flex-wrap items-center gap-6">
			<Button type="submit" variant="solid" disabled={$submitting}>
				{$submitting ? m.contact_submitting() : m.contact_submit()}
			</Button>
		</div>
	</form>
{/if}

<aside class="mt-16 border-t border-kinari-300 pt-8 text-sm text-sumi-700">
	<p class="text-label">Tel</p>
	<p class="mt-3">
		{m.contact_tel_label()}:
		<a
			href="tel:{company.telIntl}"
			class="ml-2 font-latin text-lg tracking-wider no-underline hover:text-pine-700"
		>
			{locale === 'ja' ? company.tel : company.telIntl}
		</a>
	</p>
</aside>

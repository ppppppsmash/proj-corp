<script lang="ts">
	import { Dialog } from 'bits-ui';
	import { page } from '$app/state';
	import * as m from '#lib/paraglide/messages.js';
	import { navItems } from '#lib/nav.js';
	import { localHref, isCurrentPath } from '#lib/utils/href.js';
	import LangSwitcher from './LangSwitcher.svelte';

	let { tone = 'dark' }: { tone?: 'dark' | 'light' } = $props();

	let open = $state(false);

	// ページ遷移したら閉じる
	$effect(() => {
		void page.url.pathname;
		open = false;
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger
		class={[
			'group -mr-2 flex h-11 w-11 flex-col items-center justify-center gap-1.5 lg:hidden',
			tone === 'light' ? 'text-kinari-50' : 'text-sumi-900'
		]}
		aria-label={m.nav_menu_open()}
	>
		<span class="block h-px w-6 bg-current transition-transform"></span>
		<span class="block h-px w-6 bg-current transition-transform"></span>
	</Dialog.Trigger>

	<Dialog.Portal>
		<Dialog.Overlay
			class="fixed inset-0 z-40 bg-pine-950/60 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in"
		/>
		<Dialog.Content
			class="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-pine-950 px-5 pt-5 pb-10 text-kinari-50 data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in"
		>
			<div class="flex h-14 items-center justify-between">
				<Dialog.Title class="font-mincho text-xl font-bold tracking-heading">
					{m.site_name()}
				</Dialog.Title>
				<Dialog.Description class="sr-only">{m.nav_menu_open()}</Dialog.Description>
				<Dialog.Close
					class="relative -mr-2 h-11 w-11 text-kinari-50"
					aria-label={m.nav_menu_close()}
				>
					<span class="absolute top-1/2 left-1/2 block h-px w-6 -translate-1/2 rotate-45 bg-current"
					></span>
					<span
						class="absolute top-1/2 left-1/2 block h-px w-6 -translate-1/2 -rotate-45 bg-current"
					></span>
				</Dialog.Close>
			</div>

			<nav class="mt-12 flex-1" aria-label={m.nav_menu_open()}>
				<ol class="flex flex-col divide-y divide-pine-700">
					{#each navItems as item, i (item.href)}
						<li>
							<a
								href={localHref(item.href)}
								aria-current={isCurrentPath(page.url.pathname, item.href) ? 'page' : undefined}
								class="flex items-baseline gap-5 py-5 no-underline"
							>
								<span class="font-latin text-sm text-gold-300 tabular-nums">
									{String(i + 1).padStart(2, '0')}
								</span>
								<span class="font-mincho text-2xl">{item.label()}</span>
								<span class="ml-auto font-latin text-xs tracking-label text-pine-300 uppercase">
									{item.en}
								</span>
							</a>
						</li>
					{/each}
				</ol>
			</nav>

			<LangSwitcher tone="light" class="mt-12" />
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

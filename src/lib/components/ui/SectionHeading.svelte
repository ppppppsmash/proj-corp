<script lang="ts">
	import type { Snippet } from 'svelte';
	/** セクション共通の見出し。英字ラベル + 見出し。右側に任意のリンク等。 */
	let {
		label,
		title,
		tone = 'dark',
		aside
	}: { label: string; title: string; tone?: 'dark' | 'light'; aside?: Snippet } = $props();
</script>

<div class="flex flex-wrap items-end justify-between gap-6">
	<div>
		<p class={['text-label', tone === 'light' && 'text-gold-300']}>{label}</p>
		<h2 class="mt-4 text-3xl md:text-4xl">{title}</h2>
	</div>
	{#if aside}
		<div class="pb-1">{@render aside()}</div>
	{/if}
</div>

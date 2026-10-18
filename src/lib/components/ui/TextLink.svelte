<script lang="ts">
	import type { Snippet } from 'svelte';
	/** 「詳しく見る →」の矢印を使わない代わりに、短い罫線が伸びるテキストリンク。 */
	let {
		href,
		tone = 'dark',
		children
	}: { href: string; tone?: 'dark' | 'light'; children: Snippet } = $props();
</script>

<a
	{href}
	class={[
		'group inline-flex items-center gap-4 text-sm tracking-wider no-underline',
		tone === 'light' ? 'text-kinari-100 hover:text-gold-300' : 'text-sumi-900 hover:text-pine-700'
	]}
>
	<span
		class={[
			'block h-px w-8 transition-[width] duration-300 group-hover:w-12',
			tone === 'light' ? 'bg-gold-300' : 'bg-gold-500'
		]}
	></span>
	{@render children()}
</a>

<script lang="ts">
	/** 下層ページ共通の見出し。英字ラベル + 日本語見出し + 任意のリード文。 */
	let { label, title, lead }: { label: string; title: string; lead?: string } = $props();
</script>

<header class="container-site pt-16 pb-12 md:pt-24 md:pb-20">
	<p class="text-label">{label}</p>
	<h1 class="mt-4 text-3xl md:text-5xl">{title}</h1>
	{#if lead}
		<p class="mt-6 max-w-[38em] text-sumi-700">{lead}</p>
	{/if}
	<hr class="mt-10 w-16 border-gold-500" />
</header>

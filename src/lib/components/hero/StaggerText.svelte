<script lang="ts">
	/**
	 * 文字を1つずつ時間差で出現させる見出し。
	 * - 単語(空白区切り)ごとに inline-block で包み、英語が単語の途中で折れないようにする。
	 *   日本語・中国語は空白が無いので全体が1単語になるが、CJK はどこでも折り返せる。
	 * - SSR では全文字がそのまま出力され、CSS アニメーションだけで動く(JS 不要)。
	 * - prefers-reduced-motion ではアニメーションしない(layout.css)。
	 */
	let {
		text,
		delay = 0,
		step = 70,
		class: className = ''
	}: { text: string; delay?: number; step?: number; class?: string } = $props();

	// 単語ごとに文字配列と、通し番号の開始位置(アニメーション遅延の計算用)を持つ
	const words = $derived.by(() => {
		let start = 0;
		return text
			.split(/(\s+)/)
			.filter(Boolean)
			.map((w) => {
				const chars = /^\s+$/.test(w) ? [' '] : Array.from(w);
				const word = { chars, start };
				start += chars.length;
				return word;
			});
	});
</script>

<span class={className} aria-label={text}>
	{#each words as word, wi (wi)}
		<span class="inline-block whitespace-nowrap" aria-hidden="true">
			{#each word.chars as ch, ci (ci)}
				<span class="hero-char" style="--d:{delay + (word.start + ci) * step}ms">{ch}</span>
			{/each}
		</span>
	{/each}
</span>

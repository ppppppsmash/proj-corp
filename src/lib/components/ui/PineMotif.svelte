<script lang="ts">
	/**
	 * 松葉を抽象化した細い線のモチーフ。写真が入るまでの背景、
	 * またはセクションの飾りとして控えめに使う(装飾は1画面に1つまで)。
	 */
	let { class: className = '' }: { class?: string } = $props();

	// 3つの針葉の束。各束は1点から放射する細線
	const clusters = [
		{ x: 640, y: 420, r: 260, from: -150, to: -30, n: 9 },
		{ x: 300, y: 560, r: 200, from: -120, to: 0, n: 7 },
		{ x: 980, y: 300, r: 180, from: -200, to: -90, n: 6 }
	];
	const rad = (d: number) => (d * Math.PI) / 180;
	const lines = clusters.map((c) =>
		Array.from({ length: c.n }, (_, i) => {
			const a = c.from + ((c.to - c.from) * i) / (c.n - 1);
			return {
				x2: c.x + Math.cos(rad(a)) * c.r,
				y2: c.y + Math.sin(rad(a)) * c.r,
				opacity: 0.35 + (i % 3) * 0.2
			};
		})
	);
</script>

<svg
	viewBox="0 0 1200 800"
	preserveAspectRatio="xMidYMid slice"
	class={className}
	aria-hidden="true"
	fill="none"
	stroke="currentColor"
	stroke-width="1"
	stroke-linecap="round"
>
	{#each clusters as c, ci (ci)}
		{#each lines[ci] as l, i (i)}
			<line x1={c.x} y1={c.y} x2={l.x2} y2={l.y2} opacity={l.opacity} />
		{/each}
		<circle cx={c.x} cy={c.y} r="2" fill="currentColor" stroke="none" />
	{/each}
</svg>

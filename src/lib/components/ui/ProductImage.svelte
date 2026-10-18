<script lang="ts">
	import * as m from '#lib/paraglide/messages.js';
	// TODO: 実際のパッケージ写真に差し替える(同じファイル名で上書きすれば他は変更不要)
	import sample from '../../assets/product-sample.png?enhanced';

	/**
	 * 主力製品の画像。enhanced:img がビルド時に AVIF / WebP と複数サイズを生成する。
	 * priority: ファーストビューに入る場合は true(遅延読み込みを切り、優先取得)
	 */
	let {
		class: className = '',
		sizes = '(min-width: 768px) 40vw, 100vw',
		priority = false
	}: { class?: string; sizes?: string; priority?: boolean } = $props();
</script>

<enhanced:img
	src={sample}
	alt={m.product_name()}
	{sizes}
	loading={priority ? 'eager' : 'lazy'}
	fetchpriority={priority ? 'high' : 'auto'}
	class={className}
/>

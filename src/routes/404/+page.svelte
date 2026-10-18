<script lang="ts">
	// 静的ホスティング(Cloudflare Pages / Netlify / GitHub Pages 等)が
	// 存在しない URL に対して返す build/404.html を生成するためのページ。
	import ErrorView from '#lib/components/ui/ErrorView.svelte';
</script>

<ErrorView status={404} />

<script lang="ts">
	import * as m from '#lib/paraglide/messages.js';
</script>

<svelte:head>
	<title>{m.site_name()} | {m.site_tagline()}</title>
</svelte:head>

<!-- ヒーロー(仮)。写真は後で差し替える -->
<section class="flex min-h-svh items-end bg-pine-900 text-kinari-50">
	<div class="container-site pb-20 md:pb-28">
		<p class="text-label text-gold-300">Kanshodo</p>
		<h1 class="mt-6 text-4xl md:text-6xl">{m.site_tagline()}</h1>
	</div>
</section>

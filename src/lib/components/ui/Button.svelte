<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	type Variant = 'solid' | 'outline' | 'ghost';
	type Tone = 'dark' | 'light';

	type Props = {
		variant?: Variant;
		tone?: Tone;
		href?: string;
		class?: string;
		children: Snippet;
	} & Omit<HTMLAnchorAttributes, 'href' | 'class'> &
		Omit<HTMLButtonAttributes, 'class'>;

	let {
		variant = 'outline',
		tone = 'dark',
		href,
		class: className = '',
		children,
		...rest
	}: Props = $props();

	// 角丸なし・影なし。hover は色の反転のみ。
	const base =
		'inline-flex items-center justify-center gap-3 border px-6 py-3 font-gothic text-sm tracking-wider ' +
		'no-underline transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50';

	const styles: Record<Tone, Record<Variant, string>> = {
		dark: {
			solid: 'border-sumi-900 bg-sumi-900 text-kinari-50 hover:bg-pine-900 hover:border-pine-900',
			outline: 'border-sumi-900 text-sumi-900 hover:bg-sumi-900 hover:text-kinari-50',
			ghost: 'border-transparent text-sumi-900 hover:text-pine-700'
		},
		light: {
			solid:
				'border-kinari-50 bg-kinari-50 text-sumi-900 hover:bg-kinari-200 hover:border-kinari-200',
			outline: 'border-kinari-50 text-kinari-50 hover:bg-kinari-50 hover:text-sumi-900',
			ghost: 'border-transparent text-kinari-50 hover:text-gold-300'
		}
	};

	const classes = $derived(`${base} ${styles[tone][variant]} ${className}`);
</script>

{#if href}
	<a {href} class={classes} {...rest as HTMLAnchorAttributes}>
		{@render children()}
	</a>
{:else}
	<button class={classes} {...rest as HTMLButtonAttributes}>
		{@render children()}
	</button>
{/if}

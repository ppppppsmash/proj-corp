import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { mdsvex } from 'mdsvex';
import { enhancedImages } from '@sveltejs/enhanced-img';
import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		enhancedImages(),
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			// 全ページを静的生成(SSG)。問い合わせフォームの送信先が決まったら
			// adapter-cloudflare 等へ差し替える。
			adapter: adapter({ strict: true }),
			preprocess: [mdsvex({ extensions: ['.svx', '.md'] })],
			extensions: ['.svelte', '.svx', '.md']
		}),

		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			emitTsDeclarations: true,
			// 静的サイトなので Cookie ではなく URL で言語を決める。
			// ja: /about  en: /en/about  zh: /zh/about
			strategy: ['url', 'baseLocale']
		})
	]
});

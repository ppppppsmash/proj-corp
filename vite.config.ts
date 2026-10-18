import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { mdsvex } from 'mdsvex';
import { enhancedImages } from '@sveltejs/enhanced-img';
import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-vercel';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		// フォント小片を base64 で CSS に埋め込まない(CSS が 1MB 超になるため)
		assetsInlineLimit: 0
	},
	plugins: [
		enhancedImages(),
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			// Vercel にデプロイ。ページは +layout.ts の prerender = true で全て静的生成し、
			// サーバー関数になるのは /api/contact(問い合わせメール送信)だけ。
			adapter: adapter({ runtime: 'nodejs22.x' }),
			// resolve() が '../company' のような相対パスではなく '/company' を返すようにする。
			// Paraglide の localizeHref() は '/' 始まりのパスしか相対 URL として扱わないため。
			paths: { relative: false },
			preprocess: [mdsvex({ extensions: ['.svx', '.md'] })],
			extensions: ['.svelte', '.svx', '.md']
		}),

		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			emitTsDeclarations: true,
			// 静的サイトなので Cookie ではなく URL で言語を決める。
			// ja: /about  en: /en/about  zh: /zh/about
			strategy: ['url', 'baseLocale'],
			// SvelteKit 側(既定 never)と揃え、トップが /en/ ではなく /en になるようにする
			trailingSlash: 'never'
		})
	]
});

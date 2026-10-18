# 漢松堂株式会社 コーポレートサイト

## スタック
- SvelteKit 3 / Svelte 5 (runes 強制)。設定は `vite.config.ts` に集約(svelte.config.js は無い)
- `$lib` ではなく `#lib` エイリアス(package.json の `imports`)
- adapter-static で全ページ SSG(`src/routes/+layout.ts` の `prerender = true`)
- Tailwind v4。トークンは `src/routes/layout.css` の `@theme` のみで定義する
- 多言語: Paraglide JS。`messages/{ja,en,zh}.json`、URL 戦略(ja は無接頭辞、/en、/zh)
- 長文コンテンツ: mdsvex(`src/content/`)。UI 文言は messages、固定データは `src/lib/data/`
- UI プリミティブ: bits-ui(見た目は付けない)。フォーム: sveltekit-superforms + valibot。モーション: motion
- フォントは @fontsource で自前配信(中国本土で Google Fonts が使えないため)。Google Maps 埋め込みも同じ理由で避ける

## デザインルール(AI っぽさを出さないため)
- 色は pine / sumi / kinari / gold のトークンのみ。グラデーション・ガラス風・影は禁止。金は罫線とラベルだけ
- 角丸ゼロ。アイコン付き3カラムカード禁止。見出しは左揃え
- 見出し `font-mincho`、本文 `font-gothic`、英字ラベルは `text-label` ユーティリティ
- モーションは出現時1回、300〜500ms、`prefers-reduced-motion` を尊重
- 写真は実写のみ。分子CG・DNA・白衣ストック写真は使わない

## 法務
- いわゆる健康食品のため、効能効果の標榜(抗老化、細胞、吸収、NAD+ など)は薬機法・景表法に抵触しうる。商品・理念の文言は公開前に法務チェック

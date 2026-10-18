# 漢松堂コーポレートサイト 作業メモ

最終更新: 2026-10-18 / コミット数: 61 / CI: green / リポジトリ: `git@github.com:ppppppsmash/proj-corp.git`

---

## 1. 概要

- クライアント: 漢松堂株式会社(NMN 健康食品の自社ブランド + OEM・ODM 受託)
- 言語: 日本語(既定)/ 英語 `/en` / 中国語簡体字 `/zh`
- デザイン方針: 「日本的ミニマル × ラグジュアリー」。松の深緑・墨・生成り・金(罫線とラベルのみ)。角丸ゼロ、影なし、グラデーション禁止、アイコン付きカード禁止
- ホスティング: **Vercel**(決定済み)。ページは全て静的生成、サーバー関数は問い合わせ API のみ

## 2. 技術スタック

| 層 | 採用 |
|---|---|
| フレームワーク | SvelteKit 3 / Svelte 5(runes 強制)。設定は `vite.config.ts` に集約、エイリアスは `#lib` |
| CSS | Tailwind v4。トークンは `src/routes/layout.css` の `@theme` のみ |
| 多言語 | Paraglide JS。`messages/{ja,en,zh}.json`。URL 戦略、末尾スラッシュなし |
| 長文 | mdsvex(`src/content/pages/`, `src/content/news/`) |
| UI | bits-ui(Dialog のみ使用) |
| フォーム | sveltekit-superforms(SPA モード)+ valibot |
| 画像 | @sveltejs/enhanced-img(AVIF/WebP、1x/2x 自動生成) |
| フォント | @fontsource(自前配信。中国本土で Google Fonts が使えないため) |
| アダプタ | @sveltejs/adapter-vercel(runtime nodejs22.x) |
| メール | Resend(REST API 直叩き、SDK なし) |
| CI | GitHub Actions(`.github/workflows/ci.yml`: check → lint → build) |

## 3. 実装済み

### ページ
- `/` トップ: WebGL 霧のヒーロー(縦書きタグライン・文字出現)、理念、二つの事業、主力製品、お知らせ3件、お問い合わせ CTA
- `/philosophy` 企業理念 + 代表挨拶
- `/business` 自社ブランド事業 / OEM・ODM(4工程の流れ)
- `/products` 製品概要、特長3点、製品情報表(JAN・原材料・栄養成分・配合成分・飲み方・保存)
- `/company` 会社概要表 + アクセス(Google マップ外部リンク。埋め込みは中国で表示不可のため不採用)
- `/news`, `/news/[slug]` 一覧と個別記事(Markdown)
- `/contact` お問い合わせフォーム(種別 / 会社名 / 氏名 / メール / 電話 / 内容 / 同意、ハニーポット)
- `/privacy` プライバシーポリシー(11条、noindex)
- エラーページ(404 等)

### 共通
- ヘッダー(スクロールで縮小、トップは透過)、モバイル全画面メニュー、言語切替(全ページ再読込)、フッター
- View Transitions によるページ遷移、スクロール出現(`use:reveal`、reduced-motion / 印刷 / JS 無効で常時表示)
- SEO: `Seo.svelte`(title / description / OGP / Twitter / canonical / hreflang)、JSON-LD(Organization / Product / NewsArticle)、`sitemap.xml`、OGP 画像、ファビコン(松葉マーク)
- 問い合わせ API `/api/contact`: サーバー側で再検証 → Resend 送信。環境変数未設定時は 503 を返し、フォームは「準備中」表示

### 仮素材(差し替え前提)
- ヒーロー背景: WebGL の霧(実写が来たら写真の上に重ねて使える)
- 商品画像: Unsplash のストック写真(`src/lib/assets/product.jpg`、Unsplash License、撮影 NutraSeller Manufacturing)
- 代表肖像: 松葉モチーフの枠(`PineMotif`)

## 4. 運用の仕方

### 文言・コンテンツ
- UI 文言: `messages/{ja,en,zh}.json`(キーは3言語で揃える)
- 長文(理念・挨拶・事業・プライバシー): `src/content/pages/{locale}/*.md`
- ニュース: `src/content/news/{locale}/YYYY-MM-DD-slug.md` を置くだけで一覧・個別・トップ・sitemap に反映。frontmatter は `title`, `date`, `category`(notice / media / event / product)
- 会社の固定情報(住所・電話・JAN・成分量など): `src/lib/data/company.ts`

### 設定値(`src/lib/config.ts`)
| キー | 内容 | 状態 |
|---|---|---|
| `siteUrl` | 本番 URL(末尾スラッシュなし)。設定すると canonical / hreflang / og:url / og:image / sitemap が絶対 URL になる | **未設定** |
| `contactEndpoint` | フォーム送信先 | `/api/contact` |
| `amazonUrl` | Amazon 商品ページ。設定すると「Amazon で購入する」ボタンが出る | **未設定** |

### 環境変数(Vercel 側に設定。`src/env.ts` で宣言、`.env.example` 参照)
| 変数 | 内容 |
|---|---|
| `RESEND_API_KEY` | Resend の API キー |
| `CONTACT_TO_EMAIL` | 問い合わせの受信先 |
| `CONTACT_FROM_EMAIL` | 送信元。未設定なら Resend テスト用アドレス(本番は認証済みドメインのアドレスに) |

### 画像の差し替え
- 商品: `src/lib/assets/product.jpg` を同名で上書き(縦長 4:5 前後)。トップと商品ページに反映
- 代表肖像: `src/routes/philosophy/+page.svelte` の `PineMotif` 枠を `enhanced:img` に置き換える(ProductImage.svelte が実装例)
- ヒーロー: `src/routes/+page.svelte` のヒーローに `enhanced:img` を敷き、`MistCanvas` を上に薄く重ねる

### コマンド
```
pnpm dev          # 開発サーバー
pnpm check        # Paraglide コンパイル → 型チェック
pnpm lint         # Prettier + ESLint
pnpm build        # Vercel 向けビルド(.vercel/output)
pnpm format
```

### コミット規約
- 実装順に細かく分割。英語1行、`feat:` / `fix:` / `chore:` / `docs:` の prefix、カッコ(scope)なし、Co-Authored-By なし

## 5. 設計上のメモ・ハマりどころ

- SvelteKit 3: `resolve()` は既定で相対パスを返すため `paths.relative: false` を設定。リンクは `#lib/utils/href.ts` の `localHref()` / `localHrefParams()` を通す(ESLint の resolve 必須ルールはリンクに対して無効化)
- SvelteKit 3: `$env/dynamic/private` は非推奨。`src/env.ts` の `defineEnvVars` で宣言し `$app/env/private` から名前付き import
- Paraglide の生成コード(`src/lib/paraglide`)は gitignore。`pnpm check` が先にコンパイルする(CI 対策)
- CJK フォントは unicode-range で約120分割され CSS が重いため、フォント CSS はメイン CSS から分離し非同期読み込み。中国語フォントは zh ページだけ
- 日本語・中国語の見出しは `text-wrap: balance` を無効化(語の途中で折れるため)
- vite preview のプロセスは `pkill -f "vite preview"` では止まらない。ポートで kill する(`lsof -tiTCP:4173 -sTCP:LISTEN | xargs kill`)
- 動作確認はヘッドレス Chrome(`--headless=new --use-angle=swiftshader`)で撮影。WebGL も描画できる

## 6. 法務・表現の注意(公開前に必須)

- いわゆる健康食品のため、効能効果の標榜は薬機法・景表法に抵触しうる。元原稿の「年齢に抗う」「細胞の活力」「エイジングケア」「吸収」「NAD+ をサポート」等は避けて書き直してある。公開前に専門家のチェックを受けること
- 商品ページの特長は配合量・製造元・工場の事実のみ
- プライバシーポリシーは下書き。制定日(仮: 2026-10-18)、第6条(外国への提供)、第5条(委託先)を確認
- 営業時間・返信日数など未確認の情報はサイトに載せていない

## 7. TODO

### あなた(クライアント側)の判断・素材待ち
- [ ] Vercel にリポジトリをインポートし、環境変数3つを設定
- [ ] 本番ドメインを決める → `config.siteUrl` に設定、`static/robots.txt` の Sitemap 行を有効化
- [ ] Amazon 商品 URL → `config.amazonUrl`
- [ ] 写真3点(ヒーローの松、商品パッケージ、代表肖像)
- [ ] 法務チェック(商品・理念・挨拶の文言、プライバシーポリシー)
- [ ] 問い合わせ受信先メールアドレス、Resend のドメイン認証

### 実装側で残っているもの
- [ ] ドメイン確定後: siteUrl 設定、本番での OGP / hreflang / sitemap 確認、Search Console 登録
- [ ] Vercel デプロイ後: 問い合わせフォームの実送信テスト
- [ ] 写真が届いたら差し替え(ヒーロー・商品・肖像)
- [ ] Lighthouse 計測と LCP 調整(ヒーロー画像の `fetchpriority`、フォント preload)
- [ ] アクセシビリティ確認(キーボード操作、コントラスト、読み上げ順)
- [ ] ニュースのカテゴリ絞り込み・年別表示(記事が増えてから)
- [ ] 中国語版のネイティブチェック(現状は機械的な翻訳)
- [ ] 必要なら特定商取引法に基づく表記(自社 EC を始める場合)

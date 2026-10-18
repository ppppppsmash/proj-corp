/**
 * デプロイ先・外部サービスに依存する設定。
 * 値が空のものは機能が自動的に「準備中」表示になる。
 */
export const config = {
	/** 本番の URL(末尾スラッシュなし)。設定すると canonical / hreflang / OGP の絶対 URL が出力される */
	siteUrl: '',

	/**
	 * お問い合わせフォームの送信先。JSON を POST する。
	 * 例: Formspree 'https://formspree.io/f/xxxx'、Cloudflare Worker '/api/contact' など。
	 * 空の間はフォーム送信が「準備中」になる。
	 */
	contactEndpoint: '',

	/** Amazon 商品ページ(未定) */
	amazonUrl: ''
} as const;

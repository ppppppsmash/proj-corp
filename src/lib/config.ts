/**
 * デプロイ先・外部サービスに依存する設定。
 * 値が空のものは機能が自動的に「準備中」表示になる。
 */
export const config = {
	/** 本番の URL(末尾スラッシュなし)。設定すると canonical / hreflang / OGP の絶対 URL が出力される */
	siteUrl: '',

	/**
	 * お問い合わせフォームの送信先(JSON を POST)。
	 * 既定は自前の API(src/routes/api/contact)。Vercel の環境変数 RESEND_API_KEY と
	 * CONTACT_TO_EMAIL が未設定の間、API は 503 を返し、フォームは「準備中」を表示する。
	 */
	contactEndpoint: '/api/contact',

	/** Amazon 商品ページ(未定) */
	amazonUrl: ''
} as const;

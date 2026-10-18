import { defineEnvVars } from '@sveltejs/kit/env';

/**
 * 環境変数の宣言(SvelteKit 3)。サーバー側は `$app/env/private` から名前付きで読む。
 * いずれも任意。未設定なら undefined(または既定値)になり、問い合わせ API は 503 を返す。
 */
const optional = (value: string | undefined) => value || undefined;

export const variables = defineEnvVars({
	RESEND_API_KEY: {
		description: 'Resend の API キー(問い合わせメール送信用)',
		schema: optional
	},
	CONTACT_TO_EMAIL: {
		description: '問い合わせメールの受信先',
		schema: optional
	},
	CONTACT_FROM_EMAIL: {
		description: '問い合わせメールの送信元。未設定なら Resend のテスト用アドレス',
		schema: (value) => value || 'Kanshodo Web <onboarding@resend.dev>'
	}
});

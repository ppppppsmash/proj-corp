import { json } from '@sveltejs/kit';
import { CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL, RESEND_API_KEY } from '$app/env/private';
import * as v from 'valibot';
import { contactSchema, inquiryTypeLabel } from '#lib/forms/contact.js';
import type { RequestHandler } from './$types';

// このルートだけ Vercel のサーバー関数として動く(他は全て静的生成)
export const prerender = false;

const MAX_BODY_BYTES = 20_000;

/**
 * お問い合わせフォームの送信先。Resend(https://resend.com)でメールを送る。
 * 環境変数は src/env.ts で宣言(RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL)。
 */
export const POST: RequestHandler = async ({ request }) => {
	const apiKey = RESEND_API_KEY;
	const to = CONTACT_TO_EMAIL;
	const from = CONTACT_FROM_EMAIL;

	if (!apiKey || !to) {
		return json({ ok: false, reason: 'unavailable' }, { status: 503 });
	}

	const raw = await request.text();
	if (raw.length > MAX_BODY_BYTES) {
		return json({ ok: false, reason: 'too_large' }, { status: 413 });
	}

	let body: Record<string, unknown>;
	try {
		body = JSON.parse(raw);
	} catch {
		return json({ ok: false, reason: 'invalid_json' }, { status: 400 });
	}

	// クライアントと同じスキーマで再検証する(クライアント側の検証は信用しない)
	const parsed = v.safeParse(contactSchema, body);
	if (!parsed.success) {
		return json(
			{ ok: false, reason: 'invalid', issues: parsed.issues.map((i) => i.message) },
			{ status: 400 }
		);
	}
	const data = parsed.output;

	// ハニーポットに値があればボット。成功を装って捨てる
	if (data.website) return json({ ok: true });

	const locale = typeof body.locale === 'string' ? body.locale : '';
	const pageUrl = typeof body.page === 'string' ? body.page : '';

	const subject = `【Webお問い合わせ】${inquiryTypeLabel[data.type]()} / ${data.name}`;
	const text = [
		`種別: ${inquiryTypeLabel[data.type]()}`,
		`会社名: ${data.company || '-'}`,
		`お名前: ${data.name}`,
		`メール: ${data.email}`,
		`電話: ${data.tel || '-'}`,
		'',
		'--- お問い合わせ内容 ---',
		data.message,
		'',
		'--- 送信情報 ---',
		`言語: ${locale || '-'}`,
		`ページ: ${pageUrl || '-'}`,
		`日時: ${new Date().toISOString()}`
	].join('\n');

	const res = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
		body: JSON.stringify({ from, to: [to], reply_to: data.email, subject, text })
	});

	if (!res.ok) {
		console.error('[contact] resend error', res.status, await res.text());
		return json({ ok: false, reason: 'send_failed' }, { status: 502 });
	}

	return json({ ok: true });
};

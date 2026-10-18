import * as v from 'valibot';
import * as m from '#lib/paraglide/messages.js';

export const inquiryTypes = ['general', 'product', 'oem', 'media'] as const;
export type InquiryType = (typeof inquiryTypes)[number];

export const inquiryTypeLabel: Record<InquiryType, () => string> = {
	general: m.contact_type_general,
	product: m.contact_type_product,
	oem: m.contact_type_oem,
	media: m.contact_type_media
};

/**
 * お問い合わせフォームのスキーマ。エラー文言は関数で遅延評価し、現在の言語で表示する。
 */
export const contactSchema = v.object({
	type: v.picklist(inquiryTypes),
	company: v.optional(v.pipe(v.string(), v.trim(), v.maxLength(100)), ''),
	name: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, () => m.err_required()),
		v.maxLength(100)
	),
	email: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, () => m.err_required()),
		v.email(() => m.err_email())
	),
	tel: v.optional(
		v.pipe(
			v.string(),
			v.trim(),
			v.union([
				v.literal(''),
				v.pipe(
					v.string(),
					v.regex(/^[0-9+\-() ]{8,20}$/, () => m.err_tel())
				)
			])
		),
		''
	),
	message: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, () => m.err_required()),
		v.minLength(10, () => m.err_min_message()),
		v.maxLength(4000)
	),
	agree: v.pipe(
		v.boolean(),
		v.check(
			(b) => b === true,
			() => m.err_agree()
		)
	),
	// ハニーポット(人間は入力しない。ボットが埋めたら黙って捨てる)
	website: v.optional(v.string(), '')
});

export type ContactInput = v.InferInput<typeof contactSchema>;
export type ContactOutput = v.InferOutput<typeof contactSchema>;

/** フォームの初期値(superforms の SPA モードではクライアント側で既定値を用意する) */
export const contactDefaults: ContactOutput = {
	type: 'general',
	company: '',
	name: '',
	email: '',
	tel: '',
	message: '',
	agree: false,
	website: ''
};

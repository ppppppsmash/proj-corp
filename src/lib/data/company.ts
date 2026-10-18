/**
 * 会社の固定情報。翻訳が必要な文言は messages/*.json に置き、
 * ここには言語に依存しない値(電話番号、郵便番号、日付など)を置く。
 */
export const company = {
	nameJa: '漢松堂株式会社',
	nameEn: 'Kanshodo Co., Ltd.',
	brand: 'KANSHODO',
	founded: '2022-08-08',
	capitalJpy: 2_000_000,
	representative: { ja: '梅原 ミホ', en: 'Miho Umehara', zh: '梅原 美穂' },
	postalCode: '103-0004',
	address: {
		ja: '東京都中央区東日本橋1-1-9-2F 備広東日本橋ビルIII',
		en: 'Bihiro Higashi-Nihonbashi Bldg. III 2F, 1-1-9 Higashi-Nihonbashi, Chuo-ku, Tokyo',
		zh: '东京都中央区东日本桥1-1-9-2F 备广东日本桥大厦III'
	},
	tel: '03-4333-3211',
	telIntl: '+81-3-4333-3211',
	tradingCountries: ['CN', 'HK', 'US'] as const,
	bank: { ja: '武蔵野銀行', en: 'Musashino Bank', zh: '武藏野银行' }
} as const;

export const product = {
	slug: 'nmn45000-coq10',
	jan: '4595431256011',
	netWeightG: 68.76,
	tabletMg: 382,
	tabletContentMg: 320,
	tablets: 180,
	daysSupply: 90,
	dailyTablets: 2,
	perServing: {
		nmnMg: 500,
		reducedCoq10Mg: 20,
		energyKcal: 2.89,
		proteinG: 0.26,
		fatG: 0.03,
		carbG: 0.39,
		saltG: 0.0007
	},
	amazonUrl: '' // 後日設定(PUBLIC_AMAZON_PRODUCT_URL でも上書き可)
} as const;

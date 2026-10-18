import * as m from '#lib/paraglide/messages.js';

/** グローバルナビ。ヘッダー・モバイルメニュー・フッターで共有する。 */
export const navItems = [
	{ href: '/philosophy', label: m.nav_philosophy, en: 'Philosophy' },
	{ href: '/business', label: m.nav_business, en: 'Business' },
	{ href: '/products', label: m.nav_products, en: 'Products' },
	{ href: '/company', label: m.nav_company, en: 'Company' },
	{ href: '/news', label: m.nav_news, en: 'News' },
	{ href: '/contact', label: m.nav_contact, en: 'Contact' }
] as const;

export type NavHref = (typeof navItems)[number]['href'];

import { locales, localizeHref } from '#lib/paraglide/runtime.js';
import { getNews, getNewsEntry } from '#lib/content/news.js';
import { config } from '#lib/config.js';
import type { RequestHandler } from './$types';

export const prerender = true;

/** インデックスさせる静的ルート(noindex のプライバシー・404 は含めない) */
const staticRoutes = [
	'/',
	'/philosophy',
	'/business',
	'/products',
	'/company',
	'/news',
	'/contact'
];

type Entry = { loc: string; alternates: { lang: string; href: string }[] };

const escape = (s: string) =>
	s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');

export const GET: RequestHandler = () => {
	// config.siteUrl が未設定の間はルート相対のまま出力される(ドメイン設定後に絶対 URL になる)
	const base = config.siteUrl;
	const entries: Entry[] = [];

	for (const route of staticRoutes) {
		const alternates = locales.map((lang) => ({
			lang,
			href: base + localizeHref(route, { locale: lang })
		}));
		for (const a of alternates) entries.push({ loc: a.href, alternates });
	}

	for (const lang of locales) {
		for (const item of getNews(lang)) {
			const route = `/news/${item.slug}`;
			const alternates = locales
				.filter((l) => getNewsEntry(l, item.slug))
				.map((l) => ({ lang: l, href: base + localizeHref(route, { locale: l }) }));
			entries.push({ loc: base + localizeHref(route, { locale: lang }), alternates });
		}
	}

	const body = entries
		.map(
			(e) =>
				`  <url>\n    <loc>${escape(e.loc)}</loc>\n` +
				e.alternates
					.map(
						(a) =>
							`    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${escape(a.href)}" />`
					)
					.join('\n') +
				`\n  </url>`
		)
		.join('\n');

	const xml =
		`<?xml version="1.0" encoding="UTF-8"?>\n` +
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
		`${body}\n</urlset>\n`;

	return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};

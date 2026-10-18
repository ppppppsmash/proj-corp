import { error } from '@sveltejs/kit';
import { getLocale } from '#lib/paraglide/runtime.js';
import { getNewsEntry } from '#lib/content/news.js';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const entry = getNewsEntry(getLocale(), params.slug);
	if (!entry) error(404);
	// コンポーネントはシリアライズできないので、本文はページ側で slug から再取得する
	return { slug: entry.slug, title: entry.title, date: entry.date, category: entry.category };
};

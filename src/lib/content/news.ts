import type { Component } from 'svelte';
import type { Locale } from '#lib/paraglide/runtime.js';
import * as m from '#lib/paraglide/messages.js';

export type NewsCategory = 'notice' | 'media' | 'event' | 'product';

export type NewsMeta = {
	title: string;
	date: string; // YYYY-MM-DD
	category: NewsCategory;
	summary?: string;
};

export type NewsEntry = NewsMeta & {
	slug: string;
	locale: Locale;
	content: Component;
};

type Module = { metadata: NewsMeta; default: Component };

// src/content/news/{locale}/{slug}.md を全件、ビルド時に読み込む
const modules = import.meta.glob<Module>('/src/content/news/*/*.md', { eager: true });

const entries: NewsEntry[] = Object.entries(modules)
	.map(([path, mod]) => {
		const [, locale, file] = path.match(/\/news\/([^/]+)\/([^/]+)\.md$/) ?? [];
		return { ...mod.metadata, slug: file, locale: locale as Locale, content: mod.default };
	})
	.sort((a, b) => b.date.localeCompare(a.date));

/** 指定言語のニュースを新しい順に返す。 */
export function getNews(locale: Locale, limit?: number): NewsEntry[] {
	const list = entries.filter((e) => e.locale === locale);
	return limit ? list.slice(0, limit) : list;
}

export function getNewsEntry(locale: Locale, slug: string): NewsEntry | undefined {
	return entries.find((e) => e.locale === locale && e.slug === slug);
}

export const categoryLabel: Record<NewsCategory, () => string> = {
	notice: m.news_category_notice,
	media: m.news_category_media,
	event: m.news_category_event,
	product: m.news_category_product
};

/** 2026-10-18 → 2026.10.18 */
export function formatDate(date: string): string {
	return date.replaceAll('-', '.');
}

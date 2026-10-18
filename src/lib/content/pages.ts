import type { Component } from 'svelte';
import type { Locale } from '#lib/paraglide/runtime.js';

/**
 * 長文の本文(企業理念、代表挨拶、事業説明など)は Markdown で管理する。
 * src/content/pages/{locale}/{slug}.md
 */
type Module = { metadata?: Record<string, string>; default: Component };

const modules = import.meta.glob<Module>('/src/content/pages/*/*.md', { eager: true });

export function getPage(locale: Locale, slug: string): Module | undefined {
	return modules[`/src/content/pages/${locale}/${slug}.md`];
}

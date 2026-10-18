import { resolve } from '$app/paths';
import type { RouteId, RouteParams } from '$app/types';
import { deLocalizeUrl, localizeHref, type Locale } from '#lib/paraglide/runtime.js';

/** パラメータを持たないルートID(例: '/business')。'/news/[slug]' は含まない。 */
export type StaticRouteId = {
	[K in RouteId]: RouteParams<K> extends Record<string, never> ? K : never;
}[RouteId];

// resolve() の引数型は条件型で複雑なため、ここで一度だけ緩い型に落とす。
// 呼び出し側の型安全は StaticRouteId / RouteParams<T> で担保する。
const resolveRoute = resolve as unknown as (
	route: string,
	params?: Record<string, string>
) => string;

/**
 * ルートIDを現在(または指定)の言語の URL にする。
 * paths.relative を false にしているので resolve() は '/' 始まりの絶対パスを返す。
 */
export function localHref(route: StaticRouteId, locale?: Locale): string {
	return localizeHref(resolveRoute(route), locale ? { locale } : undefined);
}

/** 動的ルート用(例: localHrefParams('/news/[slug]', { slug })) */
export function localHrefParams<T extends RouteId>(
	route: T,
	params: RouteParams<T>,
	locale?: Locale
): string {
	return localizeHref(resolveRoute(route, params), locale ? { locale } : undefined);
}

/** 言語接頭辞を除いたパスがそのルート配下か(aria-current 用)。 */
export function isCurrentPath(pathname: string, route: StaticRouteId): boolean {
	const current = deLocalizeUrl(new URL(pathname, 'http://localhost')).pathname;
	const path = resolveRoute(route);
	if (route === '/') return current === path;
	return current === path || current.startsWith(path + '/');
}

import { resolve } from '$app/paths';
import type { RouteId } from '$app/types';
import { deLocalizeUrl, localizeHref, type Locale } from '#lib/paraglide/runtime.js';

/**
 * ルートID(例: '/business')を現在(または指定)の言語の URL にする。
 * paths.relative を false にしているので resolve() は '/' 始まりの絶対パスを返す。
 */
export function localHref(route: RouteId, locale?: Locale): string {
	return localizeHref(resolve(route), locale ? { locale } : undefined);
}

/** 言語接頭辞を除いたパスがそのルート配下か(aria-current 用)。 */
export function isCurrentPath(pathname: string, route: RouteId): boolean {
	const current = deLocalizeUrl(new URL(pathname, 'http://localhost')).pathname;
	const path = resolve(route);
	if (route === '/') return current === path;
	return current === path || current.startsWith(path + '/');
}

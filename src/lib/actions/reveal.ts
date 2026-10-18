import type { Action } from 'svelte/action';

/**
 * スクロールで初めて画面に入ったときに1回だけフェードインさせる。
 * - JS 無効時や SSR では何もしない(常に表示)
 * - 読み込み時点で既に画面内にある要素は隠さない(ちらつき防止)
 * - prefers-reduced-motion は CSS 側で無効化(layout.css)
 */
export const reveal: Action<HTMLElement, { delay?: number } | undefined> = (node, options) => {
	const inView = node.getBoundingClientRect().top < window.innerHeight * 0.9;
	if (inView) return;

	node.classList.add('reveal');
	if (options?.delay) node.style.setProperty('--reveal-delay', `${options.delay}ms`);

	const io = new IntersectionObserver(
		([entry]) => {
			if (!entry.isIntersecting) return;
			node.classList.add('is-visible');
			io.disconnect();
		},
		{ threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
	);
	io.observe(node);

	return { destroy: () => io.disconnect() };
};

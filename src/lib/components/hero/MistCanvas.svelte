<script lang="ts">
	import { onMount } from 'svelte';
	import fragSrc from './mist.frag.glsl?raw';

	/**
	 * 深緑の霧が墨流しのように揺らぐ WebGL 背景。
	 * - 半解像度で描画(霧なので粗さは目立たない)して軽量化
	 * - 画面外・非表示タブでは描画を止める
	 * - prefers-reduced-motion では1フレームだけ描いて静止
	 * - WebGL 非対応なら何も描かず、親の背景色(pine-950)にフォールバック
	 */
	let { class: className = '' }: { class?: string } = $props();

	let canvas: HTMLCanvasElement;

	const vertSrc = `
		attribute vec2 aPos;
		void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
	`;

	onMount(() => {
		const gl = canvas.getContext('webgl', {
			antialias: false,
			alpha: false,
			powerPreference: 'low-power'
		});
		if (!gl) return;

		const compile = (type: number, src: string) => {
			const sh = gl.createShader(type)!;
			gl.shaderSource(sh, src);
			gl.compileShader(sh);
			if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
				console.warn(gl.getShaderInfoLog(sh));
			}
			return sh;
		};
		const program = gl.createProgram()!;
		gl.attachShader(program, compile(gl.VERTEX_SHADER, vertSrc));
		gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragSrc));
		gl.linkProgram(program);
		gl.useProgram(program);

		const buf = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buf);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
		const aPos = gl.getAttribLocation(program, 'aPos');
		gl.enableVertexAttribArray(aPos);
		gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

		const uRes = gl.getUniformLocation(program, 'uRes');
		const uTime = gl.getUniformLocation(program, 'uTime');
		const uMouse = gl.getUniformLocation(program, 'uMouse');

		const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const SCALE = 0.5;
		let visible = true;
		let raf = 0;
		const mouse = { x: 0.5, y: 0.5 };
		const smooth = { x: 0.5, y: 0.5 };
		const start = performance.now();

		const resize = () => {
			const w = Math.max(1, Math.round(canvas.clientWidth * SCALE));
			const h = Math.max(1, Math.round(canvas.clientHeight * SCALE));
			if (canvas.width !== w || canvas.height !== h) {
				canvas.width = w;
				canvas.height = h;
				gl.viewport(0, 0, w, h);
			}
		};

		const draw = (now: number) => {
			resize();
			smooth.x += (mouse.x - smooth.x) * 0.04;
			smooth.y += (mouse.y - smooth.y) * 0.04;
			gl.uniform2f(uRes, canvas.width, canvas.height);
			gl.uniform1f(uTime, (now - start) / 1000);
			gl.uniform2f(uMouse, smooth.x, 1 - smooth.y);
			gl.drawArrays(gl.TRIANGLES, 0, 3);
		};

		const loop = (now: number) => {
			draw(now);
			raf = requestAnimationFrame(loop);
		};
		const play = () => {
			if (raf || reduceMotion) return;
			raf = requestAnimationFrame(loop);
		};
		const pause = () => {
			cancelAnimationFrame(raf);
			raf = 0;
		};

		const onMove = (e: PointerEvent) => {
			mouse.x = e.clientX / innerWidth;
			mouse.y = e.clientY / innerHeight;
		};
		const onVisibility = () => (document.hidden || !visible ? pause() : play());
		const io = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
			onVisibility();
		});
		const ro = new ResizeObserver(() => {
			if (reduceMotion) draw(performance.now());
		});

		io.observe(canvas);
		ro.observe(canvas);
		window.addEventListener('pointermove', onMove, { passive: true });
		document.addEventListener('visibilitychange', onVisibility);

		// 初回は必ず1フレーム描く(reduced-motion ではこれが最終画)
		draw(performance.now());
		play();

		return () => {
			pause();
			io.disconnect();
			ro.disconnect();
			window.removeEventListener('pointermove', onMove);
			document.removeEventListener('visibilitychange', onVisibility);
			gl.getExtension('WEBGL_lose_context')?.loseContext();
		};
	});
</script>

<canvas bind:this={canvas} class={className} aria-hidden="true"></canvas>

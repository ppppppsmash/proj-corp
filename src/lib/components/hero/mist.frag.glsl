precision highp float;

uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;

// Simplex noise 3D (Ashima Arts / Stefan Gustavson, MIT)
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
	const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
	const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
	vec3 i = floor(v + dot(v, C.yyy));
	vec3 x0 = v - i + dot(i, C.xxx);
	vec3 g = step(x0.yzx, x0.xyz);
	vec3 l = 1.0 - g;
	vec3 i1 = min(g.xyz, l.zxy);
	vec3 i2 = max(g.xyz, l.zxy);
	vec3 x1 = x0 - i1 + C.xxx;
	vec3 x2 = x0 - i2 + C.yyy;
	vec3 x3 = x0 - D.yyy;
	i = mod289(i);
	vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
	float n_ = 0.142857142857;
	vec3 ns = n_ * D.wyz - D.xzx;
	vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
	vec4 x_ = floor(j * ns.z);
	vec4 y_ = floor(j - 7.0 * x_);
	vec4 x = x_ * ns.x + ns.yyyy;
	vec4 y = y_ * ns.x + ns.yyyy;
	vec4 h = 1.0 - abs(x) - abs(y);
	vec4 b0 = vec4(x.xy, y.xy);
	vec4 b1 = vec4(x.zw, y.zw);
	vec4 s0 = floor(b0) * 2.0 + 1.0;
	vec4 s1 = floor(b1) * 2.0 + 1.0;
	vec4 sh = -step(h, vec4(0.0));
	vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
	vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
	vec3 p0 = vec3(a0.xy, h.x);
	vec3 p1 = vec3(a0.zw, h.y);
	vec3 p2 = vec3(a1.xy, h.z);
	vec3 p3 = vec3(a1.zw, h.w);
	vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
	p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
	vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
	m = m * m;
	return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

float fbm(vec3 p) {
	float v = 0.0;
	float a = 0.5;
	for (int i = 0; i < 5; i++) {
		v += a * snoise(p);
		p = p * 2.03 + vec3(1.7, 9.2, 0.0);
		a *= 0.5;
	}
	return v;
}

void main() {
	vec2 uv = gl_FragCoord.xy / uRes;
	vec2 p = uv;
	p.x *= uRes.x / uRes.y;

	// マウスでわずかに視差
	vec2 par = (uMouse - 0.5) * 0.08;
	float t = uTime * 0.035;

	// ドメインワープ: 霧が墨流しのように絡み合う
	vec3 q = vec3(p * 1.1 + par, t);
	float w1 = fbm(q);
	float w2 = fbm(q + vec3(5.2, 1.3, 2.0) + w1 * 0.7);
	float n = fbm(vec3(p * 1.4 + vec2(w1, w2) * 0.85 + par * 2.0, t * 1.25 + 3.0));

	// 松の深緑のトーンだけで構成し、ハイライトにごく薄い金
	vec3 pine950 = vec3(0.059, 0.125, 0.102);
	vec3 pine900 = vec3(0.118, 0.227, 0.184);
	vec3 pine700 = vec3(0.184, 0.333, 0.275);
	vec3 gold = vec3(0.72, 0.60, 0.35);

	float mist = smoothstep(-0.35, 0.6, n);
	vec3 col = mix(pine950, pine900, mist);
	col = mix(col, pine700, smoothstep(0.45, 0.95, n) * 0.55);
	col += gold * smoothstep(0.7, 1.05, n) * 0.10;

	// 文字の可読性のため下側をやや暗く、周辺を落とす
	col *= mix(0.72, 1.05, uv.y);
	float vig = smoothstep(1.35, 0.35, length((uv - 0.5) * vec2(1.15, 1.0)));
	col *= mix(0.78, 1.0, vig);

	// バンディング防止のディザ
	float dither = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;
	gl_FragColor = vec4(col + dither, 1.0);
}

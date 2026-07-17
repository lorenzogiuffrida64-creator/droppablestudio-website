"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import * as THREE from "three";

/* path waypoints: the drop guides you down the funnel */
const KEYS = [
  { p: 0.0, x: 0.0, y: -0.05, s: 1.45 }, // centered behind the hero headline
  { p: 0.07, x: 0.0, y: 0.35, s: 1.1 },
  { p: 0.13, x: -1.85, y: 0.1, s: 0.62 }, // left at the manifesto
  { p: 0.2, x: 0.0, y: -3.8, s: 0.45 }, // dives under the dark band (band top ≈ 0.22)
  { p: 0.66, x: 0.0, y: -3.8, s: 0.45 }, // held under the longer band (work→why→testimonials)
  { p: 0.75, x: 0.0, y: -0.15, s: 1.35 }, // resurfaces HUGE behind the CTA (CTA ≈ 0.73)
  { p: 0.85, x: 2.05, y: 0.1, s: 0.55 }, // accompanies the Academy (≈ 0.85)
  { p: 1.0, x: 2.05, y: -2.6, s: 0.4 },
];

/* inquiry route: the pawn is already formed and stays a calm companion to the
   right of the form column — prominent beside the heading, drifting up out of
   the way while you fill the fields, then resurfacing near the submit button */
const KEYS_INQUIRY = [
  { p: 0.0, x: 2.1, y: 0.15, s: 1.25 },
  { p: 0.4, x: 2.55, y: 0.6, s: 0.82 },
  { p: 0.75, x: 2.35, y: 0.2, s: 1.0 },
  { p: 1.0, x: 2.0, y: -0.3, s: 1.22 },
];

/* narrow screens have no room beside the single-column form, so the pawn is a
   small accent at the very top that drifts up and out of frame as you scroll */
const KEYS_INQUIRY_MOBILE = [
  { p: 0.0, x: 1.5, y: 2.05, s: 0.5 },
  { p: 0.14, x: 1.6, y: 3.8, s: 0.46 },
  { p: 1.0, x: 1.6, y: 4.0, s: 0.46 },
];

/* chess-pawn silhouette as a radial profile r(y) — the morph target.
   Piecewise: base → tapered stem → collar → sphere head. */
const PAWN_SCALE = 1.12;
const PAWN_PROFILE: [number, number][] = [
  [-1.05, 0.62], // base bottom
  [-0.85, 0.62], // base cylinder
  [-0.72, 0.5], // base shoulder
  [-0.55, 0.3], // taper into stem
  [-0.1, 0.22], // stem waist
  [0.18, 0.2], // stem top
  [0.26, 0.38], // collar
  [0.34, 0.36],
  [0.4, 0.2], // neck
];
const HEAD_C = 0.66,
  HEAD_R = 0.4; // sphere head: y ∈ [0.40, 1.05]
const PAWN_Y_MIN = -1.05,
  PAWN_Y_MAX = HEAD_C + HEAD_R;

function pawnRadius(y: number) {
  if (y > 0.4) {
    const d = HEAD_R * HEAD_R - (y - HEAD_C) * (y - HEAD_C);
    return d > 0 ? Math.sqrt(d) : 0;
  }
  for (let i = 0; i < PAWN_PROFILE.length - 1; i++) {
    const [y0, r0] = PAWN_PROFILE[i];
    const [y1, r1] = PAWN_PROFILE[i + 1];
    if (y >= y0 && y <= y1) return r0 + ((r1 - r0) * (y - y0)) / (y1 - y0);
  }
  return PAWN_PROFILE[0][1];
}

/* project a unit direction from the origin onto the pawn surface
   (bisection on the star-shaped solid — handles the flat base too) */
function pawnPoint(dx: number, dy: number, dz: number) {
  const s = Math.sqrt(dx * dx + dz * dz);
  const inside = (t: number) => {
    const y = t * dy;
    return y >= PAWN_Y_MIN && y <= PAWN_Y_MAX && t * s <= pawnRadius(y);
  };
  let lo = 0,
    hi = 3;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (inside(mid)) lo = mid;
    else hi = mid;
  }
  return [dx * lo * PAWN_SCALE, dy * lo * PAWN_SCALE, dz * lo * PAWN_SCALE];
}

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

/* the blob is fully a pawn once the hero is scrolled past (MetaMask-style
   scroll-scrubbed morph), before the dive under the dark band at p=0.20 */
const MORPH_START = 0.02,
  MORPH_END = 0.16;

type Key = { p: number; x: number; y: number; s: number };

function sampleKeys(p: number, keys: Key[]) {
  if (p <= keys[0].p) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i],
      b = keys[i + 1];
    if (p >= a.p && p <= b.p) {
      let t = (p - a.p) / (b.p - a.p);
      t = t * t * (3 - 2 * t);
      return {
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t,
        s: a.s + (b.s - a.s) * t,
      };
    }
  }
  return keys[keys.length - 1];
}

/* procedural matcap — blue/sage liquid metal, official palette */
function makeMatcap() {
  const s = 256;
  const cv = document.createElement("canvas");
  cv.width = cv.height = s;
  const ctx = cv.getContext("2d")!;
  const base = ctx.createLinearGradient(0, 0, s, s);
  base.addColorStop(0, "#F2F6EC"); /* sage-white light */
  base.addColorStop(0.35, "#AFBCB3"); /* sage mid */
  base.addColorStop(0.62, "#46617F"); /* blu */
  base.addColorStop(1, "#13202F"); /* blu-ink shadow */
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, s, s);
  const hi = ctx.createRadialGradient(s * 0.32, s * 0.28, 4, s * 0.32, s * 0.28, s * 0.42);
  hi.addColorStop(0, "rgba(248,252,243,.95)");
  hi.addColorStop(1, "rgba(248,252,243,0)");
  ctx.fillStyle = hi;
  ctx.fillRect(0, 0, s, s);
  const glow = ctx.createRadialGradient(s * 0.78, s * 0.8, 6, s * 0.78, s * 0.8, s * 0.5);
  glow.addColorStop(0, "rgba(110,150,190,.5)");
  glow.addColorStop(1, "rgba(110,150,190,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, s, s);
  const rim = ctx.createRadialGradient(s / 2, s / 2, s * 0.34, s / 2, s / 2, s * 0.5);
  rim.addColorStop(0, "rgba(0,0,0,0)");
  rim.addColorStop(1, "rgba(12,20,30,.85)");
  ctx.fillStyle = rim;
  ctx.fillRect(0, 0, s, s);
  return new THREE.CanvasTexture(cv);
}

export default function DropCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();
  /* active choreography + morph mode, swapped per route without tearing down
     the WebGL context; the running loop reads these refs each frame */
  const keysRef = useRef<Key[]>(KEYS);
  const morphRef = useRef<"scroll" | "pawn">("scroll");
  const renderStaticRef = useRef<() => void>(() => {});
  /* the pre-order, inquiry and apply forms are focused, drop-free pages; the
     loop reads this each frame to pause, and the canvas is hidden outright */
  const hiddenRef = useRef(false);

  useEffect(() => {
    const inquiry = pathname === "/inquiry";
    const hidden =
      pathname === "/preorder" ||
      pathname === "/preorder/success" ||
      pathname === "/apply" ||
      inquiry;
    hiddenRef.current = hidden;
    const canvas = canvasRef.current;
    if (canvas) canvas.style.display = hidden ? "none" : "";
    keysRef.current = inquiry ? KEYS_INQUIRY : KEYS;
    morphRef.current = inquiry ? "pawn" : "scroll";
    /* under reduced motion the loop is idle — repaint the static drop */
    if (!hidden) renderStaticRef.current();
  }, [pathname]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
      canvas.style.display = "none";
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 6;

    const isMobile = window.innerWidth < 720;
    const detail = isMobile ? 4 : 5;
    const geo = new THREE.IcosahedronGeometry(1, detail);
    const basePos = (geo.attributes.position.array as Float32Array).slice();

    /* per-vertex morph target on the pawn surface, computed once */
    const pawnPos = new Float32Array(basePos.length);
    for (let i = 0; i < basePos.length; i += 3) {
      const [px, py, pz] = pawnPoint(basePos[i], basePos[i + 1], basePos[i + 2]);
      pawnPos[i] = px;
      pawnPos[i + 1] = py;
      pawnPos[i + 2] = pz;
    }
    const mat = new THREE.MeshMatcapMaterial({ matcap: makeMatcap() });
    const drop = new THREE.Mesh(geo, mat);
    scene.add(drop);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointerMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let W = 0,
      H = 0,
      aspect = 1,
      xClamp = 1;
    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      aspect = W / H;
      renderer.setSize(W, H, false);
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      xClamp = Math.min(1, aspect / 1.5);
    }
    window.addEventListener("resize", resize);
    resize();

    const cur = {
      x: keysRef.current[0].x,
      y: keysRef.current[0].y,
      s: keysRef.current[0].s,
    };
    let clockT = 0,
      lastTime = performance.now();

    /* scroll-coupled spin: full page scroll = SPIN_TURNS rotations */
    const SPIN_TURNS = 3;
    let curSpin = 0,
      prevSpin = 0;

    /* liquid displacement blended toward the pawn target by morph m ∈ [0,1];
       the pawn keeps a faint ripple so it still reads as liquid */
    function displace(t: number, amp: number, m: number) {
      const pos = geo.attributes.position.array as Float32Array;
      for (let i = 0; i < pos.length; i += 3) {
        const ox = basePos[i],
          oy = basePos[i + 1],
          oz = basePos[i + 2];
        const n =
          Math.sin(ox * 2.4 + t * 0.9) *
            Math.sin(oy * 2.1 + t * 1.15) *
            Math.cos(oz * 2.6 + t * 0.7) *
            0.16 +
          Math.sin(ox * 5.2 - t * 1.4) * Math.sin(oy * 4.6 + t * 1.1) * 0.045;
        const d = 1 + n * amp;
        const w = 1 + n * amp * 0.12;
        pos[i] = ox * d * (1 - m) + pawnPos[i] * w * m;
        pos[i + 1] = oy * d * (1 - m) + pawnPos[i + 1] * w * m;
        pos[i + 2] = oz * d * (1 - m) + pawnPos[i + 2] * w * m;
      }
      geo.attributes.position.needsUpdate = true;
      geo.computeVertexNormals();
    }

    let rafId = 0;

    function frame(now: number) {
      /* paused on the drop-free pre-order page — keep the RAF alive (so it
         resumes on navigation back) but skip all work and rendering */
      if (hiddenRef.current) {
        lastTime = now;
        rafId = requestAnimationFrame(frame);
        return;
      }
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      clockT += dt;

      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      const keys =
        morphRef.current === "pawn" && W < 720
          ? KEYS_INQUIRY_MOBILE
          : keysRef.current;
      const k = sampleKeys(p, keys);

      const L = reduceMotion ? 1 : 1 - Math.pow(0.0015, dt);
      cur.x += (k.x * xClamp - cur.x) * L;
      cur.y += (k.y - cur.y) * L;
      cur.s += (k.s - cur.s) * L;

      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;

      const m =
        morphRef.current === "pawn" ? 1 : smoothstep(MORPH_START, MORPH_END, p);

      curSpin += (p * SPIN_TURNS * Math.PI * 2 - curSpin) * L;

      drop.position.set(cur.x + mouse.x * 0.14, cur.y - mouse.y * 0.1, 0);
      drop.scale.setScalar(cur.s);
      drop.rotation.y += dt * 0.25 + (curSpin - prevSpin);
      prevSpin = curSpin;
      /* the pawn tumbles one full turn while it forms (lands upright),
         then keeps only a damped idle tilt */
      drop.rotation.x =
        m * Math.PI * 2 +
        (Math.sin(clockT * 0.3) * 0.25 + mouse.y * 0.15) * (1 - m * 0.7);

      if (!reduceMotion) displace(clockT, 1, m);
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(frame);
    }

    const onReducedScroll = () => {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const p = Math.min(1, window.scrollY / max);
      const keys =
        morphRef.current === "pawn" && W < 720
          ? KEYS_INQUIRY_MOBILE
          : keysRef.current;
      const k = sampleKeys(p, keys);
      const m =
        morphRef.current === "pawn" ? 1 : smoothstep(MORPH_START, MORPH_END, p);
      displace(0.8, 1, m);
      drop.position.set(k.x * xClamp, k.y, 0);
      drop.scale.setScalar(k.s);
      drop.rotation.y = p * SPIN_TURNS * Math.PI * 2;
      drop.rotation.x = m * Math.PI * 2;
      renderer.render(scene, camera);
    };
    /* let route changes repaint the static drop under reduced motion */
    renderStaticRef.current = onReducedScroll;

    if (reduceMotion) {
      /* static drop: shaped per scroll position, no animation loop */
      const m0 = morphRef.current === "pawn" ? 1 : 0;
      displace(0.8, 1, m0);
      const keys0 =
        morphRef.current === "pawn" && W < 720
          ? KEYS_INQUIRY_MOBILE
          : keysRef.current;
      const k0 = sampleKeys(0, keys0);
      drop.position.set(k0.x * xClamp, k0.y, 0);
      drop.scale.setScalar(k0.s);
      drop.rotation.x = m0 * Math.PI * 2;
      renderer.render(scene, camera);
      window.addEventListener("scroll", onReducedScroll, { passive: true });
    } else {
      rafId = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onReducedScroll);
      geo.dispose();
      mat.matcap?.dispose();
      mat.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas id="drop-canvas" ref={canvasRef} aria-hidden="true" />;
}

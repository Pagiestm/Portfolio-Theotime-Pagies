import { useEffect, useRef } from 'react';
import type { ResolvedTheme, ThemeOrigin } from './context';

export const EXPAND_MS = 620;
const FADE_MS = 260;
const STARS_PER_FRAME = 8;
const STREAKS = 26;

const palette = (theme: ResolvedTheme) => {
  const probe = document.createElement('div');
  probe.dataset.theme = theme;
  probe.style.display = 'none';
  document.body.appendChild(probe);
  const style = getComputedStyle(probe);
  const read = (name: string) => style.getPropertyValue(name).trim();
  const colors = {
    accent: read('--accent'),
    accent2: read('--accent-2'),
    ink: read('--ink'),
  };
  probe.remove();
  return colors;
};

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  born: number;
  color: string;
}

const ThemeWarp = ({
  origin,
  to,
  onDone,
}: {
  origin: ThemeOrigin;
  to: ResolvedTheme;
  onDone: () => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const done = useRef(onDone);

  useEffect(() => {
    done.current = onDone;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const colors = palette(to);
    const starColors = [colors.accent, colors.accent2, colors.ink];
    const maxRadius =
      Math.hypot(Math.max(origin.x, w - origin.x), Math.max(origin.y, h - origin.y)) + 40;
    const streaks = Array.from({ length: STREAKS }, (_, i) => ({
      angle: (i / STREAKS) * Math.PI * 2 + Math.random() * 0.2,
      length: 60 + Math.random() * 140,
      offset: Math.random() * 0.25,
      width: 0.8 + Math.random() * 1.2,
    }));
    const stars: Star[] = [];
    let raf = 0;
    const start = performance.now();

    const frame = (now: number) => {
      const elapsed = Math.max(0, now - start);
      const progress = Math.min(elapsed / EXPAND_MS, 1);
      const radius = easeOut(progress) * maxRadius;
      const fading = elapsed > EXPAND_MS;
      const alpha = fading ? Math.max(0, 1 - (elapsed - EXPAND_MS) / FADE_MS) : 1;

      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = alpha;

      if (!fading) {
        for (let i = 0; i < STARS_PER_FRAME; i += 1) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 3 + Math.random() * 9;
          stars.push({
            x: origin.x + Math.cos(angle) * radius,
            y: origin.y + Math.sin(angle) * radius,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 1 + Math.random() * 2.4,
            life: 320 + Math.random() * 380,
            born: now,
            color: starColors[Math.floor(Math.random() * starColors.length)],
          });
        }

        ctx.lineCap = 'round';
        streaks.forEach((streak) => {
          const local = Math.min(Math.max((progress - streak.offset) / 0.6, 0), 1);
          if (local <= 0) return;
          const head = radius + local * streak.length;
          const tail = Math.max(radius - streak.length * 0.4, 0);
          const gradient = ctx.createLinearGradient(
            origin.x + Math.cos(streak.angle) * tail,
            origin.y + Math.sin(streak.angle) * tail,
            origin.x + Math.cos(streak.angle) * head,
            origin.y + Math.sin(streak.angle) * head
          );
          gradient.addColorStop(0, 'transparent');
          gradient.addColorStop(1, colors.accent2);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = streak.width;
          ctx.globalAlpha = alpha * (1 - local) * 0.9;
          ctx.beginPath();
          ctx.moveTo(
            origin.x + Math.cos(streak.angle) * tail,
            origin.y + Math.sin(streak.angle) * tail
          );
          ctx.lineTo(
            origin.x + Math.cos(streak.angle) * head,
            origin.y + Math.sin(streak.angle) * head
          );
          ctx.stroke();
        });
      }

      ctx.strokeStyle = colors.accent;
      ctx.lineWidth = 2;
      ctx.globalAlpha = alpha * (1 - progress) * 0.8;
      ctx.beginPath();
      ctx.arc(origin.x, origin.y, radius, 0, Math.PI * 2);
      ctx.stroke();

      for (let i = stars.length - 1; i >= 0; i -= 1) {
        const star = stars[i];
        const age = (now - star.born) / star.life;
        if (age >= 1) {
          stars.splice(i, 1);
          continue;
        }
        star.x += star.vx;
        star.y += star.vy;
        star.vx *= 0.96;
        star.vy *= 0.96;
        const twinkle = 0.55 + 0.45 * Math.sin(age * Math.PI * 3 + i);
        const fade = alpha * (1 - age);
        const spike = star.size * (2.6 + 2.4 * twinkle);
        const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3);
        glow.addColorStop(0, star.color);
        glow.addColorStop(1, 'transparent');
        ctx.globalAlpha = fade * 0.5;
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = fade * twinkle;
        ctx.strokeStyle = star.color;
        ctx.lineWidth = Math.max(0.8, star.size * 0.45);
        ctx.beginPath();
        ctx.moveTo(star.x - spike, star.y);
        ctx.lineTo(star.x + spike, star.y);
        ctx.moveTo(star.x, star.y - spike);
        ctx.lineTo(star.x, star.y + spike);
        ctx.stroke();
        ctx.lineWidth = Math.max(0.5, star.size * 0.25);
        ctx.globalAlpha = fade * twinkle * 0.6;
        ctx.beginPath();
        ctx.moveTo(star.x - spike * 0.5, star.y - spike * 0.5);
        ctx.lineTo(star.x + spike * 0.5, star.y + spike * 0.5);
        ctx.moveTo(star.x + spike * 0.5, star.y - spike * 0.5);
        ctx.lineTo(star.x - spike * 0.5, star.y + spike * 0.5);
        ctx.stroke();
        ctx.globalAlpha = fade;
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 0.9, 0, Math.PI * 2);
        ctx.fill();
      }

      if (elapsed >= EXPAND_MS + FADE_MS) {
        done.current();
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [origin, to]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[200] h-dvh w-screen"
    />
  );
};

export default ThemeWarp;

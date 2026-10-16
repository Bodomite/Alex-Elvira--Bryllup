import { useEffect, useRef } from 'react';

// Svævende grønne blade, der reagerer på mus/touch.
const GRADIENTS = [
  ['#a7c4a0', '#cfe0c3', '#8fb386'],
  ['#6b8f5e', '#9bbf8a', '#4f7344'],
  ['#dfe9d6', '#c4d8b8', '#b5cfa6'],
  ['#58784b', '#7fa06f', '#3e5a35'],
  ['#9cbf7f', '#c6dcae', '#b0cc98'],
];

export default function LeafCanvas() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w, h, raf;
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const count = reduced ? 8 : Math.min(28, Math.floor(w / 45));
    const make = (initial) => ({
      x: Math.random() * w,
      y: initial ? Math.random() * h : -30,
      size: 8 + Math.random() * 12,
      speedY: 0.3 + Math.random() * 0.7,
      speedX: -0.3 + Math.random() * 0.6,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      sway: Math.random() * Math.PI * 2,
      vx: 0,
      vy: 0,
      grad: GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)],
      opacity: 0.5 + Math.random() * 0.4,
    });
    const leaves = Array.from({ length: count }, () => make(true));

    const drawLeaf = (l) => {
      ctx.save();
      ctx.translate(l.x, l.y);
      ctx.rotate(l.rot);
      ctx.globalAlpha = l.opacity;
      const s = l.size;
      const g = ctx.createLinearGradient(-s, -s, s, s);
      g.addColorStop(0, l.grad[0]);
      g.addColorStop(0.5, l.grad[1]);
      g.addColorStop(1, l.grad[2]);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.9, -s * 0.5, s * 0.7, s * 0.6, 0, s);
      ctx.bezierCurveTo(-s * 0.7, s * 0.6, -s * 0.9, -s * 0.5, 0, -s);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.45)';
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.85);
      ctx.lineTo(0, s * 1.15);
      ctx.stroke();
      ctx.restore();
    };

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const l of leaves) {
        l.sway += 0.015;
        const dx = l.x - mouse.x;
        const dy = l.y - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < 110) {
          const f = (110 - d) / 110;
          l.vx += (dx / (d || 1)) * f * 0.6;
          l.vy += (dy / (d || 1)) * f * 0.6;
        }
        l.vx *= 0.94;
        l.vy *= 0.94;
        l.x += l.speedX + Math.sin(l.sway) * 0.6 + l.vx;
        l.y += l.speedY + l.vy;
        l.rot += l.rotSpeed + l.vx * 0.01;
        if (l.y > h + 30 || l.x < -50 || l.x > w + 50) Object.assign(l, make(false));
        drawLeaf(l);
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onMove = (e) => {
      const p = e.touches ? e.touches[0] : e;
      mouse.x = p.clientX;
      mouse.y = p.clientY;
    };
    const onLeave = () => { mouse.x = mouse.y = -9999; };
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('mouseout', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseout', onLeave);
    };
  }, []);

  return <canvas ref={ref} className="fixed inset-0 pointer-events-none z-30" aria-hidden="true" />;
}

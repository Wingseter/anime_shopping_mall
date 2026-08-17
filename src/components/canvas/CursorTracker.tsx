import React, { useEffect, useRef } from 'react';

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export const CursorTracker: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let sparks: Spark[] = [];

    const colors = ['#00f0ff', '#ff007f', '#ffd700', '#9d00ff'];

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Create trailing tiny particles
      if (Math.random() < 0.35) {
        sparks.push({
          x: mouseX,
          y: mouseY,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 0,
          maxLife: 20 + Math.random() * 15,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 2.5 + 1,
        });
      }
    };

    const handleClick = (e: MouseEvent) => {
      // Burst on click
      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;
        sparks.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 35 + Math.random() * 20,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 3 + 2,
        });
      }
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    window.addEventListener('resize', handleResize);

    let animId: number;

    const render = () => {
      animId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      // Lerp ring towards cursor
      ringX += (mouseX - ringX) * 0.2;
      ringY += (mouseY - ringY) * 0.2;

      // Draw Cursor Reticle / Hologram Ring
      ctx.save();
      ctx.beginPath();
      ctx.arc(ringX, ringY, 18, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(ringX - 6, ringY);
      ctx.lineTo(ringX + 6, ringY);
      ctx.moveTo(ringX, ringY - 6);
      ctx.lineTo(ringX, ringY + 6);
      ctx.strokeStyle = 'rgba(255, 0, 127, 0.8)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // Draw Sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.95;
        s.vy *= 0.95;
        s.life++;

        const progress = s.life / s.maxLife;
        const alpha = Math.max(1 - progress, 0);

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * (1 - progress * 0.5), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (s.life >= s.maxLife) {
          sparks.splice(i, 1);
        }
      }
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
    />
  );
};

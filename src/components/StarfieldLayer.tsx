import { useEffect, useRef } from 'react';

type Star = {
  alpha: number;
  color: string;
  depth: number;
  flare: number;
  maxAlpha: number;
  minAlpha: number;
  radius: number;
  twinkleDirection: 1 | -1;
  twinkleSpeed: number;
  x: number;
  y: number;
};

const STAR_COLORS = ['255, 255, 255', '220, 250, 255', '240, 230, 255'];
const STAR_DENSITY = 8000;
const MIN_STAR_COUNT = 70;
const MAX_STAR_COUNT = 180;
const MAX_CURSOR_SPEED = 30;
const MOBILE_DRIFT_X = 12;
const MOBILE_DRIFT_Y = 6;
const OVERSCAN = 24;
const TAU = Math.PI * 2;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function createStar(width: number, height: number): Star {
  const depth = Math.random() * 1.5 + 0.5;
  const minAlpha = Math.random() * 0.4 + 0.25;
  const maxAlpha = Math.min(1, minAlpha + Math.random() * 0.25 + 0.18);

  return {
    alpha: Math.random() * (maxAlpha - minAlpha) + minAlpha,
    color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
    depth,
    flare: Math.random(),
    maxAlpha,
    minAlpha,
    radius: Math.random() * 1.2 + 0.2,
    twinkleDirection: Math.random() > 0.5 ? 1 : -1,
    twinkleSpeed: Math.random() * 0.01 + 0.002,
    x: Math.random() * width,
    y: Math.random() * height,
  };
}

function createStars(width: number, height: number) {
  const count = clamp(Math.floor((width * height) / STAR_DENSITY), MIN_STAR_COUNT, MAX_STAR_COUNT);

  return Array.from({ length: count }, () => createStar(width, height));
}

function drawStar(context: CanvasRenderingContext2D, star: Star) {
  const radius = star.radius * (star.depth * 0.8);

  context.fillStyle = `rgba(${star.color}, ${Math.max(0, star.alpha * 0.16)})`;
  context.beginPath();
  context.arc(star.x, star.y, radius * (2.8 + star.depth * 0.6), 0, TAU);
  context.fill();

  context.fillStyle = `rgba(${star.color}, ${Math.max(0, star.alpha)})`;
  context.beginPath();
  context.arc(star.x, star.y, radius, 0, TAU);
  context.fill();

  if (star.flare > 0.82) {
    const flareSize = radius * (3 + star.depth);

    context.strokeStyle = `rgba(${star.color}, ${Math.max(0, star.alpha * 0.28)})`;
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(star.x - flareSize, star.y);
    context.lineTo(star.x + flareSize, star.y);
    context.moveTo(star.x, star.y - flareSize);
    context.lineTo(star.x, star.y + flareSize);
    context.stroke();
  }
}

export default function StarfieldLayer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchLikeDevice =
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(hover: none)').matches ||
      navigator.maxTouchPoints > 0;
    const velocity = { x: 0, y: 0 };
    const targetVelocity = { x: 0, y: 0 };
    const mouseTargetVelocity = { x: 0, y: 0 };
    const scrollTargetVelocity = { x: 0, y: 0 };
    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let frameId = 0;
    let lastFrame = 0;

    const draw = () => {
      context.clearRect(0, 0, width, height);

      for (const star of stars) {
        drawStar(context, star);
      }
    };

    const syncCanvas = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      // On touch devices, ignore vertical resizes to prevent jitter when address bar hides/shows
      if (isTouchLikeDevice && width === newWidth) {
        return;
      }

      width = newWidth;
      height = newHeight;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      stars = createStars(width, height);
      draw();
    };

    const updateTargetVelocity = (clientX: number, clientY: number) => {
      const normalizedX = clamp((clientX - width / 2) / Math.max(width / 2, 1), -1, 1);
      const normalizedY = clamp((clientY - height / 2) / Math.max(height / 2, 1), -1, 1);

      mouseTargetVelocity.x = normalizedX * MAX_CURSOR_SPEED;
      mouseTargetVelocity.y = normalizedY * MAX_CURSOR_SPEED;
    };

    const handleMouseMove = (event: MouseEvent) => {
      updateTargetVelocity(event.clientX, event.clientY);
    };

    const handleMouseLeave = () => {
      if (isTouchLikeDevice) {
        mouseTargetVelocity.x = MOBILE_DRIFT_X;
        mouseTargetVelocity.y = MOBILE_DRIFT_Y;
        return;
      }

      mouseTargetVelocity.x = 0;
      mouseTargetVelocity.y = 0;
    };

    const animate = (now: number) => {
      const deltaMs = clamp(lastFrame ? now - lastFrame : 16.67, 8, 32);
      const deltaSeconds = deltaMs / 1000;
      const frameScale = deltaMs / 16.67;

      lastFrame = now;

      targetVelocity.x = mouseTargetVelocity.x + scrollTargetVelocity.x;
      targetVelocity.y = mouseTargetVelocity.y + scrollTargetVelocity.y;

      velocity.x += (targetVelocity.x - velocity.x) * 0.05 * frameScale;
      velocity.y += (targetVelocity.y - velocity.y) * 0.05 * frameScale;

      for (const star of stars) {
        star.alpha += star.twinkleSpeed * star.twinkleDirection * frameScale;

        if (star.alpha >= star.maxAlpha || star.alpha <= star.minAlpha) {
          star.twinkleDirection *= -1;
          star.alpha = clamp(star.alpha, star.minAlpha, star.maxAlpha);
        }

        star.x -= velocity.x * star.depth * deltaSeconds;
        star.y -= velocity.y * star.depth * deltaSeconds;

        if (star.x < -OVERSCAN) {
          star.x = width + OVERSCAN;
        } else if (star.x > width + OVERSCAN) {
          star.x = -OVERSCAN;
        }

        if (star.y < -OVERSCAN) {
          star.y = height + OVERSCAN;
        } else if (star.y > height + OVERSCAN) {
          star.y = -OVERSCAN;
        }
      }

      draw();
      frameId = window.requestAnimationFrame(animate);
    };

    syncCanvas();
    window.addEventListener('resize', syncCanvas);

    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      // Adjust these multipliers to tune the scroll sensitivity
      const scrollSpeed = scrollDelta * 15;
      const maxScrollVelocity = 200;

      scrollTargetVelocity.y = clamp(scrollSpeed, -maxScrollVelocity, maxScrollVelocity);

      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        scrollTargetVelocity.y = 0;
      }, 150);
    };

    if (!reduceMotion) {
      if (isTouchLikeDevice) {
        mouseTargetVelocity.x = MOBILE_DRIFT_X;
        mouseTargetVelocity.y = MOBILE_DRIFT_Y;
      } else {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);
      }
      
      window.addEventListener('scroll', handleScroll, { passive: true });

      frameId = window.requestAnimationFrame(animate);
    }

    return () => {
      window.removeEventListener('resize', syncCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);

      if (scrollTimeout) clearTimeout(scrollTimeout);

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-5 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-90" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 72% 12%, rgba(193, 155, 255, 0.08), transparent 30%), radial-gradient(circle at 24% 100%, rgba(156, 239, 255, 0.05), transparent 24%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 20%, rgba(13, 13, 28, 0.3) 100%)',
        }}
      />
    </div>
  );
}

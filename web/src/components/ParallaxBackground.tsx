import { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  layer: number;
}

export default function ParallaxBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const scrollYRef = useRef(0);
  const animationFrameRef = useRef<number>();
  const { isFireflyMode } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      const particles: Particle[] = [];
      const particleCount = 10;

      for (let i = 0; i < particleCount; i++) {
        const layer = Math.random();
        const baseSize = Math.random() * 200 + 150;

        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: baseSize,
          speedY: (Math.random() - 0.5) * 0.1,
          speedX: (Math.random() - 0.5) * 0.1,
          opacity: 0.01,
          layer: layer,
        });
      }

      return particles;
    };

    if (particlesRef.current.length === 0) {
      particlesRef.current = createParticles();
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < -particle.size) particle.x = canvas.width + particle.size;
        if (particle.x > canvas.width + particle.size) particle.x = -particle.size;
        if (particle.y < -particle.size) particle.y = canvas.height + particle.size;
        if (particle.y > canvas.height + particle.size) particle.y = -particle.size;

        const parallaxOffset = scrollYRef.current * particle.layer * 0.3;
        const adjustedY = particle.y - parallaxOffset;

        const gradient = ctx.createRadialGradient(
          particle.x,
          adjustedY,
          particle.size * 0.3,
          particle.x,
          adjustedY,
          particle.size
        );

        gradient.addColorStop(0, `rgba(200, 200, 200, 0.03)`);
        gradient.addColorStop(0.6, `rgba(200, 200, 200, 0.03)`);
        gradient.addColorStop(1, `rgba(200, 200, 200, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, adjustedY, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isFireflyMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}

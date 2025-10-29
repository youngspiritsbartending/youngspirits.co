import { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface Firefly {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetVx: number;
  targetVy: number;
  size: number;
  brightness: number;
  pulseSpeed: number;
  pulsePhase: number;
  speedMultiplier: number;
  speedOscillation: number;
  speedOscillationPhase: number;
  directionChangeCounter: number;
  directionChangeInterval: number;
  homeX: number;
  homeY: number;
  wanderRadius: number;
  circlePhase: number;
  circleSpeed: number;
  parallaxDepth: number;
}

export default function FireflyParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const firefliesRef = useRef<Firefly[]>([]);
  const animationFrameRef = useRef<number>();
  const scrollYRef = useRef<number>(0);
  const opacityRef = useRef<number>(0);
  const { isFireflyMode } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const targetOpacity = isFireflyMode ? 1 : 0;
    const fadeSpeed = 0.02;

    // Initialize scroll position
    scrollYRef.current = window.scrollY;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = Math.max(document.documentElement.scrollHeight, window.innerHeight);
    };

    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };

    const createFireflies = () => {
      const fireflies: Firefly[] = [];
      const fireflyCount = 80;
      const canvasWidth = window.innerWidth;
      const canvasHeight = Math.max(document.documentElement.scrollHeight, window.innerHeight);

      for (let i = 0; i < fireflyCount; i++) {
        const brightnessRandom = Math.random();
        const isBright = brightnessRandom > 0.5;

        const edgePreference = Math.random();
        let x: number;
        if (edgePreference < 0.4) {
          x = Math.random() * (canvasWidth * 0.15);
        } else if (edgePreference < 0.8) {
          x = canvasWidth - (Math.random() * (canvasWidth * 0.15));
        } else {
          x = Math.random() * canvasWidth;
        }

        const y = Math.random() * canvasHeight;
        const initialSpeed = (Math.random() - 0.5) * 1.0;
        const parallaxDepth = Math.random() * 0.8 + 0.2;

        fireflies.push({
          x: x,
          y: y,
          vx: initialSpeed,
          vy: initialSpeed,
          targetVx: initialSpeed,
          targetVy: initialSpeed,
          size: Math.random() * 2.5 + 1.5,
          brightness: isBright ? Math.random() * 0.3 + 0.9 : Math.random() * 0.5 + 0.4,
          pulseSpeed: Math.random() * 0.015 + 0.005,
          pulsePhase: Math.random() * Math.PI * 2,
          speedMultiplier: Math.random() * 1.2 + 0.4,
          speedOscillation: Math.random() * 0.3 + 0.15,
          speedOscillationPhase: Math.random() * Math.PI * 2,
          directionChangeCounter: 0,
          directionChangeInterval: Math.random() * 60 + 40,
          homeX: x,
          homeY: y,
          wanderRadius: Math.random() * 150 + 100,
          circlePhase: Math.random() * Math.PI * 2,
          circleSpeed: (Math.random() - 0.5) * 0.02,
          parallaxDepth: parallaxDepth,
        });
      }

      return fireflies;
    };

    if (firefliesRef.current.length === 0) {
      firefliesRef.current = createFireflies();
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('scroll', handleScroll, { passive: true });

    const animate = () => {
      if (!ctx || !canvas) return;

      if (opacityRef.current < targetOpacity) {
        opacityRef.current = Math.min(targetOpacity, opacityRef.current + fadeSpeed);
      } else if (opacityRef.current > targetOpacity) {
        opacityRef.current = Math.max(targetOpacity, opacityRef.current - fadeSpeed);
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (opacityRef.current <= 0.01) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      firefliesRef.current.forEach((firefly) => {
        firefly.directionChangeCounter++;
        firefly.speedOscillationPhase += 0.01;
        firefly.circlePhase += firefly.circleSpeed;

        const speedVariation = Math.sin(firefly.speedOscillationPhase) * firefly.speedOscillation;
        const currentSpeedMult = firefly.speedMultiplier * (1 + speedVariation);

        if (firefly.directionChangeCounter >= firefly.directionChangeInterval) {
          const angleChange = (Math.random() - 0.5) * Math.PI * 0.4;
          const currentAngle = Math.atan2(firefly.targetVy, firefly.targetVx);
          const newAngle = currentAngle + angleChange;
          const baseSpeed = 0.8;
          firefly.targetVx = Math.cos(newAngle) * baseSpeed;
          firefly.targetVy = Math.sin(newAngle) * baseSpeed;
          firefly.directionChangeCounter = 0;
          firefly.directionChangeInterval = Math.random() * 60 + 40;
        }

        const smoothing = 0.05;
        firefly.vx += (firefly.targetVx - firefly.vx) * smoothing;
        firefly.vy += (firefly.targetVy - firefly.vy) * smoothing;

        const circleOffsetX = Math.cos(firefly.circlePhase) * 0.3;
        const circleOffsetY = Math.sin(firefly.circlePhase) * 0.3;

        firefly.x += (firefly.vx + circleOffsetX) * currentSpeedMult;
        firefly.y += (firefly.vy + circleOffsetY) * currentSpeedMult;

        const dx = firefly.x - firefly.homeX;
        const dy = firefly.y - firefly.homeY;
        const distanceFromHome = Math.sqrt(dx * dx + dy * dy);

        if (distanceFromHome > firefly.wanderRadius) {
          const pullStrength = 0.02;
          const angleToHome = Math.atan2(-dy, -dx);
          firefly.targetVx += Math.cos(angleToHome) * pullStrength;
          firefly.targetVy += Math.sin(angleToHome) * pullStrength;
        }

        if (firefly.x < 0 || firefly.x > canvas.width) {
          firefly.vx *= -1;
          firefly.targetVx *= -1;
          firefly.x = Math.max(0, Math.min(canvas.width, firefly.x));
        }
        if (firefly.y < 0 || firefly.y > canvas.height) {
          firefly.vy *= -1;
          firefly.targetVy *= -1;
          firefly.y = Math.max(0, Math.min(canvas.height, firefly.y));
        }

        const parallaxOffset = scrollYRef.current * firefly.parallaxDepth * 0.3;
        const renderY = firefly.y - parallaxOffset;

        firefly.pulsePhase += firefly.pulseSpeed * currentSpeedMult;
        const pulse = Math.pow((Math.sin(firefly.pulsePhase) + 1) / 2, 0.7);
        const alpha = firefly.brightness * pulse * 0.95 * opacityRef.current;

        const gradient = ctx.createRadialGradient(
          firefly.x,
          renderY,
          0,
          firefly.x,
          renderY,
          firefly.size * 3
        );

        const glowIntensity = firefly.brightness > 0.7 ? 1.4 : 1.1;
        gradient.addColorStop(0, `rgba(255, 240, 180, ${alpha * glowIntensity})`);
        gradient.addColorStop(0.2, `rgba(255, 230, 150, ${alpha * 0.8 * glowIntensity})`);
        gradient.addColorStop(0.5, `rgba(255, 220, 100, ${alpha * 0.5 * glowIntensity})`);
        gradient.addColorStop(1, 'rgba(255, 200, 50, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(firefly.x, renderY, firefly.size * 3, 0, Math.PI * 2);
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
      className="fixed inset-0 pointer-events-none z-[5]"
    />
  );
}

import { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface GrassBlade {
  x: number;
  height: number;
  width: number;
  swayOffset: number;
  swaySpeed: number;
  layer: number;
  curve: number;
}

export default function GrassLayers() {
  const svgRef = useRef<SVGSVGElement>(null);
  const scrollYRef = useRef<number>(0);
  const frameRef = useRef<number>();
  const grassBladesRef = useRef<GrassBlade[]>([]);
  const transitionProgressRef = useRef<number>(0);
  const { isFireflyMode } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (grassBladesRef.current.length === 0) {
      const blades: GrassBlade[] = [];
      const svgWidth = 177.7; // SVG viewBox width (matches 16:9 aspect ratio)
      const totalBlades = 20 + Math.floor(Math.random() * 10); // Increased by 4x

      // Calculate aspect ratio to adjust blade width
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const aspectRatio = viewportWidth / viewportHeight;
      // Base width calibrated for desktop (aspect ~1.77), scale inversely for narrower screens
      const widthScale = Math.min(1, 1.77 / aspectRatio);

      for (let i = 0; i < totalBlades; i++) {
        const layer = Math.floor(Math.random() * 5);
        const baseHeight = 140 - layer * 15;

        // Random position across the width with extension for edge spill
        const xPosition = Math.random() * svgWidth * 1.1 - svgWidth * 0.05;

        // Calculate distance from SVG center (88.85 = 177.7 / 2)
        const distanceFromCenter = Math.abs(xPosition - 88.85) / 88.85;

        // Center blades are short, edge blades are tall
        const heightMultiplier = Math.pow(distanceFromCenter, 2.5);
        const minHeight = 95;
        const maxHeight = baseHeight + 50;
        const actualHeight = minHeight + (maxHeight - minHeight) * heightMultiplier;

        blades.push({
          x: xPosition,
          height: actualHeight + Math.random() * 25,
          width: (1.875 + Math.random() * 1.875) * widthScale * 4,
          swayOffset: Math.random() * Math.PI * 2,
          swaySpeed: 0.0005 + Math.random() * 0.0003,
          layer: layer,
          curve: (Math.random() - 0.5) * 3,
        });
      }

      grassBladesRef.current = blades;
    }

    const interpolateColor = (color1: string, color2: string, progress: number): string => {
      const hex1 = color1.replace('#', '');
      const hex2 = color2.replace('#', '');

      const r1 = parseInt(hex1.substring(0, 2), 16);
      const g1 = parseInt(hex1.substring(2, 4), 16);
      const b1 = parseInt(hex1.substring(4, 6), 16);

      const r2 = parseInt(hex2.substring(0, 2), 16);
      const g2 = parseInt(hex2.substring(2, 4), 16);
      const b2 = parseInt(hex2.substring(4, 6), 16);

      const r = Math.round(r1 + (r2 - r1) * progress);
      const g = Math.round(g1 + (g2 - g1) * progress);
      const b = Math.round(b1 + (b2 - b1) * progress);

      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };

    const animate = () => {
      if (!svgRef.current) return;

      const targetProgress = isFireflyMode ? 1 : 0;
      const transitionSpeed = 0.03;

      if (Math.abs(transitionProgressRef.current - targetProgress) > 0.001) {
        transitionProgressRef.current += (targetProgress - transitionProgressRef.current) * transitionSpeed;
      } else {
        transitionProgressRef.current = targetProgress;
      }

      const scrollPercent = Math.min(1, scrollYRef.current / (document.documentElement.scrollHeight - window.innerHeight));

      const layers = [
        {
          minY: 2.10,
          maxY: 1.30,
          parallaxSpeed: 0.01,
          dayColor: '#3d6b4f',
          nightColor: '#1a3329',
          opacity: 1
        },
        {
          minY: 2.08,
          maxY: 1.28,
          parallaxSpeed: 0.025,
          dayColor: '#4a7c59',
          nightColor: '#2d4a3d',
          opacity: 1
        },
        {
          minY: 2.06,
          maxY: 1.26,
          parallaxSpeed: 0.05,
          dayColor: '#5a9669',
          nightColor: '#3a5d4a',
          opacity: 1
        },
        {
          minY: 2.04,
          maxY: 1.24,
          parallaxSpeed: 0.08,
          dayColor: '#6aaa79',
          nightColor: '#476d57',
          opacity: 1
        },
        {
          minY: 2.02,
          maxY: 1.22,
          parallaxSpeed: 0.12,
          dayColor: '#7abe89',
          nightColor: '#548066',
          opacity: 1
        },
      ];

      svgRef.current.innerHTML = '';

      // Reverse order so layer 0 (back) renders first, layer 4 (front) renders last
      const sortedBlades = [...grassBladesRef.current].sort((a, b) => a.layer - b.layer);

      sortedBlades.forEach((blade) => {
        const layerConfig = layers[blade.layer];
        // Apply parallax effect: back layers move slower, front layers move faster
        const layerScrollPercent = scrollPercent * (1 - layerConfig.parallaxSpeed);
        const groundLevel = layerConfig.minY + (layerConfig.maxY - layerConfig.minY) * layerScrollPercent;

        const time = Date.now() * blade.swaySpeed + blade.swayOffset;
        const swayAmount = Math.sin(time) * 1.4;

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        const leftBaseX = blade.x - blade.width / 2;
        const rightBaseX = blade.x + blade.width / 2;
        const startY = groundLevel * 100;

        const tipX = blade.x + swayAmount;
        const tipY = startY - blade.height;

        // Create asymmetric curves - one side concave, other convex
        const curveDirection = blade.curve;
        const leftControlX = leftBaseX + swayAmount * 0.4 - curveDirection;
        const leftControlY = startY - blade.height * 0.6;

        const rightControlX = rightBaseX + swayAmount * 0.4 + curveDirection;
        const rightControlY = startY - blade.height * 0.6;

        const d = `
          M ${leftBaseX},${startY}
          Q ${leftControlX},${leftControlY} ${tipX},${tipY}
          Q ${rightControlX},${rightControlY} ${rightBaseX},${startY}
          Z
        `;

        const currentColor = interpolateColor(
          layerConfig.dayColor,
          layerConfig.nightColor,
          transitionProgressRef.current
        );

        path.setAttribute('d', d);
        path.setAttribute('fill', currentColor);
        path.setAttribute('opacity', layerConfig.opacity.toString());

        svgRef.current?.appendChild(path);
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isFireflyMode]);

  return (
    <svg
      ref={svgRef}
      className="fixed inset-0 pointer-events-none z-[3]"
      style={{
        width: '100%',
        height: '100%',
      }}
      viewBox="0 0 177.7 120"
      preserveAspectRatio="xMidYMax slice"
    />
  );
}

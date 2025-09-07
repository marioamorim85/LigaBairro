'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  size: number;
  opacity: number;
  shape: 'circle' | 'square' | 'triangle' | 'heart';
}

interface ConfettiProps {
  active: boolean;
  duration?: number;
  particleCount?: number;
  colors?: string[];
  className?: string;
  onComplete?: () => void;
}

const defaultColors = [
  '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', 
  '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'
];

export function Confetti({ 
  active, 
  duration = 3000, 
  particleCount = 150,
  colors = defaultColors,
  className,
  onComplete 
}: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<ConfettiPiece[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!active) {
      setParticles([]);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Create particles
    const newParticles: ConfettiPiece[] = [];
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * canvas.width,
        y: -20,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        opacity: 1,
        shape: ['circle', 'square', 'triangle', 'heart'][Math.floor(Math.random() * 4)] as ConfettiPiece['shape']
      });
    }
    
    setParticles(newParticles);

    const startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      newParticles.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.1; // gravity
        particle.rotation += particle.rotationSpeed;
        
        // Fade out towards the end
        if (elapsed > duration * 0.7) {
          particle.opacity = Math.max(0, 1 - (elapsed - duration * 0.7) / (duration * 0.3));
        }

        // Draw particle
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation * Math.PI / 180);
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;

        switch (particle.shape) {
          case 'circle':
            ctx.beginPath();
            ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 'square':
            ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
            break;
          case 'triangle':
            ctx.beginPath();
            ctx.moveTo(0, -particle.size / 2);
            ctx.lineTo(-particle.size / 2, particle.size / 2);
            ctx.lineTo(particle.size / 2, particle.size / 2);
            ctx.closePath();
            ctx.fill();
            break;
          case 'heart':
            // Simple heart shape
            ctx.beginPath();
            const size = particle.size / 3;
            ctx.arc(-size / 2, -size / 2, size / 2, 0, Math.PI, true);
            ctx.arc(size / 2, -size / 2, size / 2, 0, Math.PI, true);
            ctx.lineTo(0, size);
            ctx.closePath();
            ctx.fill();
            break;
        }
        ctx.restore();

        // Remove particles that are off-screen
        if (particle.y > canvas.height + 50 || particle.opacity <= 0) {
          newParticles.splice(index, 1);
        }
      });

      if (elapsed < duration && newParticles.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        onComplete?.();
        setParticles([]);
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [active, duration, particleCount, colors, onComplete]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        'fixed inset-0 pointer-events-none z-50',
        className
      )}
      style={{ mixBlendMode: 'multiply' }}
    />
  );
}

// Hook for easy confetti triggering
export function useConfetti() {
  const [isActive, setIsActive] = useState(false);

  const triggerConfetti = (options?: {
    duration?: number;
    particleCount?: number;
    colors?: string[];
  }) => {
    setIsActive(true);
    setTimeout(() => setIsActive(false), options?.duration || 3000);
  };

  return {
    isActive,
    triggerConfetti,
    ConfettiComponent: (props: Omit<ConfettiProps, 'active'>) => (
      <Confetti {...props} active={isActive} />
    )
  };
}
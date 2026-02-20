'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MotionWrapperProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function FadeIn({ children, className, delay = 0 }: MotionWrapperProps) {
  return (
    <div 
      className={cn('animate-fade-in', className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function SlideUp({ children, className, delay = 0 }: MotionWrapperProps) {
  return (
    <div 
      className={cn('animate-slide-up', className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function StaggerContainer({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('stagger-container', className)}>
      {children}
    </div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('stagger-item', className)}>
      {children}
    </div>
  );
}

// Skeleton loading component
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('skeleton', className)} />
  );
}

// Pulse dot for live indicators
export function PulseDot({ color = 'success' }: { color?: 'success' | 'accent' | 'warning' }) {
  const colors = {
    success: 'bg-success',
    accent: 'bg-accent',
    warning: 'bg-warning',
  };
  
  return (
    <span className={cn('relative flex h-2 w-2', colors[color])}>
      <span className={cn('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', colors[color])}></span>
      <span className={cn('relative inline-flex rounded-full h-2 w-2', colors[color])}></span>
    </span>
  );
}

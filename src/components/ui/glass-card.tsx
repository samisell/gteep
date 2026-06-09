'use client';

import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  variant?: 'default' | 'dark' | 'emerald' | 'light';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  as?: 'div' | 'article' | 'section';
}

const variantStyles = {
  default: 'glass',
  dark: 'glass-dark',
  emerald: 'glass-emerald',
  light: 'glass-light',
};

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

// Pre-create motion components outside of render
const MotionDiv = motion.create('div');
const MotionArticle = motion.create('article');
const MotionSection = motion.create('section');

const motionComponents = {
  div: MotionDiv,
  article: MotionArticle,
  section: MotionSection,
} as const;

export default function GlassCard({
  children,
  className,
  hoverable = true,
  variant = 'default',
  padding = 'md',
  as = 'div',
}: GlassCardProps) {
  const Component = motionComponents[as];

  return (
    <Component
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={
        hoverable
          ? {
              y: -4,
              transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
            }
          : undefined
      }
      className={cn(
        'rounded-2xl transition-shadow duration-300',
        variantStyles[variant],
        paddingStyles[padding],
        hoverable && 'cursor-default hover:shadow-soft-lg',
        className
      )}
    >
      {children}
    </Component>
  );
}

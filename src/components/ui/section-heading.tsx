'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  label?: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  className?: string;
  light?: boolean;
}

export default function SectionHeading({
  label,
  title,
  subtitle,
  align = 'center',
  className,
  light = false,
}: SectionHeadingProps) {
  const isCenter = align === 'center';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'mb-10 lg:mb-14',
        isCenter && 'text-center',
        className
      )}
    >
      {/* Label / Tag */}
      {label && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={cn(
            'inline-block text-xs font-semibold uppercase tracking-[0.2em] mb-3 px-3 py-1 rounded-full',
            light
              ? 'text-emerald-300 bg-emerald-900/40'
              : 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/30'
          )}
        >
          {label}
        </motion.span>
      )}

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'heading-font text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight',
          light
            ? 'text-white'
            : 'text-slate-900 dark:text-white'
        )}
      >
        {title}
      </motion.h2>

      {/* Accent Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'mt-4 h-0.5 w-16 rounded-full origin-left bg-gradient-to-r from-emerald-600 to-amber-500',
          isCenter && 'mx-auto'
        )}
      />

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={cn(
            'mt-4 text-base sm:text-lg max-w-2xl leading-relaxed',
            isCenter && 'mx-auto',
            light
              ? 'text-slate-300'
              : 'text-slate-600 dark:text-slate-400'
          )}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}

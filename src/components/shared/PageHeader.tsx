'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  breadcrumb?: { label: string; href?: string }[];
  className?: string;
  variant?: 'default' | 'compact' | 'large';
  backgroundImage?: string;
}

export default function PageHeader({
  title,
  subtitle,
  description,
  breadcrumb,
  className,
  variant = 'default',
  backgroundImage,
}: PageHeaderProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden',
        variant === 'large'
          ? 'py-20 md:py-28'
          : variant === 'compact'
            ? 'py-10 md:py-14'
            : 'py-14 md:py-20',
        backgroundImage ? 'bg-[#0f172a]' : 'bg-gradient-to-r from-[#065f46] to-[#0f172a]',
        className
      )}
    >
      {/* Background image */}
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
      )}
      {/* Dark overlay for text readability */}
      {backgroundImage && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#065f46]/80 via-[#0f172a]/70 to-[#0f172a]/80" />
      )}
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-800/20 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-amber-800/15 blur-3xl" />
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {breadcrumb && breadcrumb.length > 0 && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-4"
          >
            <ol className="flex items-center gap-2 text-sm text-slate-400">
              <li>
                <a href="/" className="hover:text-emerald-400 transition-colors">
                  Home
                </a>
              </li>
              {breadcrumb.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span>/</span>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="hover:text-emerald-400 transition-colors"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span className="text-emerald-400">{item.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </motion.nav>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1
            className={cn(
              'font-bold text-white',
              variant === 'large'
                ? 'text-4xl md:text-5xl lg:text-6xl'
                : variant === 'compact'
                  ? 'text-2xl md:text-3xl'
                  : 'text-3xl md:text-4xl lg:text-5xl'
            )}
          >
            {title}
          </h1>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-3 text-lg font-medium text-amber-400"
            >
              {subtitle}
            </motion.p>
          )}

          {description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-4 max-w-2xl text-base md:text-lg text-slate-300"
            >
              {description}
            </motion.p>
          )}
        </motion.div>

        {/* Accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
          className="mt-6 h-1 w-20 origin-left rounded-full bg-gradient-to-r from-emerald-500 to-amber-500"
        />
      </div>
    </section>
  );
}

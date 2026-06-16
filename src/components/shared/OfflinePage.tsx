'use client';

import { motion } from 'framer-motion';
import { WifiOff, RefreshCw, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface OfflinePageProps {
  /** Optional page title for context, e.g. "About Us" */
  pageTitle?: string;
}

export default function OfflinePage({ pageTitle }: OfflinePageProps) {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950/40 dark:to-amber-950/40"
        >
          <WifiOff className="h-14 w-14 text-emerald-700 dark:text-emerald-400" />
        </motion.div>

        {/* Heading */}
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {pageTitle ? `${pageTitle} — ` : ''}Unable to Load Content
        </h1>

        {/* Description */}
        <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
          We couldn&apos;t fetch the latest content from our server. 
          This may be due to a poor internet connection or a temporary server issue.
        </p>

        {/* Help text */}
        <p className="mt-3 text-sm text-muted-foreground">
          Please check your internet connection and try again.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={handleRefresh}
            className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline" className="gap-2 px-6">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Contact info */}
        <div className="mt-10 rounded-xl border border-border bg-muted/30 p-5">
          <p className="text-sm text-muted-foreground">
            Still having trouble? Reach out to us directly:
          </p>
          <a
            href="mailto:info@gteep.gileadtrust.com"
            className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
          >
            <Mail className="h-4 w-4" />
            info@gteep.gileadtrust.com
          </a>
        </div>
      </motion.div>
    </div>
  );
}

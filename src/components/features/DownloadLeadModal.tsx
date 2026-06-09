'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Download, CheckCircle2 } from 'lucide-react';

const leadSchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  email: z.email('Please enter a valid email address'),
  organization: z.string().optional(),
  website: z.string().optional(), // honeypot
});

type LeadFormData = z.infer<typeof leadSchema>;

interface DownloadLeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resourceId: string;
  resourceTitle: string;
  downloadUrl?: string;
}

/**
 * Download Lead Capture Modal
 * 
 * IMPORTANT: This modal captures lead information before allowing resource downloads.
 * The modal will be integrated with the lead capture system later.
 * Currently it simulates the submission and shows a success state.
 */
export default function DownloadLeadModal({
  open,
  onOpenChange,
  resourceId,
  resourceTitle,
  downloadUrl,
}: DownloadLeadModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: '',
      email: '',
      organization: '',
      website: '', // honeypot
    },
  });

  const onSubmit = async (data: LeadFormData) => {
    // Honeypot check - if website is filled, it's likely a bot
    if (data.website) {
      setIsSuccess(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          organization: data.organization,
          resourceId,
          resourceTitle,
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        // Still show success for now as this is demo mode
        setIsSuccess(true);
      }
    } catch {
      // In demo mode, show success anyway
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset after animation
    setTimeout(() => {
      reset();
      setIsSuccess(false);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {isSuccess ? (
          <div className="py-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" />
            </motion.div>
            <h3 className="mt-4 text-xl font-semibold text-foreground">
              Thank you, {register('name') ? '' : ''}!
            </h3>
            <p className="mt-2 text-muted-foreground">
              Check your email for the download link. You can also download
              directly below.
            </p>
            {downloadUrl && (
              <Button
                asChild
                className="mt-6 bg-emerald-700 hover:bg-emerald-800"
              >
                <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  Download Now
                </a>
              </Button>
            )}
            <Button
              variant="outline"
              className="mt-3 ml-2"
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-emerald-600" />
                Download Resource
              </DialogTitle>
              <DialogDescription>
                Please provide your details to download &ldquo;{resourceTitle}&rdquo;.
                We&apos;ll send the download link to your email.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
              {/* Honeypot field - hidden from real users */}
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <Input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  {...register('website')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lead-name">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lead-name"
                  placeholder="Enter your full name"
                  {...register('name')}
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lead-email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lead-email"
                  type="email"
                  placeholder="you@example.com"
                  {...register('email')}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lead-org">Organization (optional)</Label>
                <Input
                  id="lead-org"
                  placeholder="Your organization"
                  {...register('organization')}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Get Download Link
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                By downloading, you agree to receive occasional research updates.
                You can unsubscribe at any time.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Need framer-motion import for the success animation
import { motion } from 'framer-motion';

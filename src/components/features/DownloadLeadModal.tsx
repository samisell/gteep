'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
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
import { Loader2, Download, CheckCircle2, Mail } from 'lucide-react';

const leadSchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  email: z.email('Please enter a valid email address'),
  organization: z.string().optional(),
  website: z.string().optional(), // honeypot — hidden from real users
});

type LeadFormData = z.infer<typeof leadSchema>;

interface DownloadLeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resourceId: string;
  resourceTitle: string;
  resourceSlug: string;
  downloadUrl?: string;
}

/**
 * Download Lead Capture Modal
 *
 * Flow:
 * 1. Visitor clicks "Get Access" on a gated resource
 * 2. This modal opens — visitor fills name, email, organization
 * 3. On submit, POST /api/leads creates a download lead record
 * 4. The API sends the visitor an email with a secure download link
 * 5. The download link (GET /api/download/{token}) verifies the token
 *    and redirects to the actual file on WordPress media
 */
export default function DownloadLeadModal({
  open,
  onOpenChange,
  resourceId,
  resourceTitle,
  resourceSlug,
  downloadUrl,
}: DownloadLeadModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedName, setSubmittedName] = useState('');

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
      website: '',
    },
  });

  const onSubmit = async (data: LeadFormData) => {
    // Honeypot check — if website is filled, it's a bot
    if (data.website) {
      setIsSuccess(true);
      setSubmittedName(data.name);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          organization: data.organization || undefined,
          resourceName: resourceTitle,
          resourceSlug: resourceSlug,
          resourceUrl: downloadUrl || undefined,
          website: '', // honeypot field for server-side check
        }),
      });

      if (response.ok) {
        setSubmittedName(data.name);
        setIsSuccess(true);
      } else {
        const result = await response.json().catch(() => null);
        setSubmitError(
          result?.error || 'Something went wrong. Please try again.'
        );
      }
    } catch {
      setSubmitError(
        'Network error. Please check your connection and try again.'
      );
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
      setSubmitError(null);
      setSubmittedName('');
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
              Thank you, {submittedName}!
            </h3>
            <div className="mt-4 flex items-center justify-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <p>Check your email for the download link.</p>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              The link will expire in 24 hours.
            </p>
            <Button
              variant="outline"
              className="mt-6"
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
              {/* Honeypot field — hidden from real users, bots will fill it */}
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

              {submitError && (
                <p className="text-sm text-red-500 text-center">{submitError}</p>
              )}

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

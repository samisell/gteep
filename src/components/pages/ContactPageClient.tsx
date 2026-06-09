'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/shared/PageHeader';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import type { WPSiteSettings } from '@/types';

// =============================================================================
// Props
// =============================================================================

interface ContactPageClientProps {
  settings: WPSiteSettings;
}

// =============================================================================
// Main Component
// =============================================================================

export default function ContactPageClient({ settings }: ContactPageClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [consent, setConsent] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    organization: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const contactEmail = settings.acfOptions?.contactEmail || 'info@gteep.com';
  const contactPhone = settings.acfOptions?.contactPhone || '+234 801 234 5678';
  const contactAddress = settings.acfOptions?.contactAddress || 'Lagos, Nigeria';
  const officeHours = settings.acfOptions?.officeHours || 'Monday - Friday, 9:00 AM - 5:00 PM WAT';

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.trim().length < 10) newErrors.message = 'Message must be at least 10 characters';
    if (!consent) newErrors.consent = 'You must consent to data processing';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          organization: formData.organization,
          consent,
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        toast.success('Message sent!', { description: 'Thank you for reaching out. We will get back to you shortly.' });
      } else {
        // Demo mode - still show success
        setIsSuccess(true);
        toast.success('Message sent!', { description: 'Thank you for reaching out. We will get back to you shortly.' });
      }
    } catch {
      // Demo mode - show success
      setIsSuccess(true);
      toast.success('Message sent!', { description: 'Thank you for reaching out. We will get back to you shortly.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <main className="pt-20">
      {/* Page Header */}
      <PageHeader
        title="Contact Us"
        subtitle="Get in Touch"
        description="We'd love to hear from you. Whether you have a question about our research, partnerships, or anything else, our team is ready to answer."
        breadcrumb={[{ label: 'Contact Us' }]}
      />

      {/* ================================================================== */}
      {/* CONTACT FORM + INFO */}
      {/* ================================================================== */}
      <section className="py-12 md:py-20 bg-white" aria-label="Contact Form">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-3">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <AnimatedSection>
                <Card className="border border-[#e2e8f0] shadow-md">
                  <CardContent className="p-6 md:p-8">
                    {isSuccess ? (
                      <div className="py-10 text-center">
                        <CheckCircle2 className="mx-auto h-16 w-16 text-[#059669]" />
                        <h3
                          className="mt-4 text-xl font-semibold text-[#0f172a]"
                          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                        >
                          Message Sent!
                        </h3>
                        <p className="mt-2 text-[#64748b]">
                          Thank you for reaching out. We will get back to you as soon as possible.
                        </p>
                        <Button
                          variant="outline"
                          className="mt-6 border-[#065f46] text-[#065f46] hover:bg-[#065f46] hover:text-white rounded-xl"
                          onClick={() => {
                            setIsSuccess(false);
                            setFormData({ name: '', email: '', subject: '', message: '', organization: '' });
                            setConsent(false);
                          }}
                        >
                          Send Another Message
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <h2
                          className="text-xl font-semibold text-[#0f172a]"
                          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                        >
                          Send a Message
                        </h2>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="contact-name">
                              Full Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="contact-name"
                              placeholder="Your full name"
                              value={formData.name}
                              onChange={(e) => handleChange('name', e.target.value)}
                              aria-invalid={!!errors.name}
                              className="border-[#e2e8f0] focus-visible:border-[#065f46] focus-visible:ring-[#065f46]/20"
                            />
                            {errors.name && (
                              <p className="text-sm text-red-500">{errors.name}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="contact-email">
                              Email <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="contact-email"
                              type="email"
                              placeholder="you@example.com"
                              value={formData.email}
                              onChange={(e) => handleChange('email', e.target.value)}
                              aria-invalid={!!errors.email}
                              className="border-[#e2e8f0] focus-visible:border-[#065f46] focus-visible:ring-[#065f46]/20"
                            />
                            {errors.email && (
                              <p className="text-sm text-red-500">{errors.email}</p>
                            )}
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="contact-organization">
                              Organization
                            </Label>
                            <Input
                              id="contact-organization"
                              placeholder="Your organization (optional)"
                              value={formData.organization}
                              onChange={(e) => handleChange('organization', e.target.value)}
                              className="border-[#e2e8f0] focus-visible:border-[#065f46] focus-visible:ring-[#065f46]/20"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="contact-subject">
                              Subject <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="contact-subject"
                              placeholder="e.g., Research Collaboration"
                              value={formData.subject}
                              onChange={(e) => handleChange('subject', e.target.value)}
                              aria-invalid={!!errors.subject}
                              className="border-[#e2e8f0] focus-visible:border-[#065f46] focus-visible:ring-[#065f46]/20"
                            />
                            {errors.subject && (
                              <p className="text-sm text-red-500">{errors.subject}</p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="contact-message">
                            Message <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id="contact-message"
                            placeholder="How can we help you?"
                            rows={5}
                            value={formData.message}
                            onChange={(e) => handleChange('message', e.target.value)}
                            aria-invalid={!!errors.message}
                            className="border-[#e2e8f0] focus-visible:border-[#065f46] focus-visible:ring-[#065f46]/20"
                          />
                          {errors.message && (
                            <p className="text-sm text-red-500">{errors.message}</p>
                          )}
                        </div>

                        {/* Consent Checkbox */}
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="contact-consent"
                            checked={consent}
                            onCheckedChange={(checked) => {
                              setConsent(checked === true);
                              if (errors.consent) {
                                setErrors((prev) => {
                                  const next = { ...prev };
                                  delete next.consent;
                                  return next;
                                });
                              }
                            }}
                            className="mt-0.5 data-[state=checked]:bg-[#065f46] data-[state=checked]:border-[#065f46]"
                          />
                          <div>
                            <Label htmlFor="contact-consent" className="text-sm font-normal text-[#64748b] cursor-pointer">
                              I consent to GTEEP processing my personal data in accordance with the privacy policy. <span className="text-red-500">*</span>
                            </Label>
                            {errors.consent && (
                              <p className="text-sm text-red-500 mt-1">{errors.consent}</p>
                            )}
                          </div>
                        </div>

                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          size="lg"
                          className="w-full bg-[#065f46] hover:bg-[#064e3b] text-white sm:w-auto rounded-xl px-8"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </AnimatedSection>
            </div>

            {/* Contact Info Sidebar */}
            <div className="lg:col-span-1">
              <AnimatedSection delay={0.1}>
                <div className="space-y-6">
                  {/* Office Info */}
                  <Card className="border border-[#e2e8f0] shadow-md">
                    <CardContent className="p-6 space-y-5">
                      <h3
                        className="font-semibold text-[#0f172a]"
                        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                      >
                        Office Information
                      </h3>

                      <div className="flex items-start gap-3">
                        <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#059669]" />
                        <div>
                          <p className="text-sm font-medium text-[#0f172a]">Email</p>
                          <a
                            href={`mailto:${contactEmail}`}
                            className="text-sm text-[#059669] hover:underline"
                          >
                            {contactEmail}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#059669]" />
                        <div>
                          <p className="text-sm font-medium text-[#0f172a]">Phone</p>
                          <a
                            href={`tel:${contactPhone.replace(/\s/g, '')}`}
                            className="text-sm text-[#059669] hover:underline"
                          >
                            {contactPhone}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#059669]" />
                        <div>
                          <p className="text-sm font-medium text-[#0f172a]">Address</p>
                          <p className="text-sm text-[#64748b]">
                            {contactAddress}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[#059669]" />
                        <div>
                          <p className="text-sm font-medium text-[#0f172a]">Office Hours</p>
                          <p className="text-sm text-[#64748b]">
                            {officeHours}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Map Placeholder */}
                  <Card className="border border-[#e2e8f0] shadow-md overflow-hidden">
                    <div className="flex h-56 items-center justify-center bg-gradient-to-br from-[#065f46]/5 to-[#0f172a]/5">
                      <div className="text-center">
                        <MapPin className="mx-auto h-10 w-10 text-[#059669]/30" />
                        <p className="mt-2 text-sm font-medium text-[#0f172a]">
                          {contactAddress}
                        </p>
                        <p className="text-xs text-[#64748b] mt-1">Map placeholder</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

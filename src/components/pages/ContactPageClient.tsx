'use client';

import { useState } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Loader2,
  Globe2,
} from 'lucide-react';
import { toast } from 'sonner';
import type { ContactDetailsData } from '@/graphql/fetchers';

// =============================================================================
// Props
// =============================================================================

interface ContactPageClientProps {
  contactDetails: ContactDetailsData;
}

// =============================================================================
// Constants
// =============================================================================

const SUBJECT_OPTIONS = [
  { value: 'general-inquiry', label: 'General Inquiry' },
  { value: 'research-collaboration', label: 'Research Collaboration' },
  { value: 'partnership-opportunity', label: 'Partnership Opportunity' },
  { value: 'policy-advisory', label: 'Policy Advisory' },
  { value: 'media-press', label: 'Media / Press' },
  { value: 'event-inquiry', label: 'Event Inquiry' },
  { value: 'publication-request', label: 'Publication Request' },
  { value: 'volunteer-internship', label: 'Volunteer / Internship' },
  { value: 'other', label: 'Other' },
];

// =============================================================================
// Main Component
// =============================================================================

export default function ContactPageClient({ contactDetails }: ContactPageClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consent, setConsent] = useState(false);

  // Derived from WordPress ACF contactdetails
  const contactEmail = contactDetails.email;
  const contactPhone = contactDetails.phone;
  const contactAddress = contactDetails.address;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    subjectCategory: '',
    message: '',
    organization: '',
    phone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.subjectCategory) newErrors.subjectCategory = 'Please select a subject category';
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
          subject: `[${formData.subjectCategory}] ${formData.subject}`,
          message: formData.message,
          organization: formData.organization,
          phone: formData.phone,
          consent,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Message sent!');
      } else {
        const errorMsg = data.error || 'Something went wrong. Please try again.';
        toast.error('Submission failed', { description: errorMsg });
      }
    } catch {
      toast.error('Network error', {
        description: 'Could not connect to the server. Please check your internet connection and try again.',
      });
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
        subtitle={undefined}
        description={undefined}
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Contact Us' }]}
      />

      {/* ================================================================== */}
      {/* CONTACT FORM + INFO */}
      {/* ================================================================== */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-slate-50/50 to-white" aria-label="Contact Form">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-3">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <AnimatedSection>
                <Card className="border border-[#e2e8f0] shadow-md">
                  <CardContent className="p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Row 1: Name + Email */}
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
                              Email Address <span className="text-red-500">*</span>
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

                        {/* Row 2: Organization + Phone */}
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
                            <Label htmlFor="contact-phone">
                              Phone Number
                            </Label>
                            <Input
                              id="contact-phone"
                              type="tel"
                              placeholder="+234 800 000 0000 (optional)"
                              value={formData.phone}
                              onChange={(e) => handleChange('phone', e.target.value)}
                              className="border-[#e2e8f0] focus-visible:border-[#065f46] focus-visible:ring-[#065f46]/20"
                            />
                          </div>
                        </div>

                        {/* Row 3: Subject Category + Subject */}
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="contact-category">
                              Inquiry Type <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              value={formData.subjectCategory}
                              onValueChange={(value) => handleChange('subjectCategory', value)}
                            >
                              <SelectTrigger
                                id="contact-category"
                                className={`border-[#e2e8f0] focus:ring-[#065f46]/20 ${
                                  errors.subjectCategory ? 'border-red-500' : ''
                                }`}
                              >
                                <SelectValue placeholder="Select inquiry type" />
                              </SelectTrigger>
                              <SelectContent>
                                {SUBJECT_OPTIONS.map((option) => (
                                  <SelectItem key={option.value} value={option.label}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors.subjectCategory && (
                              <p className="text-sm text-red-500">{errors.subjectCategory}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="contact-subject">
                              Subject <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="contact-subject"
                              placeholder="Brief subject of your message"
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

                        {/* Message */}
                        <div className="space-y-2">
                          <Label htmlFor="contact-message">
                            Message <span className="text-red-500">*</span>
                          </Label>
                          <Textarea
                            id="contact-message"
                            placeholder="Tell us how we can help you..."
                            rows={6}
                            value={formData.message}
                            onChange={(e) => handleChange('message', e.target.value)}
                            aria-invalid={!!errors.message}
                            className="border-[#e2e8f0] focus-visible:border-[#065f46] focus-visible:ring-[#065f46]/20 resize-none"
                          />
                          {errors.message && (
                            <p className="text-sm text-red-500">{errors.message}</p>
                          )}
                          <p className="text-xs text-[#94a3b8]">
                            {formData.message.length}/5000 characters
                          </p>
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
                              I consent to GTEEP processing my personal data in accordance with the{' '}
                              <a href="/privacy" className="text-[#059669] hover:underline">
                                privacy policy
                              </a>.{' '}
                              <span className="text-red-500">*</span>
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
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#065f46]/10 flex items-center justify-center shrink-0">
                          <Mail className="h-4 w-4 text-[#065f46]" />
                        </div>
                        <div>
                          <a
                            href={`mailto:${contactEmail}`}
                            className="text-sm text-[#059669] hover:underline"
                          >
                            {contactEmail}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#065f46]/10 flex items-center justify-center shrink-0">
                          <Phone className="h-4 w-4 text-[#065f46]" />
                        </div>
                        <div>
                          <a
                            href={`tel:${contactPhone.replace(/\s/g, '')}`}
                            className="text-sm text-[#059669] hover:underline"
                          >
                            {contactPhone}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#065f46]/10 flex items-center justify-center shrink-0">
                          <MapPin className="h-4 w-4 text-[#065f46]" />
                        </div>
                        <div>
                          <p className="text-sm text-[#64748b]">
                            {contactAddress}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Map Card */}
                  <Card className="border border-[#e2e8f0] shadow-md overflow-hidden">
                    <div className="flex h-56 items-center justify-center bg-gradient-to-br from-[#065f46]/5 to-[#0f172a]/5">
                      <div className="text-center">
                        <div className="w-14 h-14 rounded-full bg-[#065f46]/10 flex items-center justify-center mx-auto mb-3">
                          <Globe2 className="h-7 w-7 text-[#065f46]/40" />
                        </div>
                        <p className="text-sm font-medium text-[#0f172a]">
                          {contactAddress}
                        </p>
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

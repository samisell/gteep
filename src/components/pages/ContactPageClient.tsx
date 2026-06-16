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
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Loader2,
  CheckCircle2,
  MessageSquare,
  Handshake,
  BookOpen,
  Users,
  Globe2,
  Building2,
  HelpCircle,
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

const OFFICE_HOURS = 'Monday - Friday, 9:00 AM - 5:00 PM WAT';

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

const FAQ_ITEMS = [
  {
    question: 'How can I collaborate with GTEEP on research?',
    answer:
      'We welcome research collaborations with academic institutions, think tanks, and policy organizations. Please select "Research Collaboration" as your subject and provide details about your proposed research area, timeline, and expected outcomes.',
  },
  {
    question: 'Does GTEEP offer policy advisory services?',
    answer:
      'Yes, GTEEP provides evidence-based policy advisory services to governments, international organizations, and development agencies across Africa. Our expertise spans trade policy, gender equity, regional integration, and economic empowerment.',
  },
  {
    question: 'How can my organization partner with GTEEP?',
    answer:
      'We are always open to strategic partnerships that align with our mission. Select "Partnership Opportunity" and share your organization details, proposed area of collaboration, and expected mutual benefits.',
  },
  {
    question: 'What is the typical response time?',
    answer:
      'We aim to respond to all inquiries within 2-3 business days. For urgent matters, please call our office during business hours (Monday-Friday, 9 AM - 5 PM WAT).',
  },
  {
    question: 'Are GTEEP publications freely available?',
    answer:
      'Most of our research outputs, policy briefs, and data products are freely available for download. Some specialized reports may require registration. Visit our Outputs page to browse our publications.',
  },
  {
    question: 'Does GTEEP offer internship opportunities?',
    answer:
      'Yes, we periodically offer internship and volunteer positions for emerging researchers and policy enthusiasts. Select "Volunteer / Internship" as your subject to express your interest.',
  },
];

function getContactCards(email: string) {
  return [
    {
      icon: MessageSquare,
      title: 'General Inquiries',
      description: 'Questions about our programs, research, or operations',
      action: email,
      actionLabel: 'Email Us',
      href: `mailto:${email}`,
      color: 'emerald',
    },
    {
      icon: Handshake,
      title: 'Partnerships',
      description: 'Explore strategic collaboration opportunities',
      action: `partnerships@${email.split('@')[1] || 'gteep.gileadtrust.com'}`,
      actionLabel: 'Email Partnerships',
      href: `mailto:partnerships@${email.split('@')[1] || 'gteep.gileadtrust.com'}`,
      color: 'amber',
    },
    {
      icon: BookOpen,
      title: 'Research & Publications',
      description: 'Access our policy briefs, reports, and data',
      action: '/outputs',
      actionLabel: 'Browse Outputs',
      href: '/outputs',
      color: 'emerald',
    },
    {
      icon: Users,
      title: 'Media & Press',
      description: 'Press inquiries, interviews, and commentary',
      action: `media@${email.split('@')[1] || 'gteep.gileadtrust.com'}`,
      actionLabel: 'Email Media Team',
      href: `mailto:media@${email.split('@')[1] || 'gteep.gileadtrust.com'}`,
      color: 'amber',
    },
  ];
}

// =============================================================================
// Animation Variants
// =============================================================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// =============================================================================
// Main Component
// =============================================================================

export default function ContactPageClient({ contactDetails }: ContactPageClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [consent, setConsent] = useState(false);

  // Derived from WordPress ACF contactdetails
  const contactEmail = contactDetails.email;
  const contactPhone = contactDetails.phone;
  const contactAddress = contactDetails.address;
  const contactCards = getContactCards(contactEmail);

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
        setIsSuccess(true);
        toast.success('Message sent!', {
          description: 'Thank you for reaching out. We will get back to you shortly.',
        });
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
        subtitle="Get in Touch"
        description="We'd love to hear from you. Whether you have a question about our research, partnerships, or anything else, our team is ready to answer."
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Contact Us' }]}
      />

      {/* ================================================================== */}
      {/* CONTACT CARDS - Quick Access */}
      {/* ================================================================== */}
      <section className="py-12 md:py-16 bg-white" aria-label="Quick Contact Options">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {contactCards.map((card) => (
              <motion.div key={card.title} variants={itemVariants}>
                <Card className="group h-full border border-[#e2e8f0] hover:border-[#065f46]/30 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${
                        card.color === 'emerald'
                          ? 'bg-[#065f46]/10 text-[#065f46]'
                          : 'bg-[#d97706]/10 text-[#d97706]'
                      }`}
                    >
                      <card.icon className="h-6 w-6" />
                    </div>
                    <h3
                      className="font-semibold text-[#0f172a] mb-1"
                      style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                    >
                      {card.title}
                    </h3>
                    <p className="text-sm text-[#64748b] mb-4">{card.description}</p>
                    {card.href.startsWith('mailto:') ? (
                      <a
                        href={card.href}
                        className="text-sm font-medium text-[#059669] hover:text-[#065f46] transition-colors inline-flex items-center gap-1"
                      >
                        {card.actionLabel}
                        <span className="text-xs">→</span>
                      </a>
                    ) : (
                      <a
                        href={card.href}
                        className="text-sm font-medium text-[#059669] hover:text-[#065f46] transition-colors inline-flex items-center gap-1"
                      >
                        {card.actionLabel}
                        <span className="text-xs">→</span>
                      </a>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

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
                    {isSuccess ? (
                      <div className="py-10 text-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        >
                          <CheckCircle2 className="mx-auto h-16 w-16 text-[#059669]" />
                        </motion.div>
                        <h3
                          className="mt-4 text-xl font-semibold text-[#0f172a]"
                          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                        >
                          Message Sent Successfully!
                        </h3>
                        <p className="mt-2 text-[#64748b] max-w-md mx-auto">
                          Thank you for reaching out to GTEEP. Our team will review your message and
                          get back to you within 2-3 business days.
                        </p>
                        <p className="mt-1 text-sm text-[#94a3b8]">
                          A confirmation email has been sent to your inbox.
                        </p>
                        <Button
                          variant="outline"
                          className="mt-6 border-[#065f46] text-[#065f46] hover:bg-[#065f46] hover:text-white rounded-xl"
                          onClick={() => {
                            setIsSuccess(false);
                            setFormData({
                              name: '',
                              email: '',
                              subject: '',
                              subjectCategory: '',
                              message: '',
                              organization: '',
                              phone: '',
                            });
                            setConsent(false);
                          }}
                        >
                          Send Another Message
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                          <h2
                            className="text-xl font-semibold text-[#0f172a]"
                            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                          >
                            Send a Message
                          </h2>
                          <p className="text-sm text-[#64748b] mt-1">
                            Fill out the form below and we&apos;ll get back to you as soon as possible.
                          </p>
                        </div>

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
                        <div className="w-9 h-9 rounded-lg bg-[#065f46]/10 flex items-center justify-center shrink-0">
                          <Mail className="h-4 w-4 text-[#065f46]" />
                        </div>
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
                        <div className="w-9 h-9 rounded-lg bg-[#065f46]/10 flex items-center justify-center shrink-0">
                          <Phone className="h-4 w-4 text-[#065f46]" />
                        </div>
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
                        <div className="w-9 h-9 rounded-lg bg-[#065f46]/10 flex items-center justify-center shrink-0">
                          <MapPin className="h-4 w-4 text-[#065f46]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#0f172a]">Address</p>
                          <p className="text-sm text-[#64748b]">
                            {contactAddress}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#d97706]/10 flex items-center justify-center shrink-0">
                          <Clock className="h-4 w-4 text-[#d97706]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#0f172a]">Office Hours</p>
                          <p className="text-sm text-[#64748b]">
                            {OFFICE_HOURS}
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
                        <p className="text-xs text-[#64748b] mt-1">GTEEP Headquarters</p>
                      </div>
                    </div>
                  </Card>

                  {/* Quick Response Notice */}
                  <Card className="border border-[#065f46]/20 bg-[#065f46]/5">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#065f46]/10 flex items-center justify-center shrink-0">
                          <Building2 className="h-4 w-4 text-[#065f46]" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#0f172a]">Quick Response</p>
                          <p className="text-xs text-[#64748b] mt-1">
                            We typically respond within 2-3 business days. For urgent matters,
                            please call our office during business hours.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FAQ SECTION */}
      {/* ================================================================== */}
      <section className="py-12 md:py-20 bg-white" aria-label="Frequently Asked Questions">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d97706]/10 text-[#d97706] text-sm font-medium mb-4">
                <HelpCircle className="h-4 w-4" />
                FAQ
              </div>
              <h2
                className="text-2xl md:text-3xl font-bold text-[#0f172a]"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                Frequently Asked Questions
              </h2>
              <p className="mt-2 text-[#64748b]">
                Find answers to common questions about GTEEP and our work.
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-3">
              {FAQ_ITEMS.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="border border-[#e2e8f0] rounded-xl px-6 data-[state=open]:border-[#065f46]/30 data-[state=open]:shadow-sm transition-all"
                >
                  <AccordionTrigger className="text-left text-[#0f172a] hover:no-underline hover:text-[#065f46] py-4 text-sm font-medium">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-[#64748b] text-sm leading-relaxed pb-4">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="mt-10 text-center">
              <Separator className="mb-8" />
              <p className="text-[#64748b] text-sm">
                Still have questions?{' '}
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-[#059669] hover:underline font-medium"
                >
                  Email us directly
                </a>{' '}
                or use the contact form above.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}

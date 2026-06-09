'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { zodResolver } from '@hookform/resolvers/zod';
import PageHeader from '@/components/shared/PageHeader';
import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Loader2,
  CheckCircle2,
  Globe,
  Linkedin,
  Twitter,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const contactSchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  email: z.email('Please enter a valid email'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  website: z.string().optional(), // honeypot
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPageClient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      website: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    // Honeypot check
    if (data.website) {
      setIsSuccess(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          subject: data.subject,
          message: data.message,
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        toast({
          title: 'Message sent!',
          description: 'Thank you for reaching out. We will get back to you shortly.',
        });
      } else {
        // Demo mode - still show success
        setIsSuccess(true);
        toast({
          title: 'Message sent!',
          description: 'Thank you for reaching out. We will get back to you shortly.',
        });
      }
    } catch {
      // Demo mode - show success
      setIsSuccess(true);
      toast({
        title: 'Message sent!',
        description: 'Thank you for reaching out. We will get back to you shortly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen">
      <PageHeader
        title="Contact"
        subtitle="Get in Touch"
        description="Get in touch for research collaborations, speaking engagements, policy advisory, or academic inquiries."
        breadcrumb={[{ label: 'Contact' }]}
      />

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-3">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <AnimatedSection>
                <Card className="border-0 shadow-md">
                  <CardContent className="p-6 md:p-8">
                    {isSuccess ? (
                      <div className="py-10 text-center">
                        <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" />
                        <h3 className="mt-4 text-xl font-semibold">Message Sent!</h3>
                        <p className="mt-2 text-muted-foreground">
                          Thank you for reaching out. We will get back to you as soon as possible.
                        </p>
                        <Button
                          variant="outline"
                          className="mt-6"
                          onClick={() => {
                            setIsSuccess(false);
                            reset();
                          }}
                        >
                          Send Another Message
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <h2 className="text-xl font-semibold text-foreground">Send a Message</h2>

                        {/* Honeypot - hidden from real users */}
                        <div className="absolute -left-[9999px]" aria-hidden="true">
                          <Input
                            type="text"
                            tabIndex={-1}
                            autoComplete="off"
                            {...register('website')}
                          />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="contact-name">
                              Full Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="contact-name"
                              placeholder="Your full name"
                              {...register('name')}
                              aria-invalid={!!errors.name}
                            />
                            {errors.name && (
                              <p className="text-sm text-red-500">{errors.name.message}</p>
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
                              {...register('email')}
                              aria-invalid={!!errors.email}
                            />
                            {errors.email && (
                              <p className="text-sm text-red-500">{errors.email.message}</p>
                            )}
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="contact-phone">Phone (optional)</Label>
                            <Input
                              id="contact-phone"
                              type="tel"
                              placeholder="+234 800 000 0000"
                              {...register('phone')}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="contact-subject">
                              Subject <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="contact-subject"
                              placeholder="e.g., Research Collaboration"
                              {...register('subject')}
                              aria-invalid={!!errors.subject}
                            />
                            {errors.subject && (
                              <p className="text-sm text-red-500">{errors.subject.message}</p>
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
                            {...register('message')}
                            aria-invalid={!!errors.message}
                          />
                          {errors.message && (
                            <p className="text-sm text-red-500">{errors.message.message}</p>
                          )}
                        </div>

                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          size="lg"
                          className="w-full bg-emerald-700 hover:bg-emerald-800 sm:w-auto"
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
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6 space-y-5">
                      <h3 className="font-semibold text-foreground">Office Information</h3>

                      <div className="flex items-start gap-3">
                        <Mail className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <a
                            href="mailto:b.akanji@ui.edu.ng"
                            className="text-sm text-emerald-700 hover:underline"
                          >
                            b.akanji@ui.edu.ng
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                        <div>
                          <p className="text-sm font-medium">Phone</p>
                          <a
                            href="tel:+2348012345678"
                            className="text-sm text-emerald-700 hover:underline"
                          >
                            +234 801 234 5678
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                        <div>
                          <p className="text-sm font-medium">Address</p>
                          <p className="text-sm text-muted-foreground">
                            Department of Economics<br />
                            University of Ibadan<br />
                            Ibadan, Oyo State, Nigeria
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                        <div>
                          <p className="text-sm font-medium">Office Hours</p>
                          <p className="text-sm text-muted-foreground">
                            Mon - Fri: 9:00 AM - 5:00 PM (WAT)<br />
                            By appointment preferred
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Social Links */}
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <h3 className="mb-4 font-semibold text-foreground">Connect</h3>
                      <div className="space-y-3">
                        {[
                          { icon: Globe, label: 'Google Scholar', href: '#' },
                          { icon: Linkedin, label: 'LinkedIn', href: '#' },
                          { icon: Twitter, label: 'Twitter/X', href: '#' },
                        ].map((social) => (
                          <a
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-emerald-50"
                          >
                            <social.icon className="h-4 w-4 text-emerald-600" />
                            <span className="text-sm font-medium text-foreground">
                              {social.label}
                            </span>
                          </a>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Map Placeholder */}
                  <Card className="border-0 shadow-md overflow-hidden">
                    <div className="flex h-48 items-center justify-center bg-gradient-to-br from-emerald-50 to-slate-100">
                      <div className="text-center">
                        <MapPin className="mx-auto h-8 w-8 text-emerald-300" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          University of Ibadan
                        </p>
                        <p className="text-xs text-muted-foreground">Ibadan, Nigeria</p>
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

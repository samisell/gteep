'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Linkedin,
  Twitter,
  BookOpen,
  Mail,
  ArrowRight,
  MapPin,
  Phone,
  ExternalLink,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/what-we-do', label: 'What We Do' },
  { href: '/partners', label: 'Our Partners' },
  { href: '/outputs', label: 'Our Outputs' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact Us' },
];

const focusAreas = [
  'Policy Research',
  'Policy Engagement',
  'Data Speaks',
  'Youth Mentoring',
  "Women's Economic Livelihood",
  'Citizen Enlightenment',
];

const socialLinks = [
  {
    href: 'https://linkedin.com',
    label: 'LinkedIn',
    icon: Linkedin,
  },
  {
    href: 'https://twitter.com',
    label: 'Twitter / X',
    icon: Twitter,
  },
  {
    href: 'https://facebook.com',
    label: 'Facebook',
    icon: BookOpen,
  },
  {
    href: 'https://instagram.com',
    label: 'Instagram',
    icon: Heart,
  },
];

const footerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
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

interface FooterProps {
  logoUrl?: string | null;
}

export default function Footer({ logoUrl }: FooterProps) {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setIsSubscribing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Thank you for subscribing! You'll receive our latest policy insights and updates.");
    setEmail('');
    setIsSubscribing(false);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0f172a] text-slate-300 relative overflow-hidden">
      {/* Gradient Accent Line */}
      <div className="h-1 w-full bg-gradient-to-r from-emerald-700 via-emerald-500 to-amber-500" />

      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-800/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-800/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        variants={footerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Column 1: About */}
          <motion.div variants={itemVariants} className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 group mb-5">
              {logoUrl ? (
                <div className="relative w-9 h-9 rounded-lg overflow-hidden shadow-md transition-transform duration-300 group-hover:scale-105 bg-white">
                  <Image
                    src={logoUrl}
                    alt="GTEEP Logo"
                    fill
                    className="object-contain p-0.5"
                    sizes="36px"
                  />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-700 to-emerald-600 flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-105">
                  <span className="text-white font-bold text-base heading-font">G</span>
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-lg font-bold heading-font bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent leading-tight">
                  GTEEP
                </span>
                <span className="text-[9px] tracking-widest uppercase text-amber-500/60">
                  Economic Empowerment
                </span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Gilead Trust Economic Empowerment Project — Evidence-driven policy analysis
              for socially inclusive development. Empowering communities through research,
              engagement, and strategic policy interventions across Africa.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-emerald-800/50 flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 group"
                  aria-label={`Follow us on ${social.label}`}
                >
                  <social.icon className="h-4 w-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-emerald-400 text-sm transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <ArrowRight className="h-3 w-3 text-emerald-600 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Our Focus */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Our Focus
            </h3>
            <ul className="space-y-2.5">
              {focusAreas.map((area) => (
                <li key={area}>
                  <Link
                    href="/what-we-do"
                    className="text-slate-400 hover:text-amber-400 text-sm transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-amber-500 transition-colors duration-200" />
                    {area}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Contact & Newsletter */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Contact
            </h3>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <a
                href="mailto:info@gteep.com"
                className="flex items-center gap-2.5 text-slate-400 hover:text-emerald-400 text-sm transition-colors"
              >
                <Mail className="h-4 w-4 text-emerald-600 shrink-0" />
                info@gteep.com
              </a>
              <div className="flex items-center gap-2.5 text-slate-400 text-sm">
                <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
                Lagos, Nigeria
              </div>
              <a
                href="tel:+2348012345678"
                className="flex items-center gap-2.5 text-slate-400 hover:text-emerald-400 text-sm transition-colors"
              >
                <Phone className="h-4 w-4 text-emerald-600 shrink-0" />
                +234 801 234 5678
              </a>
            </div>

            {/* Newsletter */}
            <div>
              <p className="text-slate-400 text-xs mb-3">
                Subscribe for policy insights &amp; updates
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-9 bg-slate-800/50 border-slate-700 text-slate-300 placeholder:text-slate-500 text-sm focus:border-emerald-600 focus:ring-emerald-600/20 rounded-lg"
                  required
                  aria-label="Email address for newsletter"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubscribing}
                  className="bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 text-white shrink-0 rounded-lg h-9 px-3"
                  aria-label="Subscribe to newsletter"
                >
                  {isSubscribing ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Bar */}
      <div className="relative border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-xs text-center sm:text-left">
              &copy; {currentYear} GTEEP. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs">
              <Link
                href="/privacy"
                className="text-slate-500 hover:text-emerald-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Separator orientation="vertical" className="h-3 bg-slate-700" />
              <Link
                href="/terms"
                className="text-slate-500 hover:text-emerald-400 transition-colors"
              >
                Terms of Use
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

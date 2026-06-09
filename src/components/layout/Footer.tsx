'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Linkedin,
  Twitter,
  BookOpen,
  GraduationCap,
  Mail,
  ArrowRight,
  MapPin,
  Phone,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const quickLinks = [
  { href: '/about', label: 'About Prof. Akanji' },
  { href: '/research', label: 'Research & Publications' },
  { href: '/projects', label: 'Projects' },
  { href: '/events', label: 'Events & Workshops' },
  { href: '/resources', label: 'Resources & Data' },
  { href: '/media', label: 'Media & News' },
  { href: '/contact', label: 'Contact' },
];

const researchAreas = [
  'International Trade Policy',
  'African Economic Integration',
  'Regional Value Chains',
  'Industrial Development',
  'WTO & Trade Agreements',
  'Economic Transformation',
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
    href: 'https://researchgate.net',
    label: 'ResearchGate',
    icon: BookOpen,
  },
  {
    href: 'https://scholar.google.com',
    label: 'Google Scholar',
    icon: GraduationCap,
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

export default function Footer() {
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

    toast.success('Thank you for subscribing! You\'ll receive our latest research updates.');
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
              <div className="w-9 h-9 rounded-lg gradient-emerald flex items-center justify-center shadow-emerald transition-transform duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-base heading-font">B</span>
              </div>
              <div>
                <span className="text-lg font-bold heading-font gradient-text-emerald-gold leading-tight">
                  Prof. Bola Akanji
                </span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Leading researcher in international trade policy, African economic integration,
              and regional development. Advancing evidence-based policy for Africa&apos;s
              economic transformation.
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
                  aria-label={social.label}
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

          {/* Column 3: Research Areas */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Research Areas
            </h3>
            <ul className="space-y-2.5">
              {researchAreas.map((area) => (
                <li key={area}>
                  <Link
                    href="/research"
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
              Stay Connected
            </h3>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <a
                href="mailto:b.akanji@gteep.com"
                className="flex items-center gap-2.5 text-slate-400 hover:text-emerald-400 text-sm transition-colors"
              >
                <Mail className="h-4 w-4 text-emerald-600 shrink-0" />
                b.akanji@gteep.com
              </a>
              <div className="flex items-center gap-2.5 text-slate-400 text-sm">
                <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
                Lagos, Nigeria
              </div>
              <div className="flex items-center gap-2.5 text-slate-400 text-sm">
                <Phone className="h-4 w-4 text-emerald-600 shrink-0" />
                +234 801 234 5678
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <p className="text-slate-400 text-xs mb-3">
                Subscribe for research updates &amp; insights
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-9 bg-slate-800/50 border-slate-700 text-slate-300 placeholder:text-slate-500 text-sm focus:border-emerald-600 focus:ring-emerald-600/20 rounded-lg"
                  required
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubscribing}
                  className="bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 text-white shrink-0 rounded-lg h-9 px-3"
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
              &copy; {currentYear} Prof. Bola Akanji. All rights reserved.
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
              <Separator orientation="vertical" className="h-3 bg-slate-700" />
              <a
                href="https://gteep.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-emerald-400 transition-colors flex items-center gap-1"
              >
                GTEEP
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

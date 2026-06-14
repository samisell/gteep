import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search, BookOpen, Users, Mail } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#065f46] via-[#047857] to-[#0f172a] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#059669]/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-[#d97706]/8 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#047857]/5 blur-3xl" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* 404 number */}
        <div className="mb-6">
          <span
            className="text-8xl md:text-9xl font-bold text-white/10 select-none"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            404
          </span>
        </div>

        {/* Brand */}
        <h1
          className="text-4xl md:text-5xl font-bold text-white mb-2"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Page Not Found
        </h1>

        {/* Accent line */}
        <div className="flex justify-center mb-6">
          <div className="h-1 w-20 rounded-full bg-gradient-to-r from-emerald-500 to-amber-500" />
        </div>

        <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-8 max-w-lg mx-auto">
          The page you&apos;re looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>

        {/* Action buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Button
            asChild
            size="lg"
            className="bg-[#d97706] hover:bg-[#b45309] text-white rounded-xl shadow-lg"
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 rounded-xl"
          >
            <Link href="/what-we-do">
              <BookOpen className="mr-2 h-4 w-4" />
              What We Do
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 rounded-xl"
          >
            <Link href="/contact">
              <Mail className="mr-2 h-4 w-4" />
              Contact Us
            </Link>
          </Button>
        </div>

        {/* Quick Links */}
        <div className="border-t border-white/10 pt-8">
          <p className="text-slate-400 text-sm mb-4">Or try one of these pages:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: 'About Us', href: '/about' },
              { label: 'Our Partners', href: '/partners' },
              { label: 'Our Outputs', href: '/outputs' },
              { label: 'Fireside Chats', href: '/fireside-chats' },
              { label: 'Blog', href: '/blog' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white/70 transition-all duration-200 hover:border-amber-400/50 hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Menu, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/what-we-do', label: 'What We Do' },
  { href: '/partners', label: 'Our Partners' },
  { href: '/outputs', label: 'Our Outputs' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact Us' },
];

interface NavbarProps {
  logoUrl?: string | null;
}

export default function Navbar({ logoUrl }: NavbarProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when pathname changes
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsMobileMenuOpen(false);
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled
            ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-lg border-b border-emerald-100/50 dark:border-emerald-900/30'
            : 'bg-transparent'
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo / Brand */}
            <Link href="/" className="flex items-center gap-3 group">
              {logoUrl ? (
                <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md transition-transform duration-300 group-hover:scale-105 bg-white">
                  <Image
                    src={logoUrl}
                    alt="GTEEP Logo"
                    fill
                    className="object-contain p-0.5"
                    sizes="40px"
                    priority
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-600 flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-105">
                  <span className="text-white font-bold text-lg heading-font">G</span>
                </div>
              )}
              <div className="flex flex-col">
                <span className={cn(
                  'text-lg lg:text-xl font-bold heading-font leading-tight transition-colors duration-300',
                  'bg-gradient-to-r from-emerald-800 to-emerald-600 bg-clip-text text-transparent'
                )}>
                  GTEEP
                </span>
                <span className={cn(
                  'text-[10px] lg:text-xs tracking-widest uppercase transition-colors duration-300',
                  isScrolled
                    ? 'text-amber-700/70 dark:text-amber-400/70'
                    : 'text-amber-700/60 dark:text-amber-300/60'
                )}>
                  Economic Empowerment
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300',
                    isActive(link.href)
                      ? 'text-emerald-800 dark:text-emerald-300'
                      : 'text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20'
                  )}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute inset-0 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg -z-10"
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  {isActive(link.href) && (
                    <motion.div
                      layoutId="navbar-underline"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-emerald-600 to-amber-500 rounded-full"
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop CTA + Mobile Menu Button */}
            <div className="flex items-center gap-3">
              <Button
                asChild
                className="hidden lg:inline-flex bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 text-white shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 rounded-lg"
              >
                <Link href="/contact">
                  Contact Us
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden relative"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open navigation menu"
              >
                <Menu className="h-6 w-6 text-slate-700 dark:text-slate-200" />
              </Button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Sheet Menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="right" className="w-[300px] sm:w-[360px] p-0">
          <SheetHeader className="p-6 pb-4 border-b border-emerald-100 dark:border-emerald-900/30 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950 dark:to-slate-900">
            <SheetTitle className="flex items-center gap-3">
              {logoUrl ? (
                <div className="relative w-9 h-9 rounded-lg overflow-hidden shadow-md bg-white">
                  <Image
                    src={logoUrl}
                    alt="GTEEP Logo"
                    fill
                    className="object-contain p-0.5"
                    sizes="36px"
                  />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-700 to-emerald-600 flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-base heading-font">G</span>
                </div>
              )}
              <div className="flex flex-col items-start">
                <span className="text-xl font-bold heading-font bg-gradient-to-r from-emerald-800 to-emerald-600 bg-clip-text text-transparent">
                  GTEEP
                </span>
                <span className="text-[10px] tracking-widest uppercase text-amber-700/60 dark:text-amber-400/60 mt-0.5">
                  Economic Empowerment
                </span>
              </div>
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col py-4">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <SheetClose asChild>
                  <Link
                    href={link.href}
                    className={cn(
                      'flex items-center px-6 py-3.5 text-sm font-medium transition-all duration-200 border-l-2',
                      isActive(link.href)
                        ? 'text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-600 dark:border-emerald-400'
                        : 'text-slate-600 dark:text-slate-300 border-transparent hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 hover:border-emerald-300 dark:hover:border-emerald-700'
                    )}
                  >
                    {link.label}
                    {isActive(link.href) && (
                      <ChevronRight className="ml-auto h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </Link>
                </SheetClose>
              </motion.div>
            ))}
          </div>

          <div className="mt-auto px-6 py-6 border-t border-emerald-100 dark:border-emerald-900/30">
            <SheetClose asChild>
              <Button
                asChild
                className="w-full bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 text-white shadow-md rounded-lg"
              >
                <Link href="/contact">
                  Contact Us
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

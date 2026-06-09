import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        {/* 404 Illustration */}
        <div className="mx-auto mb-8 flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100">
          <span className="text-6xl font-bold text-emerald-600">404</span>
        </div>

        <h1 className="text-3xl font-bold text-foreground">Page Not Found</h1>
        <p className="mt-3 max-w-md mx-auto text-muted-foreground">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild className="bg-emerald-700 hover:bg-emerald-800">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
            <Link href="/search">
              <Search className="mr-2 h-4 w-4" />
              Search the Site
            </Link>
          </Button>
        </div>

        {/* Quick Links */}
        <div className="mt-12">
          <p className="text-sm text-muted-foreground mb-4">Or try one of these pages:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: 'About', href: '/about' },
              { label: 'Publications', href: '/publications' },
              { label: 'Projects', href: '/projects' },
              { label: 'Events', href: '/events' },
              { label: 'Resources', href: '/resources' },
              { label: 'Contact', href: '/contact' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

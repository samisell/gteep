import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Under Maintenance — GTEEP',
  description: 'GTEEP is currently undergoing scheduled maintenance. We will be back shortly.',
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#065f46] via-[#047857] to-[#0f172a] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#059669]/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-[#d97706]/8 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#047857]/5 blur-3xl" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center shadow-2xl border border-white/20">
            <span
              className="text-3xl font-bold text-white"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              G
            </span>
          </div>
        </div>

        {/* Brand */}
        <h1
          className="text-4xl md:text-5xl font-bold text-white mb-2"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          GTEEP
        </h1>
        <p className="text-amber-400/80 text-sm tracking-widest uppercase mb-10">
          Economic Empowerment
        </p>

        {/* Animated gear icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <svg
              className="w-20 h-20 text-amber-400 animate-spin"
              style={{ animationDuration: '8s' }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 6V2m0 20v-4M6 12H2m20 0h-4m-1.5-5.5L17 5m-10 0L5.5 6.5m13 13L17 19m-10 0l-1.5 1.5M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
            </svg>
          </div>
        </div>

        {/* Main message */}
        <h2
          className="text-2xl md:text-3xl font-bold text-white mb-4"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          We&apos;ll Be Back Soon
        </h2>
        <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-8">
          We&apos;re currently performing scheduled maintenance to improve our site.
          We apologize for the inconvenience and appreciate your patience.
          Please check back in a little while.
        </p>

        {/* Accent line */}
        <div className="flex justify-center mb-8">
          <div className="h-1 w-20 rounded-full bg-gradient-to-r from-emerald-500 to-amber-500" />
        </div>

        {/* Contact info */}
        <p className="text-slate-400 text-sm">
          Need to reach us?{' '}
          <a
            href="mailto:info@gteep.com"
            className="text-amber-400 hover:text-amber-300 underline underline-offset-4 transition-colors"
          >
            info@gteep.com
          </a>
        </p>
      </div>
    </div>
  );
}

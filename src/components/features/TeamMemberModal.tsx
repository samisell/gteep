'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Linkedin, ExternalLink } from 'lucide-react';
import type { GTEEPTeamMember } from '@/types';

// =============================================================================
// Category display helpers
// =============================================================================

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    'executive': 'Executive Director',
    'director': 'Director',
    'advisory-board': 'Advisory Board Member',
    'board-of-trustees': 'Board of Trustees',
  };
  return labels[category] || category;
}

function getCategoryBadgeStyle(category: string): string {
  switch (category) {
    case 'executive':
      return 'bg-[#065f46] text-white';
    case 'director':
      return 'bg-[#f0fdf4] text-[#059669] border-[#065f46]/20';
    case 'advisory-board':
      return 'bg-[#fef3c7] text-[#d97706] border-[#d97706]/20';
    case 'board-of-trustees':
      return 'bg-[#f0fdf4] text-[#059669] border-[#065f46]/20';
    default:
      return 'bg-[#f1f5f9] text-[#64748b] border-[#64748b]/20';
  }
}

// =============================================================================
// Team Member Modal — lightbox-style popup for full bio
// =============================================================================

interface TeamMemberModalProps {
  member: GTEEPTeamMember | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TeamMemberModal({ member, isOpen, onClose }: TeamMemberModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Get initials for fallback avatar
  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  return (
    <AnimatePresence>
      {isOpen && member && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative header gradient */}
            <div className="relative bg-gradient-to-br from-[#065f46] via-[#047857] to-[#0d9488] px-8 pt-8 pb-20">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 transition-colors z-10"
                aria-label="Close profile"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Category badge */}
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryBadgeStyle(member.category)}`}
              >
                {getCategoryLabel(member.category)}
              </span>

              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4" />
              <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 translate-y-1/3 -translate-x-1/4" />
            </div>

            {/* Avatar — overlapping the header and content */}
            <div className="relative -mt-16 px-8 flex justify-center">
              <div className="w-32 h-32 rounded-full overflow-hidden shadow-xl border-4 border-white shrink-0 relative bg-gradient-to-br from-[#059669] to-[#065f46]">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-center"
                    sizes="128px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                    {getInitials(member.name)}
                  </div>
                )}
              </div>
            </div>

            {/* Content area — scrollable for long bios */}
            <div className="flex-1 overflow-y-auto px-8 pt-5 pb-8">
              {/* Name & role */}
              <div className="text-center mb-6">
                <h2
                  className="text-2xl sm:text-3xl font-bold text-[#0f172a] mb-1"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                  {member.name}
                </h2>
                <p className="text-[#059669] font-semibold text-base">{member.role}</p>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-[#e2e8f0]" />
                <span className="text-[10px] text-[#94a3b8] uppercase tracking-widest font-medium">About</span>
                <div className="flex-1 h-px bg-[#e2e8f0]" />
              </div>

              {/* Full bio */}
              <div className="prose prose-sm max-w-none">
                <p className="text-[#374151] leading-relaxed text-[15px] whitespace-pre-line">
                  {member.bio}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

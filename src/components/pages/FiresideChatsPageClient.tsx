'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/shared/PageHeader';
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from '@/components/shared/AnimatedSection';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Flame,
  Users,
  Calendar,
  MapPin,
  Clock,
  Video,
  Download,
  FileText,
  Mic2,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Lightbulb,
  Globe,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import type { WPEvent } from '@/types';
import { formatDateRange } from '@/utils';

// =============================================================================
// Props
// =============================================================================

interface FiresideChatsPageClientProps {
  firesideEvents: WPEvent[];
}

// =============================================================================
// Fireside Chat Episodes (Static Content)
// =============================================================================

interface FiresideEpisode {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  time: string;
  speakers: string[];
  topics: string[];
  status: 'upcoming' | 'past' | 'recorded';
  recordingUrl?: string;
  slidesUrl?: string;
  imageUrl?: string;
}

const firesideEpisodes: FiresideEpisode[] = [
  {
    id: 'ep-1',
    title: 'Africa: The Gender Backlash',
    subtitle: 'Episode 1',
    description:
      'A critical conversation on the gender backlash in African policy spaces. Leading scholars, policy practitioners, and civil society advocates examine the growing resistance to gender-equitable policies across the continent and explore pathways forward.',
    date: 'April 10, 2025',
    time: '2:00 PM - 4:00 PM WAT',
    speakers: [
      'Dr. Amina Osman — Gender Policy Researcher',
      'Prof. Kofi Mensah — University of Ghana',
      'Ms. Folake Adeyemi — Civil Society Advocate',
    ],
    topics: ['Gender Policy', 'African Development', 'Social Inclusion'],
    status: 'recorded',
    recordingUrl: '#',
    slidesUrl: '/uploads/fireside.pptx',
  },
  {
    id: 'ep-2',
    title: 'Trade Justice vs. Free Trade: Africa\'s Dilemma',
    subtitle: 'Episode 2',
    description:
      'Exploring the tension between trade justice and free trade paradigms in Africa\'s economic transformation. How do we balance open markets with protecting vulnerable communities and emerging industries?',
    date: 'June 12, 2025',
    time: '3:00 PM - 5:00 PM WAT',
    speakers: [
      'Amb. Titi Ogunwande — Trade Policy Expert',
      'Dr. Samuel Njoroge — AfCFTA Advisor',
      'Ms. Adaora Ibe — Economic Justice Campaigner',
    ],
    topics: ['AfCFTA', 'Trade Policy', 'Economic Justice'],
    status: 'upcoming',
  },
  {
    id: 'ep-3',
    title: 'Youth, Tech & the Future of Work in Africa',
    subtitle: 'Episode 3',
    description:
      'How are digital technologies reshaping employment landscapes for Africa\'s youth? This fireside chat brings together tech entrepreneurs, labour economists, and youth advocates to discuss the opportunities and challenges ahead.',
    date: 'August 2025',
    time: 'TBA',
    speakers: [
      'Mr. Chidi Eze — Tech Entrepreneur',
      'Dr. Nneka Obi — Labour Economist',
      'Ms. Zainab Bello — Youth Advocate',
    ],
    topics: ['Digital Economy', 'Youth Employment', 'Technology'],
    status: 'upcoming',
  },
  {
    id: 'ep-4',
    title: 'Climate Finance: Who Pays for Africa\'s Resilience?',
    subtitle: 'Episode 4',
    description:
      'Examining the politics and promises of climate finance for Africa. Are global commitments translating into real resources for the communities most affected by climate change?',
    date: 'October 2025',
    time: 'TBA',
    speakers: ['Panelists to be announced'],
    topics: ['Climate Finance', 'Environmental Policy', 'Global Governance'],
    status: 'upcoming',
  },
];

// =============================================================================
// Download Form Dialog Component
// =============================================================================

function DownloadFormDialog({ fileUrl, fileName }: { fileUrl: string; fileName: string }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/download/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, fileUrl, fileName }),
      });
      if (res.ok) {
        setIsSubmitted(true);
        // Also start the download directly
        window.open(fileUrl, '_blank');
      }
    } catch {
      // Still allow download even if API fails
      window.open(fileUrl, '_blank');
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset after a short delay so the user doesn't see the form reset
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
        setName('');
      }, 300);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Slides
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            Download Presentation
          </DialogTitle>
          <DialogDescription>
            {isSubmitted
              ? 'Your download has started!'
              : 'Enter your details to download the presentation slides.'}
          </DialogDescription>
        </DialogHeader>
        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-8 text-center"
          >
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Download Started!
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Thank you, {name || 'friend'}! Your download should begin automatically.
              We&apos;ve also sent a confirmation to <strong>{email}</strong>.
            </p>
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="rounded-lg"
            >
              Close
            </Button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <label htmlFor="download-name" className="text-sm font-medium">
                Full Name
              </label>
              <Input
                id="download-name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="download-email" className="text-sm font-medium">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input
                id="download-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-lg"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              By downloading, you agree to receive occasional policy updates from GTEEP.
              You can unsubscribe at any time.
            </p>
            <Button
              type="submit"
              disabled={isSubmitting || !email.trim()}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download Now
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export default function FiresideChatsPageClient({
  firesideEvents,
}: FiresideChatsPageClientProps) {
  const getStatusBadge = (status: FiresideEpisode['status']) => {
    switch (status) {
      case 'recorded':
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            <Video className="w-3 h-3 mr-1" />
            Recorded
          </Badge>
        );
      case 'upcoming':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            <Calendar className="w-3 h-3 mr-1" />
            Upcoming
          </Badge>
        );
      case 'past':
        return (
          <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
            Past
          </Badge>
        );
    }
  };

  return (
    <main className="min-h-screen">
      {/* ================================================================== */}
      {/* PAGE HEADER */}
      {/* ================================================================== */}
      <PageHeader
        title="Policy Fireside Chats"
        subtitle="Our Development Conversations"
        description="Intimate, candid conversations with scholars, practitioners, and advocates shaping Africa's policy landscape — under our Policy Engagement programme."
        breadcrumb={[
          { label: 'What We Do', href: '/what-we-do' },
          { label: 'Policy Fireside Chats' },
        ]}
        variant="large"
      />

      {/* ================================================================== */}
      {/* INTRODUCTION SECTION */}
      {/* ================================================================== */}
      <section className="py-16 md:py-20 bg-white" aria-label="Introduction">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              {/* Content */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-600 flex items-center justify-center shadow-md">
                    <Flame className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-sm px-3 py-1">
                    Policy Engagement
                  </Badge>
                </div>
                <h2
                  className="text-3xl sm:text-4xl font-bold text-[#0f172a]"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                  Where Policy Meets Practice
                </h2>
                <div className="h-1 w-20 rounded-full bg-gradient-to-r from-emerald-700 to-amber-500" />
                <p className="text-[#64748b] leading-relaxed text-base md:text-lg">
                  The <strong>Policy Fireside Chats</strong> are GTEEP&apos;s signature conversation
                  series — intimate, moderated dialogues that bring together the brightest minds
                  in African policy research, government, civil society, and the private sector.
                </p>
                <p className="text-[#64748b] leading-relaxed text-base md:text-lg">
                  Unlike formal conferences, our fireside chats create space for honest, unscripted
                  exchanges on the continent&apos;s most pressing development challenges. Each
                  conversation is designed to bridge the gap between evidence and action, turning
                  research insights into policy momentum.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Button
                    asChild
                    className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl"
                  >
                    <a href="#episodes">
                      <Flame className="w-4 h-4 mr-2" />
                      View Episodes
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-xl"
                  >
                    <a href="/what-we-do">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      About Policy Engagement
                    </a>
                  </Button>
                </div>
              </div>

              {/* Visual */}
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl relative">
                  <div className="h-full bg-gradient-to-br from-[#065f46] via-[#047857] to-[#0f172a] flex items-center justify-center">
                    <div className="text-center text-white/90 p-8">
                      <Flame className="w-20 h-20 mx-auto mb-6 text-amber-400 opacity-80" />
                      <h3
                        className="text-2xl md:text-3xl font-bold mb-3"
                        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                      >
                        Policy Fireside Chats
                      </h3>
                      <p className="text-emerald-200 text-sm md:text-base max-w-xs mx-auto">
                        Candid conversations for Africa&apos;s development
                      </p>
                    </div>
                  </div>
                  {/* Decorative */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-amber-500/15 blur-xl" />
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-emerald-500/15 blur-xl" />
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ================================================================== */}
      {/* HOW IT WORKS SECTION */}
      {/* ================================================================== */}
      <section className="py-16 md:py-20 bg-[#f8fafc]" aria-label="How It Works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12">
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-sm px-3 py-1 mb-4">
                The Format
              </Badge>
              <h2
                className="text-3xl md:text-4xl font-bold text-[#0f172a]"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                How Fireside Chats Work
              </h2>
              <p className="mt-4 text-[#64748b] max-w-2xl mx-auto text-base md:text-lg">
                Each session is carefully curated to foster genuine dialogue and actionable
                policy insights.
              </p>
            </div>
          </AnimatedSection>

          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Mic2,
                title: 'Expert Moderation',
                description:
                  'Each chat is led by an experienced moderator who guides the conversation through key policy questions and ensures every voice is heard.',
                color: 'emerald',
              },
              {
                icon: Users,
                title: 'Diverse Panelists',
                description:
                  'We bring together voices from government, academia, civil society, and the private sector for multi-perspective dialogue.',
                color: 'amber',
              },
              {
                icon: MessageSquare,
                title: 'Live Q&A',
                description:
                  'Audience members — both in-person and virtual — can submit questions, ensuring the conversation reflects real community concerns.',
                color: 'emerald',
              },
              {
                icon: Lightbulb,
                title: 'Actionable Insights',
                description:
                  'Each fireside chat concludes with key takeaways and policy recommendations that feed directly into GTEEP\'s research and advocacy.',
                color: 'amber',
              },
            ].map((step) => (
              <StaggerItem key={step.title}>
                <Card className="group border-0 shadow-md hover:shadow-lg transition-all h-full">
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                        step.color === 'emerald'
                          ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-700 group-hover:text-white'
                          : 'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white'
                      } transition-colors`}
                    >
                      <step.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#0f172a] mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#64748b] leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ================================================================== */}
      {/* EPISODES SECTION */}
      {/* ================================================================== */}
      <section id="episodes" className="py-16 md:py-20 bg-white" aria-label="Episodes">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12">
              <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-sm px-3 py-1 mb-4">
                Episodes
              </Badge>
              <h2
                className="text-3xl md:text-4xl font-bold text-[#0f172a]"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                Our Conversations
              </h2>
              <p className="mt-4 text-[#64748b] max-w-2xl mx-auto text-base md:text-lg">
                Explore past and upcoming fireside chat episodes on Africa&apos;s most
                critical policy issues.
              </p>
            </div>
          </AnimatedSection>

          <StaggerContainer className="space-y-6">
            {firesideEpisodes.map((episode, index) => (
              <StaggerItem key={episode.id}>
                <Card className="group border-0 shadow-md hover:shadow-xl transition-all overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Episode Number / Visual */}
                      <div
                        className={`md:w-48 shrink-0 p-6 md:p-8 flex flex-col items-center justify-center text-center ${
                          episode.status === 'recorded'
                            ? 'bg-gradient-to-br from-emerald-800 to-emerald-900'
                            : episode.status === 'upcoming'
                              ? 'bg-gradient-to-br from-amber-700 to-amber-800'
                              : 'bg-gradient-to-br from-slate-700 to-slate-800'
                        }`}
                      >
                        <Flame className="w-10 h-10 text-white/80 mb-2" />
                        <span className="text-white/70 text-xs uppercase tracking-wider font-medium">
                          Episode
                        </span>
                        <span className="text-white text-3xl font-bold">
                          {index + 1}
                        </span>
                      </div>

                      {/* Episode Content */}
                      <div className="flex-1 p-6">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          {getStatusBadge(episode.status)}
                          {episode.topics.map((topic) => (
                            <Badge
                              key={topic}
                              variant="outline"
                              className="bg-slate-50 text-slate-600 border-slate-200 text-xs"
                            >
                              {topic}
                            </Badge>
                          ))}
                        </div>

                        <h3
                          className="text-xl font-bold text-[#0f172a] mb-2 group-hover:text-emerald-700 transition-colors"
                          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                        >
                          {episode.title}
                        </h3>

                        <p className="text-[#64748b] leading-relaxed text-sm md:text-base mb-4">
                          {episode.description}
                        </p>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-[#64748b] mb-4">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-emerald-600" />
                            <span>{episode.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-emerald-600" />
                            <span>{episode.time}</span>
                          </div>
                        </div>

                        {/* Speakers */}
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-[#0f172a] uppercase tracking-wider mb-1.5">
                            Speakers
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {episode.speakers.map((speaker) => (
                              <span
                                key={speaker}
                                className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md"
                              >
                                <Users className="w-3 h-3" />
                                {speaker}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3">
                          {episode.status === 'recorded' && episode.recordingUrl && (
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                              className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-lg"
                            >
                              <a
                                href={episode.recordingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Video className="w-4 h-4 mr-2" />
                                Watch Recording
                                <ExternalLink className="w-3 h-3 ml-1" />
                              </a>
                            </Button>
                          )}
                          {episode.status === 'recorded' && episode.slidesUrl && (
                            <DownloadFormDialog
                              fileUrl={episode.slidesUrl}
                              fileName="fireside.pptx"
                            />
                          )}
                          {episode.status === 'upcoming' && (
                            <Button
                              asChild
                              size="sm"
                              className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg"
                            >
                              <a href="/contact">
                                <Calendar className="w-4 h-4 mr-2" />
                                Register Interest
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ================================================================== */}
      {/* WP EVENTS INTEGRATION */}
      {/* ================================================================== */}
      {firesideEvents.length > 0 && (
        <section className="py-16 md:py-20 bg-[#f8fafc]" aria-label="Related Events">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="text-center mb-12">
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-sm px-3 py-1 mb-4">
                  From Our Calendar
                </Badge>
                <h2
                  className="text-3xl md:text-4xl font-bold text-[#0f172a]"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                  Related Policy Events
                </h2>
              </div>
            </AnimatedSection>

            <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {firesideEvents.slice(0, 3).map((event) => {
                const fields = event.acfEventFields;
                return (
                  <StaggerItem key={event.id}>
                    <Card className="group border-0 shadow-md hover:shadow-lg transition-all h-full">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          {fields?.eventType && (
                            <Badge
                              variant="outline"
                              className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs"
                            >
                              {fields.eventType}
                            </Badge>
                          )}
                          {fields?.isVirtual && (
                            <Badge
                              variant="outline"
                              className="bg-teal-50 text-teal-700 border-teal-200 text-xs"
                            >
                              <Video className="w-3 h-3 mr-1" />
                              Virtual
                            </Badge>
                          )}
                        </div>
                        <a href={`/events/${event.slug}`}>
                          <h3 className="text-lg font-semibold text-[#0f172a] group-hover:text-emerald-700 transition-colors mb-2">
                            {event.title}
                          </h3>
                        </a>
                        <p className="text-sm text-[#64748b] line-clamp-2 mb-4">
                          {event.excerpt}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748b]">
                          {fields?.eventStartDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-emerald-600" />
                              {formatDateRange(
                                fields.eventStartDate,
                                fields.eventEndDate || ''
                              )}
                            </span>
                          )}
                          {fields?.venue && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-emerald-600" />
                              {fields.venue}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* ================================================================== */}
      {/* WHY FIRESIDE CHATS MATTER */}
      {/* ================================================================== */}
      <section className="py-16 md:py-20 bg-white" aria-label="Why It Matters">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              {/* Stats */}
              <div>
                <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-sm px-3 py-1 mb-4">
                  Impact
                </Badge>
                <h2
                  className="text-3xl sm:text-4xl font-bold text-[#0f172a] mb-4"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                  Why Fireside Chats Matter
                </h2>
                <div className="h-1 w-20 rounded-full bg-gradient-to-r from-emerald-700 to-amber-500 mb-6" />
                <p className="text-[#64748b] leading-relaxed text-base md:text-lg mb-8">
                  In an era of complex policy challenges, Africa needs more than white papers
                  and academic journals. It needs spaces where ideas are tested through dialogue,
                  where evidence meets experience, and where diverse perspectives converge to
                  shape better policy outcomes.
                </p>

                <StaggerContainer className="grid grid-cols-2 gap-4">
                  {[
                    {
                      value: '4+',
                      label: 'Episodes',
                      icon: Mic2,
                      color: 'emerald',
                    },
                    {
                      value: '12+',
                      label: 'Expert Speakers',
                      icon: Users,
                      color: 'amber',
                    },
                    {
                      value: '500+',
                      label: 'Attendees',
                      icon: Globe,
                      color: 'emerald',
                    },
                    {
                      value: '3+',
                      label: 'Policy Briefs',
                      icon: FileText,
                      color: 'amber',
                    },
                  ].map((stat) => (
                    <StaggerItem key={stat.label}>
                      <div className="p-4 rounded-xl bg-[#f8fafc] border border-slate-100">
                        <stat.icon
                          className={`w-5 h-5 mb-2 ${
                            stat.color === 'emerald'
                              ? 'text-emerald-600'
                              : 'text-amber-600'
                          }`}
                        />
                        <p className="text-2xl font-bold text-[#0f172a]">
                          {stat.value}
                        </p>
                        <p className="text-xs text-[#64748b]">{stat.label}</p>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>

              {/* Quote */}
              <div className="relative">
                <div className="rounded-2xl bg-gradient-to-br from-[#065f46] to-[#0f172a] p-8 md:p-10 shadow-xl">
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-amber-900" />
                  </div>
                  <blockquote className="text-white/90 text-lg md:text-xl leading-relaxed mb-6">
                    &ldquo;The fireside chat format allows us to go beyond prepared statements.
                    It creates the space for the kind of honest, reflective conversation that
                    actually shifts policy thinking.&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">AO</span>
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">Dr. Amina Osman</p>
                      <p className="text-emerald-300 text-xs">Gender Policy Researcher</p>
                    </div>
                  </div>
                </div>
                {/* Decorative */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-amber-500/15 blur-xl" />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ================================================================== */}
      {/* CTA SECTION */}
      {/* ================================================================== */}
      <section
        className="py-16 md:py-20 bg-[#0f172a] relative overflow-hidden"
        aria-label="Call to Action"
      >
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full bg-[#059669]/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-[#d97706]/8 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="text-center">
              <Flame className="w-12 h-12 text-amber-400 mx-auto mb-6" />
              <h2
                className="text-2xl md:text-3xl font-bold text-white"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                Join the Conversation
              </h2>
              <p className="mt-3 text-[#94a3b8] max-w-2xl mx-auto text-base md:text-lg">
                Whether you&apos;re a policy researcher, government official, civil society
                leader, or simply passionate about Africa&apos;s development, we invite you
                to be part of our fireside chat community.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#d97706] hover:bg-[#b45309] text-white rounded-xl"
                >
                  <a href="/contact">
                    <Calendar className="w-4 h-4 mr-2" />
                    Register for Next Chat
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 rounded-xl"
                >
                  <a href="/what-we-do">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Explore Policy Engagement
                  </a>
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}

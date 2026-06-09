'use client';

import { motion } from 'framer-motion';
import PageHeader from '@/components/shared/PageHeader';
import { AnimatedSection, StaggerContainer, StaggerItem } from '@/components/shared/AnimatedSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  GraduationCap,
  Award,
  Users,
  BookOpen,
  Briefcase,
  Globe,
  ArrowRight,
  ExternalLink,
  MapPin,
  Calendar,
  Target,
  Lightbulb,
} from 'lucide-react';
import type { WPPage } from '@/types';

interface AboutPageClientProps {
  page: WPPage;
}

const careerMilestones = [
  {
    year: '1996',
    title: 'PhD in Economics',
    description: 'University of Ibadan, Nigeria. Dissertation on trade policy and regional integration in West Africa.',
    icon: GraduationCap,
  },
  {
    year: '1998',
    title: 'Lecturer, University of Ibadan',
    description: 'Appointed Lecturer II in the Department of Economics, teaching international trade and development economics.',
    icon: Briefcase,
  },
  {
    year: '2005',
    title: 'Senior Research Fellow',
    description: 'Promoted to Senior Research Fellow at the Trade Policy Research Centre, leading multi-country trade studies.',
    icon: Target,
  },
  {
    year: '2010',
    title: 'AERC Collaborative Research',
    description: 'Began long-standing research collaboration with the African Economic Research Consortium on trade policy.',
    icon: Globe,
  },
  {
    year: '2015',
    title: 'Policy Advisor to ECOWAS',
    description: 'Appointed as policy advisor to the ECOWAS Commission on trade facilitation and NTB elimination.',
    icon: Briefcase,
  },
  {
    year: '2018',
    title: 'AfDB Research Partnership',
    description: 'Secured major research funding from the African Development Bank for AfCFTA implementation monitoring.',
    icon: Award,
  },
  {
    year: '2022',
    title: 'IDRC Gender & Trade Project',
    description: 'Launched the gender-responsive trade facilitilitation project with IDRC funding across West Africa.',
    icon: Users,
  },
  {
    year: '2023',
    title: 'AfCFTA Monitoring Lead',
    description: 'Leading the multi-country AfCFTA implementation monitoring and impact assessment research program.',
    icon: Lightbulb,
  },
];

const researchFocusAreas = [
  {
    title: 'AfCFTA Implementation',
    description: 'Monitoring and assessing the implementation and impacts of the African Continental Free Trade Area.',
    icon: Globe,
  },
  {
    title: 'Regional Trade Integration',
    description: 'Research on trade integration in ECOWAS, COMESA, and other African regional economic communities.',
    icon: MapPin,
  },
  {
    title: 'Trade Facilitation',
    description: 'Studying non-tariff barriers, single window systems, and trade facilitation reforms across Africa.',
    icon: Target,
  },
  {
    title: 'Gender & Trade',
    description: 'Investigating gender dimensions of trade policy and developing gender-responsive trade tools.',
    icon: Users,
  },
  {
    title: 'Industrialization & Value Chains',
    description: 'Examining regional value chains and structural transformation pathways for African industrialization.',
    icon: Lightbulb,
  },
  {
    title: 'Agricultural Trade & Food Security',
    description: 'Analyzing agricultural value chains, food security, and the impact of trade on smallholder farmers.',
    icon: BookOpen,
  },
];

const awards = [
  'African Trade Research Excellence Award, African Development Bank (2023)',
  'Fellow, African Academy of Sciences (2021)',
  'Best Paper Award, Journal of African Trade (2020)',
  'Distinguished Researcher, University of Ibadan (2019)',
  'IDRC Research Impact Award (2018)',
  'Fellow, Nigerian Economic Society (2016)',
];

const affiliations = [
  'African Economic Research Consortium (AERC) — Research Fellow',
  'African Academy of Sciences — Fellow',
  'Nigerian Economic Society — Fellow & Past Council Member',
  'International Trade and Finance Association — Board Member',
  'African Trade Policy Network — Steering Committee Member',
  'University of Ibadan — Professor of Economics',
];

export default function AboutPageClient({ page }: AboutPageClientProps) {
  return (
    <main className="min-h-screen">
      <PageHeader
        title="About Prof. Akanji"
        subtitle="Academic • Researcher • Policy Advisor"
        description="A distinguished economist dedicated to advancing knowledge and policy in African trade and development."
        breadcrumb={[{ label: 'About' }]}
        variant="large"
      />

      {/* Biography Section */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left: Portrait placeholder */}
            <AnimatedSection>
              <div className="relative">
                <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 shadow-xl">
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <GraduationCap className="mx-auto h-20 w-20 text-emerald-300" />
                      <p className="mt-4 text-sm text-emerald-400">Professor Portrait</p>
                    </div>
                  </div>
                </div>
                {/* Decorative badge */}
                <div className="absolute -bottom-4 -right-4 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-lg">
                  25+ Years of Research
                </div>
              </div>
            </AnimatedSection>

            {/* Right: Bio text */}
            <AnimatedSection delay={0.2}>
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-foreground">
                  Professor Bola Akanji
                </h2>
                <div className="h-1 w-16 rounded-full bg-emerald-600" />
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Professor Bola Akanji is a distinguished economist and academic with
                  over 25 years of experience in research, teaching, and policy advisory
                  across Africa and globally.
                </p>
                <p className="leading-relaxed text-muted-foreground">
                  With a PhD in Economics from the University of Ibadan, Prof. Akanji has
                  built a career at the intersection of academic research and real-world
                  policy impact. Specializing in international trade, regional integration,
                  and development economics, the research portfolio spans multiple African
                  countries and regional economic communities.
                </p>
                <p className="leading-relaxed text-muted-foreground">
                  Beyond academic research, Prof. Akanji serves as a policy advisor to
                  several African governments and regional organizations, including the
                  African Union Commission, ECOWAS Commission, and the United Nations
                  Economic Commission for Africa (UNECA). This dual role ensures that
                  research findings translate into actionable policy recommendations.
                </p>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-4 pt-4">
                  {[
                    { label: 'Publications', value: '40+' },
                    { label: 'Projects Led', value: '12' },
                    { label: 'Countries', value: '15+' },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-lg bg-emerald-50 p-4 text-center dark:bg-emerald-950/30"
                    >
                      <p className="text-2xl font-bold text-emerald-700">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Career Timeline */}
      <section className="bg-slate-50 py-16 md:py-20 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-foreground">Career Milestones</h2>
              <p className="mt-3 text-muted-foreground">
                A journey of research excellence and policy impact spanning over two decades.
              </p>
            </div>
          </AnimatedSection>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-emerald-200 md:left-1/2 md:-translate-x-px" />

            <StaggerContainer className="space-y-8">
              {careerMilestones.map((milestone, idx) => {
                const Icon = milestone.icon;
                const isEven = idx % 2 === 0;
                return (
                  <StaggerItem key={milestone.year}>
                    <div
                      className={`relative flex items-start gap-6 pl-12 md:pl-0 ${
                        isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                      }`}
                    >
                      {/* Dot on timeline */}
                      <div className="absolute left-2.5 top-1 z-10 h-3 w-3 rounded-full border-2 border-emerald-600 bg-white md:left-1/2 md:-translate-x-1/2" />

                      {/* Content */}
                      <div className={`flex-1 ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                        <Card className="inline-block border-0 shadow-md">
                          <CardContent className="p-5">
                            <div className={`flex items-center gap-3 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                                <Icon className="h-5 w-5" />
                              </div>
                              <div>
                                <Badge variant="outline" className="mb-1 text-emerald-700 border-emerald-200">
                                  {milestone.year}
                                </Badge>
                                <h3 className="font-semibold text-foreground">{milestone.title}</h3>
                                <p className="mt-1 text-sm text-muted-foreground">{milestone.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Spacer for other side */}
                      <div className="hidden flex-1 md:block" />
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Research Focus Areas */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-foreground">Research Focus Areas</h2>
              <p className="mt-3 text-muted-foreground">
                Core areas of research expertise and ongoing scholarly inquiry.
              </p>
            </div>
          </AnimatedSection>

          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {researchFocusAreas.map((area) => {
              const Icon = area.icon;
              return (
                <StaggerItem key={area.title}>
                  <Card className="h-full border-0 shadow-md transition-shadow hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-foreground">{area.title}</h3>
                      <p className="text-sm text-muted-foreground">{area.description}</p>
                    </CardContent>
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Education & Awards */}
      <section className="bg-slate-50 py-16 md:py-20 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Education */}
            <AnimatedSection>
              <Card className="h-full border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <GraduationCap className="h-6 w-6 text-emerald-600" />
                    Education & Qualifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4 rounded-lg bg-white p-4 shadow-sm">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold">PhD in Economics</h4>
                      <p className="text-sm text-muted-foreground">University of Ibadan, Nigeria (1996)</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Dissertation: Trade Policy and Regional Integration in West Africa
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 rounded-lg bg-white p-4 shadow-sm">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold">MSc in Economics</h4>
                      <p className="text-sm text-muted-foreground">University of Ibadan, Nigeria (1991)</p>
                    </div>
                  </div>
                  <div className="flex gap-4 rounded-lg bg-white p-4 shadow-sm">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold">BSc in Economics (First Class Honours)</h4>
                      <p className="text-sm text-muted-foreground">University of Ibadan, Nigeria (1988)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Awards */}
            <AnimatedSection delay={0.2}>
              <Card className="h-full border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Award className="h-6 w-6 text-amber-600" />
                    Awards & Recognition
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {awards.map((award, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                        <span className="text-sm text-muted-foreground">{award}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Professional Affiliations */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-foreground">Professional Affiliations</h2>
            </div>
          </AnimatedSection>

          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {affiliations.map((affiliation, idx) => (
              <StaggerItem key={idx}>
                <div className="flex items-start gap-3 rounded-lg border border-slate-200 p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/50">
                  <Globe className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  <span className="text-sm text-foreground">{affiliation}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Teaching & Mentorship */}
      <section className="bg-[#0f172a] py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-white">Teaching & Mentorship</h2>
              <p className="mt-3 text-slate-300">
                Committed to nurturing the next generation of African economists.
              </p>
            </div>
          </AnimatedSection>

          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Graduate Courses', value: '8+', desc: 'Economics & trade policy courses taught' },
              { label: 'PhD Students Supervised', value: '20+', desc: 'Successfully supervised to completion' },
              { label: 'MSc Students Mentored', value: '50+', desc: 'Across multiple African universities' },
              { label: 'Capacity Building Workshops', value: '30+', desc: 'Facilitated across Africa' },
            ].map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="rounded-xl bg-white/5 p-6 text-center backdrop-blur-sm border border-white/10">
                  <p className="text-3xl font-bold text-emerald-400">{stat.value}</p>
                  <p className="mt-1 font-semibold text-white">{stat.label}</p>
                  <p className="mt-1 text-xs text-slate-400">{stat.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="rounded-2xl bg-gradient-to-r from-emerald-800 to-emerald-700 p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Explore Research & Publications
              </h2>
              <p className="mt-3 text-emerald-100 max-w-2xl mx-auto">
                Discover the full body of research, from journal articles and book chapters
                to working papers and policy briefs.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-emerald-800 hover:bg-emerald-50"
                >
                  <a href="/publications">
                    View Publications
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  <a href="/contact">
                    Get in Touch
                    <ExternalLink className="ml-2 h-4 w-4" />
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

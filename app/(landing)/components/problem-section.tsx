'use client';

import {
  Clock,
  XCircle,
  TrendingDown,
  AlertTriangle,
} from 'lucide-react';
import { SectionContainer } from '@/components/landing/section-container';
import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { problemContent } from '@/lib/constants/problem-solution';

/**
 * Problem Statement Section
 *
 * Shows pain points that Context8 solves
 * Targets all 3 audiences with relatable problems
 */
export function ProblemSection() {
  // Map icon names to Lucide components
  const iconMap: Record<string, React.ElementType> = {
    clock: Clock,
    'x-circle': XCircle,
    'trending-down': TrendingDown,
    'alert-triangle': AlertTriangle,
  };

  return (
    <SectionContainer id="problem" className="relative bg-slate-900/50">
      {/* Timeline connector */}
      <div className="absolute left-1/2 top-0 h-full w-0.5 bg-gradient-to-b from-transparent via-red-500/30 to-transparent" />

      <div className="mx-auto max-w-6xl text-center">
        {/* Section title */}
        <ScrollReveal>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-red-400">
            {problemContent.sectionTitle}
          </p>
        </ScrollReveal>

        {/* Headline */}
        <ScrollReveal delay={0.1}>
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            {problemContent.headline}
          </h2>
        </ScrollReveal>

        {/* Problem points grid with stagger */}
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {problemContent.problems.map((problem, index) => {
            const IconComponent = iconMap[problem.icon] || AlertTriangle;

            return (
              <ScrollReveal key={index} delay={0.1 * index} direction="up">
                <div className="group relative rounded-lg border border-red-900/20 bg-slate-900/50 p-6 text-left transition-all hover:border-red-500/30 hover:bg-red-950/10 hover:shadow-lg hover:shadow-red-500/10">
                  {/* Icon with pulse effect */}
                  <div className="mb-4 inline-flex rounded-lg bg-red-500/10 p-3 transition-all group-hover:bg-red-500/20 group-hover:shadow-lg group-hover:shadow-red-500/20">
                    <IconComponent className="h-6 w-6 text-red-400 transition-transform group-hover:scale-110" />
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    {problem.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm leading-relaxed text-slate-400">{problem.description}</p>

                  {/* Index indicator */}
                  <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10 text-xs font-bold text-red-400">
                    {index + 1}
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </SectionContainer>
  );
}

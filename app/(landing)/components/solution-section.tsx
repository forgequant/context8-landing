'use client';

import {
  Zap,
  Boxes,
  Sparkles,
  Shield,
} from 'lucide-react';
import { SectionContainer } from '@/components/landing/section-container';
import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { solutionContent } from '@/lib/constants/problem-solution';

/**
 * Solution Overview Section
 *
 * Shows how Context8 solves the problems
 * Highlights key benefits and value proposition
 */
export function SolutionSection() {
  // Map icon names to Lucide components
  const iconMap: Record<string, React.ElementType> = {
    zap: Zap,
    boxes: Boxes,
    sparkles: Sparkles,
    shield: Shield,
  };

  return (
    <SectionContainer id="solution" className="relative">
      {/* Timeline connector */}
      <div className="absolute left-1/2 top-0 h-full w-0.5 bg-gradient-to-b from-transparent via-teal-500/30 to-transparent" />

      <div className="mx-auto max-w-6xl text-center">
        {/* Section title */}
        <ScrollReveal>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-teal-400">
            {solutionContent.sectionTitle}
          </p>
        </ScrollReveal>

        {/* Headline */}
        <ScrollReveal delay={0.1}>
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            {solutionContent.headline}
          </h2>
        </ScrollReveal>

        {/* Description */}
        <ScrollReveal delay={0.2}>
          <p className="mx-auto mb-12 max-w-3xl text-lg text-slate-400">
            {solutionContent.description}
          </p>
        </ScrollReveal>

        {/* Benefits grid with stagger */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {solutionContent.benefits.map((benefit, index) => {
            const IconComponent = iconMap[benefit.icon] || Sparkles;

            return (
              <ScrollReveal key={index} delay={0.1 * index} direction="up">
                <div className="group relative h-full rounded-lg border border-teal-900/20 bg-slate-900/50 p-6 text-left transition-all hover:border-teal-500/50 hover:bg-teal-950/10 hover:shadow-lg hover:shadow-teal-500/20 hover:-translate-y-1">
                  {/* Icon with glow effect */}
                  <div className="mb-4 inline-flex rounded-lg bg-teal-500/10 p-3 transition-all group-hover:bg-teal-500/20 group-hover:shadow-lg group-hover:shadow-teal-500/30">
                    <IconComponent className="h-6 w-6 text-teal-400 transition-transform group-hover:scale-110 group-hover:rotate-6" />
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 text-lg font-semibold text-white">
                    {benefit.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm leading-relaxed text-slate-400">{benefit.description}</p>

                  {/* Success indicator */}
                  <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-teal-500/10 text-xs font-bold text-teal-400">
                    ✓
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

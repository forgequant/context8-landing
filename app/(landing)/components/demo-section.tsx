'use client';

import { useState } from 'react';
import { SectionContainer } from '@/components/landing/section-container';
import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { CTAButton } from '@/components/landing/cta-button';
import { demoContent } from '@/lib/constants/demo-content';
import { MessageSquare, Sparkles } from 'lucide-react';

/**
 * Demo Section
 *
 * Shows a concrete example of Context8 + LLM analysis
 * Demonstrates value for traders and analysts (US3)
 *
 * Displays:
 * - Example query
 * - AI-generated response with structured data
 * - Timestamp for realism
 * - CTA to try it yourself
 */
export function DemoSection() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <SectionContainer id="demo">
      <div className="mx-auto max-w-5xl">
        {/* Section title */}
        <ScrollReveal>
          <div className="mb-12 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-teal-400">
              {demoContent.sectionTitle}
            </p>

            {/* Headline */}
            <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              {demoContent.headline}
            </h2>

            {/* Description */}
            {demoContent.description && (
              <p className="mx-auto max-w-3xl text-lg text-slate-400">
                {demoContent.description}
              </p>
            )}
          </div>
        </ScrollReveal>

        {/* Demo container with interactive highlight */}
        <ScrollReveal delay={0.2}>
          <div
            className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 shadow-2xl transition-all hover:border-teal-500/30 hover:shadow-teal-500/10"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Query */}
            <div className={`border-b border-slate-800 bg-slate-900 p-6 transition-colors ${isHovered ? 'bg-slate-800/50' : ''}`}>
              <div className="flex items-start gap-4">
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-500/10 transition-all ${isHovered ? 'bg-blue-500/20 scale-110' : ''}`}>
                  <MessageSquare className="h-5 w-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-400">
                    Your Query
                  </p>
                  <p className="mt-1 text-lg font-medium text-white">
                    {demoContent.demo.query}
                  </p>
                </div>
              </div>
            </div>

            {/* Response */}
            <div className={`p-6 transition-colors ${isHovered ? 'bg-teal-950/5' : ''}`}>
            <div className="flex items-start gap-4">
              <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-purple-500/10 transition-all ${isHovered ? 'bg-teal-500/20 scale-110' : ''}`}>
                <Sparkles className={`h-5 w-5 transition-colors ${isHovered ? 'text-teal-400' : 'text-purple-400'}`} />
              </div>
              <div className="flex-1">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-400">
                    AI Response
                  </p>
                  {demoContent.demo.timestamp && (
                    <span className="text-xs text-slate-500">
                      {demoContent.demo.timestamp}
                    </span>
                  )}
                </div>

                {/* Response content with markdown-style formatting */}
                <div className="prose prose-invert max-w-none">
                  <div className="space-y-4 text-sm leading-relaxed text-slate-300">
                    {demoContent.demo.response.split('\n\n').map((paragraph, index) => {
                      // Check if paragraph is a heading (starts with **)
                      if (paragraph.startsWith('**') && paragraph.includes('**')) {
                        const heading = paragraph.split('**')[1];
                        const rest = paragraph.split('**').slice(2).join('**');
                        return (
                          <div key={index}>
                            <h3 className="text-base font-bold text-white">
                              {heading}
                            </h3>
                            {rest && (
                              <div
                                className="mt-2 whitespace-pre-line"
                                dangerouslySetInnerHTML={{
                                  __html: rest
                                    .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white">$1</strong>')
                                    .replace(/- /g, '• '),
                                }}
                              />
                            )}
                          </div>
                        );
                      }
                      return (
                        <p
                          key={index}
                          className="whitespace-pre-line"
                          dangerouslySetInnerHTML={{
                            __html: paragraph
                              .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white">$1</strong>')
                              .replace(/- /g, '• '),
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            </div>

            {/* Footer with CTA */}
            {demoContent.cta && (
              <div className="border-t border-slate-800 bg-slate-900/50 p-6">
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                  <div className="text-center sm:text-left">
                    <p className="text-sm font-semibold text-white">
                      Ready to try Context8?
                    </p>
                    <p className="text-sm text-slate-400">
                      Get started for free, no credit card required
                    </p>
                  </div>
                  <CTAButton {...demoContent.cta} />
                </div>
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Additional info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Live demo updates every 60 seconds with real market data
          </p>
        </div>
      </div>
    </SectionContainer>
  );
}

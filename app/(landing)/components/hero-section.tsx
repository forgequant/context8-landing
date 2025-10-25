'use client';

import Image from 'next/image';
import { Users, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { SectionContainer } from '@/components/landing/section-container';
import { CTAButton } from '@/components/landing/cta-button';
import { heroContent } from '@/lib/constants/hero-content';

/**
 * Hero Section - Above the fold
 *
 * Primary goal: Visitor understands Context8 value proposition within 10 seconds
 * Implements Problem-Solution-Benefit structure from research.md
 */
export function HeroSection() {
  const IconComponent = heroContent.badges?.[0]?.icon === 'users' ? Users : Clock;
  const SecondIconComponent = heroContent.badges?.[1]?.icon === 'clock' ? Clock : Users;

  return (
    <SectionContainer spacing="spacious" className="relative overflow-hidden">
      {/* Background gradient with teal accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900" />
      <div className="absolute inset-0 bg-gradient-radial from-teal-500/10 via-transparent to-transparent blur-3xl" />

      {/* Content */}
      <motion.div
        className="relative z-10 mx-auto max-w-4xl text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Trust badges */}
        {heroContent.badges && heroContent.badges.length > 0 && (
          <motion.div
            className="mb-8 flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {heroContent.badges.map((badge, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-2 backdrop-blur-sm transition-all hover:border-teal-500/50 hover:bg-teal-500/20"
              >
                {index === 0 ? (
                  <Users className="h-4 w-4 text-teal-400" />
                ) : (
                  <Clock className="h-4 w-4 text-teal-400" />
                )}
                <span className="text-sm text-teal-300">{badge.label}</span>
              </div>
            ))}
          </motion.div>
        )}

        {/* Headline */}
        <motion.h1
          className="mb-6 text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {heroContent.headline.emphasis ? (
            <>
              {heroContent.headline.main.split(heroContent.headline.emphasis)[0]}
              <span className="bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
                {heroContent.headline.emphasis}
              </span>
              {heroContent.headline.main.split(heroContent.headline.emphasis)[1]}
            </>
          ) : (
            heroContent.headline.main
          )}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="mb-4 text-xl text-slate-300 md:text-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {heroContent.subheadline}
        </motion.p>

        {/* Description */}
        <motion.p
          className="mx-auto mb-10 max-w-2xl text-lg text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {heroContent.description}
        </motion.p>

        {/* CTAs with enhanced visual hierarchy */}
        <motion.div
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {/* Primary CTA - larger, with teal color and glow */}
          <CTAButton
            {...heroContent.cta.primary}
            className="group relative overflow-hidden bg-gradient-to-r from-teal-500 to-teal-600 px-8 py-6 text-lg font-semibold text-white shadow-lg shadow-teal-500/50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-teal-500/60"
            size="lg"
          />
          {heroContent.cta.secondary && (
            <CTAButton
              {...heroContent.cta.secondary}
              className="border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-800/50"
            />
          )}
        </motion.div>

        {/* Hero visual with animation */}
        {heroContent.visual && heroContent.visual.type !== 'none' && (
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="relative mx-auto max-w-4xl overflow-hidden rounded-xl border border-slate-700/50 shadow-2xl shadow-teal-500/20 transition-all hover:shadow-teal-500/30">
              <Image
                src={heroContent.visual.src || '/images/placeholder-hero.png'}
                alt={heroContent.visual.alt}
                width={800}
                height={450}
                priority
                className="w-full"
              />
              {/* Subtle overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent pointer-events-none" />
            </div>
          </motion.div>
        )}
      </motion.div>
    </SectionContainer>
  );
}

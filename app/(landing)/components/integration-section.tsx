'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Mail, Github, ExternalLink } from 'lucide-react';
import { SectionContainer } from '@/components/landing/section-container';
import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { integrationContent } from '@/lib/constants/integration-content';
import { Button } from '@/components/ui/button';

/**
 * Integration Section
 *
 * Shows MCP compatibility (FR-006) and OAuth security (FR-007):
 * - Compatible AI tools (ChatGPT, Claude, Cursor)
 * - OAuth authentication (Google, GitHub)
 * - Documentation link
 */
export function IntegrationSection() {
  // Icon map for OAuth providers
  const iconMap: Record<string, React.ElementType> = {
    mail: Mail,
    github: Github,
  };

  return (
    <SectionContainer id="integration" className="bg-slate-900/50">
      <div className="mx-auto max-w-6xl">
        {/* Section title */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-purple-400">
            {integrationContent.sectionTitle}
          </p>

          {/* Headline */}
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            {integrationContent.headline}
          </h2>

          {/* Description */}
          <p className="mx-auto max-w-3xl text-lg text-slate-400">
            {integrationContent.description}
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Compatible Tools */}
          <div>
            <h3 className="mb-6 text-2xl font-bold text-white">
              MCP-Compatible Tools
            </h3>

            <div className="space-y-4">
              {integrationContent.compatibleTools.map((tool) => (
                <div
                  key={tool.id}
                  className="flex items-center gap-4 rounded-lg border border-slate-800 bg-slate-900/50 p-4 transition-colors hover:border-slate-700"
                >
                  {/* Tool logo */}
                  <div className="relative h-12 w-12 flex-shrink-0">
                    <Image
                      src={tool.logo.src}
                      alt={tool.logo.alt}
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* Tool name */}
                  <div className="flex-1">
                    <p className="font-semibold text-white">{tool.name}</p>
                  </div>

                  {/* Status badge */}
                  <div>
                    {tool.status === 'supported' && (
                      <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                        Supported
                      </span>
                    )}
                    {tool.status === 'beta' && (
                      <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-400">
                        Beta
                      </span>
                    )}
                    {tool.status === 'coming-soon' && (
                      <span className="rounded-full bg-slate-500/10 px-3 py-1 text-xs font-medium text-slate-400">
                        Coming Soon
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Documentation link */}
            <div className="mt-6">
              <Button variant="outline" size="default" asChild>
                <Link href={integrationContent.documentation.href}>
                  {integrationContent.documentation.label}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* OAuth Security */}
          <div>
            <h3 className="mb-6 text-2xl font-bold text-white">
              {integrationContent.oauth.headline}
            </h3>

            <p className="mb-6 text-slate-400">
              {integrationContent.oauth.description}
            </p>

            {/* OAuth providers */}
            <div className="space-y-4">
              {integrationContent.oauth.providers.map((provider) => {
                const IconComponent = iconMap[provider.icon] || Mail;

                return (
                  <div
                    key={provider.id}
                    className="flex items-center gap-4 rounded-lg border border-slate-800 bg-slate-900/50 p-4"
                  >
                    {/* Icon */}
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
                      <IconComponent className="h-6 w-6 text-purple-400" />
                    </div>

                    {/* Provider name */}
                    <div className="flex-1">
                      <p className="font-semibold text-white">
                        Continue with {provider.name}
                      </p>
                      <p className="text-sm text-slate-400">
                        OAuth 2.0 secure authentication
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Security note */}
            <div className="mt-6 rounded-lg border border-purple-500/20 bg-purple-500/5 p-4">
              <div className="flex gap-3">
                <svg
                  className="h-5 w-5 flex-shrink-0 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-purple-300">
                    Your data stays yours
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    We never store API keys or exchange credentials. All auth
                    flows use industry-standard OAuth 2.0.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}

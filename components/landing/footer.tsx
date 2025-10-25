import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Twitter, Github, MessageCircle } from 'lucide-react';
import { footerContent } from '@/lib/constants/footer-content';

/**
 * Footer Component
 *
 * Site-wide footer with:
 * - Logo and tagline
 * - Navigation links organized by category
 * - Social media links
 * - Copyright information
 *
 * Part of User Story 6 (US6)
 */
export function Footer() {
  // Icon map for social platforms
  const socialIconMap: Record<string, React.ElementType> = {
    twitter: Twitter,
    github: Github,
    'message-circle': MessageCircle,
  };

  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Logo and tagline */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 group">
              {/* Enhanced logo with data flow concept */}
              <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-purple-500 transition-all group-hover:shadow-lg group-hover:shadow-teal-500/50">
                <span className="text-xl font-bold text-white">C8</span>
                {/* Data flow indicator */}
                <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">Context8</span>
                <p className="text-xs font-semibold text-teal-400">Live Data. Smarter AI.</p>
              </div>
            </div>

            {footerContent.tagline && (
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
                {footerContent.tagline}
              </p>
            )}

            {/* Social links */}
            {footerContent.social && footerContent.social.length > 0 && (
              <div className="mt-6 flex gap-4">
                {footerContent.social.map((social) => {
                  const IconComponent = socialIconMap[social.icon] || MessageCircle;

                  return (
                    <a
                      key={social.platform}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.ariaLabel}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 bg-slate-900/50 text-slate-400 transition-all hover:scale-110 hover:border-teal-500 hover:bg-teal-500/10 hover:text-teal-400 hover:shadow-lg hover:shadow-teal-500/20"
                    >
                      <IconComponent className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Link groups */}
          {footerContent.links.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-purple-400"
                      >
                        {link.label}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-slate-400 transition-colors hover:text-purple-400"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-slate-800 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            {/* Copyright */}
            <p className="text-sm text-slate-500">{footerContent.copyright}</p>

            {/* Additional links */}
            <div className="flex gap-6">
              <Link
                href="/sitemap.xml"
                className="text-sm text-slate-500 transition-colors hover:text-slate-400"
              >
                Sitemap
              </Link>
              <Link
                href="/rss"
                className="text-sm text-slate-500 transition-colors hover:text-slate-400"
              >
                RSS
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

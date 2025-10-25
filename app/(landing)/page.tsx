import { HeroSection } from './components/hero-section';
import { ProblemSection } from './components/problem-section';
import { SolutionSection } from './components/solution-section';
import { DataSourcesSection } from './components/data-sources-section';
import { IntegrationSection } from './components/integration-section';
import { DemoSection } from './components/demo-section';
import { PricingSection } from './components/pricing-section';
import { Footer } from '@/components/landing/footer';
import { LivePriceWidget } from '@/components/landing/live-price-widget';
import { PageWrapper } from '@/components/landing/page-wrapper';

/**
 * Context8 Landing Page
 *
 * Main landing page showcasing Context8 MCP server features
 * and driving conversions to signup/registration.
 *
 * Sections implemented:
 * 1. Hero Section (US1) - Value proposition + primary CTA ✓
 * 2. Problem Statement (US1) - Pain points ✓
 * 3. Solution Overview (US1) - Benefits ✓
 * 4. Data Sources (US2) - 4 sources with update frequency ✓
 * 5. Integration (US2) - MCP compatibility + OAuth ✓
 * 6. Demo (US3) - Example query/response ✓
 * 7. Pricing (US4) - Free vs Pro comparison ✓
 * 8. Footer (US6) - Links, social, copyright ✓
 */
export default function LandingPage() {
  return (
    <PageWrapper>
      {/* Sticky live price widget header */}
      <div className="sticky top-0 z-50 flex justify-center border-b border-slate-800/50 bg-slate-950/95 py-3 backdrop-blur-sm">
        <LivePriceWidget />
      </div>

      <main className="min-h-screen bg-slate-950 text-slate-50">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <DataSourcesSection />
        <IntegrationSection />
        <DemoSection />
        <PricingSection />
      </main>
      <Footer />
    </PageWrapper>
  );
}

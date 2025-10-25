import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeroSection } from '@/app/(landing)/components/hero-section';
import { heroContent } from '@/lib/constants/hero-content';

describe('HeroSection', () => {
  it('renders the main headline', () => {
    render(<HeroSection />);

    const headline = screen.getByRole('heading', { level: 1 });
    expect(headline).toBeInTheDocument();
    expect(headline).toHaveTextContent(heroContent.headline.main);
  });

  it('renders the headline with emphasized text', () => {
    render(<HeroSection />);

    if (heroContent.headline.emphasis) {
      const emphasisElement = screen.getByText(heroContent.headline.emphasis);
      expect(emphasisElement).toBeInTheDocument();
      expect(emphasisElement).toHaveClass('text-purple-400');
    }
  });

  it('renders the subheadline', () => {
    render(<HeroSection />);

    const subheadline = screen.getByText(heroContent.subheadline);
    expect(subheadline).toBeInTheDocument();
  });

  it('renders the description text', () => {
    render(<HeroSection />);

    const description = screen.getByText(heroContent.description);
    expect(description).toBeInTheDocument();
  });

  it('renders trust badges when provided', () => {
    render(<HeroSection />);

    if (heroContent.badges && heroContent.badges.length > 0) {
      heroContent.badges.forEach((badge) => {
        const badgeElement = screen.getByText(badge.label);
        expect(badgeElement).toBeInTheDocument();
      });
    }
  });

  it('renders primary CTA button with correct attributes', () => {
    render(<HeroSection />);

    const primaryCTA = screen.getByRole('link', {
      name: heroContent.cta.primary.ariaLabel || heroContent.cta.primary.text
    });

    expect(primaryCTA).toBeInTheDocument();
    expect(primaryCTA).toHaveAttribute('href', heroContent.cta.primary.href);
    expect(primaryCTA).toHaveTextContent(heroContent.cta.primary.text);
  });

  it('renders secondary CTA button when provided', () => {
    render(<HeroSection />);

    if (heroContent.cta.secondary) {
      const secondaryCTA = screen.getByRole('link', {
        name: heroContent.cta.secondary.ariaLabel || heroContent.cta.secondary.text
      });

      expect(secondaryCTA).toBeInTheDocument();
      expect(secondaryCTA).toHaveAttribute('href', heroContent.cta.secondary.href);
      expect(secondaryCTA).toHaveTextContent(heroContent.cta.secondary.text);
    }
  });

  it('renders hero visual when type is not "none"', () => {
    render(<HeroSection />);

    if (heroContent.visual && heroContent.visual.type !== 'none') {
      const heroImage = screen.getByAltText(heroContent.visual.alt);
      expect(heroImage).toBeInTheDocument();
    }
  });

  it('applies dark theme background gradient', () => {
    const { container } = render(<HeroSection />);

    const backgroundGradient = container.querySelector('.bg-gradient-to-br');
    expect(backgroundGradient).toBeInTheDocument();
  });

  it('renders responsive layout container', () => {
    const { container } = render(<HeroSection />);

    // Check for responsive max-width container
    const contentContainer = container.querySelector('.max-w-4xl');
    expect(contentContainer).toBeInTheDocument();
  });

  it('has proper semantic structure for accessibility', () => {
    render(<HeroSection />);

    // Ensure main heading is h1
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toBeInTheDocument();

    // Ensure CTAs are properly labeled
    const primaryCTA = screen.getByRole('link', {
      name: heroContent.cta.primary.ariaLabel || heroContent.cta.primary.text
    });
    expect(primaryCTA).toHaveAccessibleName();
  });
});

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { PortfolioTheme } from '../types/portfolio';

interface TopNavProps {
  brandName: string;
  theme: PortfolioTheme;
  isClientMode?: boolean;
}

const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Agreement', href: '#agreement' },
];

export function TopNav({ brandName, theme, isClientMode = false }: TopNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-30 border-b border-white/10 backdrop-blur-md"
      style={{ backgroundColor: `${theme.bgColor}E6` }}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single-line brand wordmark */}
        <a
          href="#home"
          className="shrink-0 whitespace-nowrap text-base font-semibold tracking-[0.22em] text-white transition-opacity hover:opacity-85"
          style={{ fontFamily: theme.displayFont }}
        >
          {brandName}
        </a>

        {/* Zone 2: 5 concise single-line navigation links */}
        {!isClientMode && (
          <nav
            aria-label="Primary Navigation"
            className="hidden items-center gap-7 text-xs font-medium uppercase tracking-[0.16em] text-zinc-300 md:flex"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="shrink-0 whitespace-nowrap border-b border-transparent py-1 transition-colors hover:border-white/70 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}

        {/* Zone 3: 1 primary CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={isClientMode ? '#client-contact' : '#contact'}
            className="hidden shrink-0 whitespace-nowrap rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] md:inline-flex"
            style={{ backgroundColor: theme.accentColor }}
          >
            Contact
          </a>

          {!isClientMode && (
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 text-zinc-200 transition-colors hover:bg-white/10 md:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>

      {mobileOpen && !isClientMode && (
        <nav
          aria-label="Mobile Navigation"
          className="border-t border-white/10 px-6 py-4 md:hidden"
          style={{ backgroundColor: theme.surfaceColor }}
        >
          <div className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex min-h-[44px] items-center rounded-md px-3 text-sm font-medium tracking-wide text-zinc-200 hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="mt-2 flex min-h-[44px] items-center justify-center rounded-lg px-4 text-sm font-semibold text-white"
              style={{ backgroundColor: theme.accentColor }}
            >
              Contact
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}

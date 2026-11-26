import { ArrowDown } from 'lucide-react';
import { GENERATED_ASSETS } from '../data/defaultPortfolio';
import type { PortfolioData } from '../types/portfolio';

interface HeroSectionProps {
  data: PortfolioData;
  isCanvasMode?: boolean;
  onSelectSection?: () => void;
}

export function HeroSection({
  data,
  isCanvasMode = false,
  onSelectSection,
}: HeroSectionProps) {
  const { theme, brandName, tagline, videos } = data;

  return (
    <section
      id="home"
      onClick={isCanvasMode ? onSelectSection : undefined}
      className={`relative overflow-hidden ${
        isCanvasMode ? 'cursor-pointer ring-1 ring-inset ring-transparent hover:ring-white/30' : ''
      }`}
      style={{ backgroundColor: theme.heroBgColor }}
    >
      {/* Atmospheric architectural glass backdrop */}
      <img
        src={GENERATED_ASSETS.heroBackdrop}
        alt=""
        aria-hidden="true"
        referrerPolicy="no-referrer"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-45 mix-blend-screen"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 42%, ${theme.secondaryAccent}66 0%, ${theme.heroBgColor}E0 65%, ${theme.bgColor} 100%)`,
        }}
      />

      <div className="relative mx-auto flex max-w-[1280px] flex-col items-center justify-center px-6 pb-16 pt-16 text-center sm:pb-24 sm:pt-24">
        <p
          className="mb-7 text-sm tracking-[0.24em] text-zinc-200 sm:text-base"
          style={{ fontFamily: theme.displayFont }}
        >
          {tagline}
        </p>

        {/* Centered metallic-framed glass centerpiece matching the MikeyFlix Canva Hero */}
        <div
          className="relative flex w-full max-w-[960px] items-center justify-center rounded-[44px] border border-white/30 px-6 py-16 shadow-2xl backdrop-blur-md sm:px-14 sm:py-24"
          style={{
            background: `linear-gradient(145deg, ${theme.secondaryAccent}4D 0%, rgba(5,8,24,0.85) 55%, ${theme.accentColor}26 100%)`,
          }}
        >
          <h1
            className="text-balance font-medium uppercase tracking-[0.2em] text-white sm:tracking-[0.26em]"
            style={{
              fontFamily: theme.displayFont,
              fontSize: `calc(clamp(1.75rem, 3.6vw, 3.35rem) * ${theme.fontScale})`,
              lineHeight: 1.15,
            }}
          >
            {brandName}
          </h1>
        </div>

        <a
          href="#portfolio"
          onClick={(e) => {
            if (isCanvasMode) e.preventDefault();
          }}
          className="mt-8 inline-flex min-h-[44px] items-center gap-2 border-b border-white/30 px-4 py-2 text-sm tracking-[0.18em] text-zinc-100 transition-colors hover:border-white hover:text-white"
          style={{ fontFamily: theme.displayFont }}
        >
          <span>Explore</span>
          <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>

      {/* Continuous editorial marquee divider */}
      <div
        className="relative overflow-hidden border-y border-white/10 py-3"
        style={{ backgroundColor: theme.bgColor }}
      >
        <div className="animate-marquee flex items-center gap-8 text-xs font-medium uppercase tracking-[0.24em] text-zinc-300">
          {Array.from({ length: 12 }).map((_, idx) => (
            <span key={idx} className="shrink-0 whitespace-nowrap">
              {brandName} <span aria-hidden="true">·</span> VIDEO EDITING{' '}
              <span aria-hidden="true">·</span> AI PRODUCTION
            </span>
          ))}
        </div>
      </div>

      {/* Full-width 4-column proof strip below hero */}
      <div
        className="relative border-b border-white/10"
        style={{ backgroundColor: theme.bgColor }}
      >
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 divide-x divide-y divide-white/10 sm:grid-cols-4 sm:divide-y-0">
          <div className="px-6 py-5 text-center sm:text-left">
            <div className="tabular-nums text-xl font-semibold text-white">
              {videos.length}+ Cuts
            </div>
            <div className="mt-1 text-xs text-zinc-400">Active portfolio reels & films</div>
          </div>
          <div className="px-6 py-5 text-center sm:text-left">
            <div className="tabular-nums text-xl font-semibold text-white">12–24 hrs</div>
            <div className="mt-1 text-xs text-zinc-400">Rapid turnaround delivery</div>
          </div>
          <div className="px-6 py-5 text-center sm:text-left">
            <div className="tabular-nums text-xl font-semibold text-white">4K + AI</div>
            <div className="mt-1 text-xs text-zinc-400">DaVinci Resolve & AI pipeline</div>
          </div>
          <div className="px-6 py-5 text-center sm:text-left">
            <div className="tabular-nums text-xl font-semibold text-white">90 Days</div>
            <div className="mt-1 text-xs text-zinc-400">Structured growth partnership</div>
          </div>
        </div>
      </div>
    </section>
  );
}

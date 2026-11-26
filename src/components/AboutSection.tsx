import { GENERATED_ASSETS } from '../data/defaultPortfolio';
import type { AboutContent, PortfolioTheme } from '../types/portfolio';

interface AboutSectionProps {
  about: AboutContent;
  brandName: string;
  theme: PortfolioTheme;
  isCanvasMode?: boolean;
  onSelectSection?: () => void;
}

export function AboutSection({
  about,
  brandName,
  theme,
  isCanvasMode = false,
  onSelectSection,
}: AboutSectionProps) {
  return (
    <section
      id="about"
      onClick={isCanvasMode ? onSelectSection : undefined}
      className={`border-b border-white/10 py-20 sm:py-28 ${
        isCanvasMode ? 'cursor-pointer hover:ring-1 hover:ring-inset hover:ring-white/25' : ''
      }`}
      style={{ backgroundColor: theme.surfaceColor, color: theme.textColor }}
    >
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left column: Founder narrative & value breakdown */}
          <div className="lg:col-span-7">
            <h2
              className="font-bold uppercase tracking-wide"
              style={{
                color: theme.accentColor,
                fontFamily: theme.displayFont,
                fontSize: `calc(clamp(2.2rem, 4vw, 3.5rem) * ${theme.fontScale})`,
                lineHeight: 1.08,
              }}
            >
              {about.title}
            </h2>

            <p className="mt-3 text-base font-medium text-zinc-200">
              {brandName} <span aria-hidden="true">·</span> Founded by {about.founderName}
            </p>

            <div className="mt-10 grid grid-cols-1 gap-8 border-t border-white/10 pt-8 sm:grid-cols-2">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  What we do
                </h3>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-200">
                  {about.whatWeDo.map((line, i) => (
                    <li key={i} className="border-b border-white/5 pb-2.5 last:border-b-0">
                      {line}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  What you gain
                </h3>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-200">
                  {about.whatYouGain.map((line, i) => (
                    <li key={i} className="border-b border-white/5 pb-2.5 last:border-b-0">
                      {line}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  We understand your problem
                </h3>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-zinc-300">
                  {about.problemStatement.map((line, i) => (
                    <li key={i} className="border-b border-white/5 pb-2.5 last:border-b-0">
                      {line}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  Who we work with
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-zinc-200">
                  {about.whoWeWorkWith}
                </p>
              </div>
            </div>
          </div>

          {/* Right column: Circular editorial founder portrait matching Canva reference */}
          <div className="flex justify-center lg:col-span-5">
            <div className="relative flex items-center justify-center p-4">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-4 rounded-full blur-3xl opacity-45"
                style={{
                  background: `radial-gradient(circle, ${theme.accentColor} 0%, ${theme.secondaryAccent} 55%, transparent 75%)`,
                }}
              />
              <div className="relative h-72 w-72 overflow-hidden rounded-full border border-white/20 bg-zinc-900 shadow-2xl sm:h-96 sm:w-96">
                <img
                  src={GENERATED_ASSETS.founderPortrait}
                  alt={`${about.founderName}, Founder of ${brandName}`}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

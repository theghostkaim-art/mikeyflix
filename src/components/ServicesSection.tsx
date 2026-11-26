import { Check } from 'lucide-react';
import { GENERATED_ASSETS } from '../data/defaultPortfolio';
import type { PortfolioTheme, ServicePlan } from '../types/portfolio';

interface ServicesSectionProps {
  services: ServicePlan[];
  theme: PortfolioTheme;
  onSelectPlan: (planId: string) => void;
  isCanvasMode?: boolean;
  onSelectSection?: () => void;
}

export function ServicesSection({
  services,
  theme,
  onSelectPlan,
  isCanvasMode = false,
  onSelectSection,
}: ServicesSectionProps) {
  return (
    <section
      id="services"
      onClick={isCanvasMode ? onSelectSection : undefined}
      className={`relative overflow-hidden border-b border-white/10 py-20 sm:py-28 ${
        isCanvasMode ? 'cursor-pointer hover:ring-1 hover:ring-inset hover:ring-white/25' : ''
      }`}
      style={{ backgroundColor: theme.bgColor, color: theme.textColor }}
    >
      <img
        src={GENERATED_ASSETS.workspaceWave}
        alt=""
        aria-hidden="true"
        referrerPolicy="no-referrer"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-50"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${theme.bgColor} 0%, ${theme.bgColor}99 50%, ${theme.bgColor} 100%)`,
        }}
      />

      <div className="relative mx-auto max-w-[1280px] px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-400">
              Monthly Growth Retainers
            </p>
            <h2
              className="mt-2 font-bold uppercase italic tracking-tight text-white"
              style={{
                fontFamily: theme.displayFont,
                fontSize: `calc(clamp(2.2rem, 4vw, 3.6rem) * ${theme.fontScale})`,
                lineHeight: 1.05,
              }}
            >
              SERVICES
            </h2>
          </div>
          <p className="max-w-md text-sm text-zinc-400">
            Transparent 1-month retainers crafted for consistent reach, trust, and rapid post-production delivery.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
          {services.map((plan) => (
            <div
              key={plan.id}
              className={`flex flex-col justify-between rounded-2xl border p-7 transition-colors ${
                plan.featured
                  ? 'border-2 shadow-2xl'
                  : 'border-white/15 hover:border-white/30'
              }`}
              style={{
                backgroundColor: `${theme.surfaceColor}EE`,
                borderColor: plan.featured ? theme.accentColor : undefined,
              }}
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-[0.16em]">
                  <span style={{ color: plan.featured ? theme.accentColor : '#A1A1AA' }}>
                    {plan.badge}
                  </span>
                  <span className="tabular-nums text-zinc-400">{plan.durationTag}</span>
                </div>

                <h3
                  className="mt-4 text-2xl font-semibold text-white"
                  style={{ fontFamily: theme.displayFont }}
                >
                  {plan.name}
                </h3>

                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="tabular-nums text-3xl font-bold text-white sm:text-4xl">
                    {plan.price}
                  </span>
                  <span className="text-sm text-zinc-400">{plan.cadence}</span>
                </div>

                <div className="my-6 border-t border-white/10" />

                <ul className="space-y-3.5 text-sm text-zinc-200">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0"
                        style={{ color: theme.accentColor }}
                        aria-hidden="true"
                      />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 border-t border-white/10 pt-5">
                <p className="text-xs text-zinc-400">{plan.footnote}</p>
                <a
                  href="#agreement"
                  onClick={(e) => {
                    if (isCanvasMode) {
                      e.preventDefault();
                      return;
                    }
                    onSelectPlan(plan.id);
                  }}
                  className={`mt-4 flex min-h-[44px] w-full items-center justify-center rounded-lg px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition-transform duration-150 hover:scale-[1.01] ${
                    plan.featured
                      ? 'text-white'
                      : 'border border-white/20 bg-white/5 text-white hover:bg-white/10'
                  }`}
                  style={plan.featured ? { backgroundColor: theme.accentColor } : undefined}
                >
                  Select {plan.name} Plan
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

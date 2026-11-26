import { ArrowLeft, Lock, Mail, MessageCircle, Play } from 'lucide-react';
import type { ClientShowcaseLink, PortfolioData, VideoItem } from '../types/portfolio';
import { buildYouTubeThumbnailUrl, resolveActiveTheme } from '../utils/portfolioLogic';
import { AboutSection } from './AboutSection';
import { ContactAndAgreementSection } from './ContactAndAgreementSection';
import { ServicesSection } from './ServicesSection';
import { TopNav } from './TopNav';

interface ClientScreeningViewProps {
  portfolio: PortfolioData;
  showcase: ClientShowcaseLink;
  onPlayVideo: (video: VideoItem, hideYoutubeLinks: boolean) => void;
  onExitSharePreview?: () => void;
  selectedPlanId: string;
  onSelectPlan: (planId: string) => void;
}

export function ClientScreeningView({
  portfolio,
  showcase,
  onPlayVideo,
  onExitSharePreview,
  selectedPlanId,
  onSelectPlan,
}: ClientScreeningViewProps) {
  const activeTheme = resolveActiveTheme(portfolio.theme, showcase.themeOverride);

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: activeTheme.bgColor,
        color: activeTheme.textColor,
        fontFamily: activeTheme.bodyFont,
      }}
    >
      <TopNav
        brandName={portfolio.brandName}
        theme={activeTheme}
        isClientMode={!showcase.showFullPortfolio}
      />

      <main className="mx-auto max-w-[1280px] px-6 py-16 sm:py-24">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
              <Lock className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Private Client Screening</span>
              <span aria-hidden="true">·</span>
              <span>{showcase.clientName}</span>
            </div>
            <h1
              className="mt-3 text-balance font-semibold tracking-tight text-white"
              style={{
                fontFamily: activeTheme.displayFont,
                fontSize: `calc(clamp(2rem, 4vw, 3.5rem) * ${activeTheme.fontScale})`,
                lineHeight: 1.1,
              }}
            >
              {showcase.projectTitle}
            </h1>
            {showcase.welcomeNote && (
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-300">
                {showcase.welcomeNote}
              </p>
            )}
          </div>

          {onExitSharePreview && (
            <button
              type="button"
              onClick={onExitSharePreview}
              className="inline-flex min-h-[40px] cursor-pointer items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-xs font-medium text-zinc-200 hover:bg-white/10"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Back to Main Portfolio</span>
            </button>
          )}
        </div>

        {/* Curated Client Videos */}
        {(() => {
          const verticalVideos = showcase.videos.filter((v) => v.aspect === '9:16');
          const landscapeVideos = showcase.videos.filter((v) => v.aspect !== '9:16');
          return (
            <div className="mt-12 space-y-10">
              {landscapeVideos.length > 0 && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {landscapeVideos.map((video) => (
                    <article
                      key={video.id}
                      className="group overflow-hidden rounded-2xl border border-white/15 transition-colors hover:border-white/30"
                      style={{ backgroundColor: activeTheme.surfaceColor }}
                    >
                      <button
                        type="button"
                        onClick={() => onPlayVideo(video, showcase.hideYoutubeLinks)}
                        aria-label={`Play ${video.title}`}
                        className="relative aspect-video w-full cursor-pointer overflow-hidden bg-black text-left"
                      >
                        <img
                          src={buildYouTubeThumbnailUrl(video.youtubeId)}
                          alt={video.title}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                        <span
                          className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/65 text-white backdrop-blur-sm transition-transform duration-200 group-hover:scale-110"
                          style={{ boxShadow: `0 0 0 1px ${activeTheme.accentColor}45` }}
                        >
                          <Play className="ml-0.5 h-5 w-5 fill-current" aria-hidden="true" />
                        </span>
                        <div className="absolute inset-x-0 bottom-0 p-5">
                          <div className="text-xs text-zinc-300">
                            {video.category} <span aria-hidden="true">·</span> {video.clientTag}
                          </div>
                          <h2 className="mt-1.5 text-base font-semibold text-white">
                            {video.title}
                          </h2>
                        </div>
                      </button>
                    </article>
                  ))}
                </div>
              )}

              {verticalVideos.length > 0 && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {verticalVideos.map((video) => (
                    <article
                      key={video.id}
                      className="group overflow-hidden rounded-2xl border border-white/15 transition-colors hover:border-white/30"
                      style={{ backgroundColor: activeTheme.surfaceColor }}
                    >
                      <button
                        type="button"
                        onClick={() => onPlayVideo(video, showcase.hideYoutubeLinks)}
                        aria-label={`Play ${video.title}`}
                        className="relative aspect-[9/14] w-full cursor-pointer overflow-hidden bg-black text-left"
                      >
                        <img
                          src={buildYouTubeThumbnailUrl(video.youtubeId)}
                          alt={video.title}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                        <span
                          className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/65 text-white backdrop-blur-sm transition-transform duration-200 group-hover:scale-110"
                          style={{ boxShadow: `0 0 0 1px ${activeTheme.accentColor}45` }}
                        >
                          <Play className="ml-0.5 h-5 w-5 fill-current" aria-hidden="true" />
                        </span>
                        <div className="absolute inset-x-0 bottom-0 p-5">
                          <div className="text-xs text-zinc-300">
                            {video.category} <span aria-hidden="true">·</span> {video.clientTag}
                          </div>
                          <h2 className="mt-1.5 text-base font-semibold text-white">
                            {video.title}
                          </h2>
                        </div>
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* Client Action Strip */}
        <div
          id="client-contact"
          className="mt-14 flex flex-col items-start justify-between gap-6 rounded-2xl border border-white/15 p-8 sm:flex-row sm:items-center"
          style={{ backgroundColor: activeTheme.surfaceColor }}
        >
          <div>
            <h2 className="text-lg font-semibold text-white">
              Ready to approve or request revisions?
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Send feedback directly to {portfolio.brandName} — replies within 24 hours.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={portfolio.contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-950"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              <span>WhatsApp Feedback</span>
            </a>
            <a
              href={`mailto:${portfolio.contact.emailAddress}?subject=${encodeURIComponent(
                `Feedback: ${showcase.projectTitle}`
              )}`}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-white/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/10"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              <span>Email Studio</span>
            </a>
          </div>
        </div>
      </main>

      {showcase.showFullPortfolio && (
        <>
          <AboutSection
            about={portfolio.about}
            brandName={portfolio.brandName}
            theme={activeTheme}
          />
          <ServicesSection
            services={portfolio.services}
            theme={activeTheme}
            onSelectPlan={onSelectPlan}
          />
          <ContactAndAgreementSection
            brandName={portfolio.brandName}
            contact={portfolio.contact}
            agreement={portfolio.agreement}
            services={portfolio.services}
            selectedPlanId={selectedPlanId}
            onSelectPlan={onSelectPlan}
            theme={activeTheme}
          />
        </>
      )}
    </div>
  );
}

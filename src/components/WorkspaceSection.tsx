import { useState } from 'react';
import { Lock, Play, Trash2 } from 'lucide-react';
import { GENERATED_ASSETS } from '../data/defaultPortfolio';
import type { PortfolioTheme, VideoItem } from '../types/portfolio';
import { buildYouTubeThumbnailUrl } from '../utils/portfolioLogic';

interface WorkspaceSectionProps {
  manifestoQuote: string;
  videos: VideoItem[];
  theme: PortfolioTheme;
  onPlayVideo: (video: VideoItem) => void;
  isCanvasMode?: boolean;
  onRemoveVideo?: (videoId: string) => void;
  onSelectSection?: () => void;
}

type AspectFilter = 'all' | '9:16' | '16:9';

export function WorkspaceSection({
  manifestoQuote,
  videos,
  theme,
  onPlayVideo,
  isCanvasMode = false,
  onRemoveVideo,
  onSelectSection,
}: WorkspaceSectionProps) {
  const [filter, setFilter] = useState<AspectFilter>('all');

  const visibleVideos = videos.filter((v) =>
    filter === 'all' ? true : v.aspect === filter
  );

  const verticalVideos = visibleVideos.filter((v) => v.aspect === '9:16');
  const landscapeVideos = visibleVideos.filter((v) => v.aspect === '16:9');

  return (
    <section
      id="portfolio"
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
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-45"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${theme.bgColor} 0%, ${theme.bgColor}B3 45%, ${theme.bgColor} 100%)`,
        }}
      />

      <div className="relative mx-auto max-w-[1280px] px-6">
        {/* Heading + Manifesto + Filter Row */}
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-400">
              Selected Cuts & Showreel
            </p>
            <h2
              className="mt-3 italic tracking-tight text-white"
              style={{
                fontFamily: theme.displayFont,
                fontSize: `calc(clamp(2.4rem, 4.5vw, 4rem) * ${theme.fontScale})`,
                lineHeight: 1.05,
              }}
            >
              WORKSPACE
            </h2>
          </div>

          <div className="lg:col-span-7">
            <blockquote
              className="text-base leading-relaxed text-zinc-200 sm:text-lg"
              style={{ fontFamily: theme.bodyFont }}
            >
              {manifestoQuote}
            </blockquote>
          </div>
        </div>

        {/* Functional Filter Segmented Control */}
        <div
          className="mt-10 flex flex-wrap items-center justify-between gap-4 border-y border-white/10 py-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            role="tablist"
            aria-label="Filter portfolio videos by format"
            className="flex items-center gap-1 rounded-lg border border-white/10 p-1"
            style={{ backgroundColor: theme.surfaceColor }}
          >
            {(
              [
                { id: 'all', label: `All Cuts (${videos.length})` },
                {
                  id: '9:16',
                  label: `Reels 9:16 (${videos.filter((v) => v.aspect === '9:16').length})`,
                },
                {
                  id: '16:9',
                  label: `Films 16:9 (${videos.filter((v) => v.aspect === '16:9').length})`,
                },
              ] as const
            ).map((tab) => {
              const active = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(tab.id)}
                  className={`min-h-[40px] shrink-0 cursor-pointer whitespace-nowrap rounded-md px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    active ? 'text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                  style={active ? { backgroundColor: theme.accentColor } : undefined}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-zinc-400">
            Click any film to stream in studio quality
          </p>
        </div>

        {/* Empty State */}
        {visibleVideos.length === 0 && (
          <div
            className="mt-12 rounded-2xl border border-white/10 p-12 text-center"
            style={{ backgroundColor: theme.surfaceColor }}
          >
            <p className="text-base font-medium text-white">No videos in this format yet.</p>
            <p className="mt-2 text-sm text-zinc-400">
              Open the Edit Bar below to add YouTube or unlisted showcase videos.
            </p>
          </div>
        )}

        {/* Vertical Reels Row (9:16) */}
        {verticalVideos.length > 0 && (
          <div className="mt-12">
            <h3 className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
              Vertical Reels & Social Ads (9:16)
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {verticalVideos.map((video) => (
                <article
                  key={video.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 transition-colors hover:border-white/25"
                  style={{ backgroundColor: theme.surfaceColor }}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayVideo(video);
                    }}
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
                      className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/60 text-white backdrop-blur-sm transition-transform duration-200 group-hover:scale-110"
                      style={{ boxShadow: `0 0 0 1px ${theme.accentColor}40` }}
                    >
                      <Play className="ml-0.5 h-5 w-5 fill-current" aria-hidden="true" />
                    </span>
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <div className="text-xs text-zinc-300">
                        {video.category} <span aria-hidden="true">·</span> {video.clientTag}
                        {video.isUnlisted && (
                          <>
                            {' '}
                            <span aria-hidden="true">·</span>{' '}
                            <span className="inline-flex items-center gap-1 text-zinc-200">
                              <Lock className="h-3 w-3" aria-hidden="true" /> Unlisted
                            </span>
                          </>
                        )}
                      </div>
                      <h4 className="mt-1.5 text-base font-semibold text-white">
                        {video.title}
                      </h4>
                    </div>
                  </button>

                  {isCanvasMode && onRemoveVideo && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveVideo(video.id);
                      }}
                      aria-label={`Remove ${video.title}`}
                      className="absolute right-3 top-3 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-red-400/30 bg-black/80 text-red-300 transition-colors hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Landscape Films Row (16:9) */}
        {landscapeVideos.length > 0 && (
          <div className="mt-14">
            <h3 className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
              Trailers, AI Commercials & Studio Films (16:9)
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {landscapeVideos.map((video) => (
                <article
                  key={video.id}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 transition-colors hover:border-white/25"
                  style={{ backgroundColor: theme.surfaceColor }}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayVideo(video);
                    }}
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
                    <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/60 text-white backdrop-blur-sm transition-transform duration-200 group-hover:scale-110">
                      <Play className="ml-0.5 h-5 w-5 fill-current" aria-hidden="true" />
                    </span>
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <div className="text-xs text-zinc-300">
                        {video.category} <span aria-hidden="true">·</span> {video.clientTag}
                        {video.isUnlisted && (
                          <>
                            {' '}
                            <span aria-hidden="true">·</span>{' '}
                            <span className="inline-flex items-center gap-1 text-zinc-200">
                              <Lock className="h-3 w-3" aria-hidden="true" /> Unlisted
                            </span>
                          </>
                        )}
                      </div>
                      <h4 className="mt-1.5 text-lg font-semibold text-white">
                        {video.title}
                      </h4>
                    </div>
                  </button>

                  {isCanvasMode && onRemoveVideo && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveVideo(video.id);
                      }}
                      aria-label={`Remove ${video.title}`}
                      className="absolute right-3 top-3 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-red-400/30 bg-black/80 text-red-300 transition-colors hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

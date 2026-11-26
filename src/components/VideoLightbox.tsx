import { useEffect } from 'react';
import { ExternalLink, X } from 'lucide-react';
import type { VideoItem } from '../types/portfolio';
import { buildYouTubeEmbedUrl } from '../utils/portfolioLogic';

interface VideoLightboxProps {
  video: VideoItem | null;
  onClose: () => void;
  hideExternalYoutubeLink?: boolean;
}

export function VideoLightbox({
  video,
  onClose,
  hideExternalYoutubeLink = false,
}: VideoLightboxProps) {
  useEffect(() => {
    if (!video) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [video, onClose]);

  if (!video) return null;

  const isVertical = video.aspect === '9:16';
  const embedSrc = buildYouTubeEmbedUrl(video.youtubeId, {
    autoplay: true,
    hideBranding: hideExternalYoutubeLink,
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Playing ${video.title}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className={`relative flex w-full flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#090A10] shadow-2xl ${
          isVertical ? 'max-w-[420px]' : 'max-w-[980px]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3.5">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-white">{video.title}</h3>
            <p className="mt-0.5 text-xs text-zinc-400">
              {video.category} <span aria-hidden="true">·</span> {video.clientTag}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {!hideExternalYoutubeLink && (
              <a
                href={video.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                <span>YouTube</span>
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close video player"
              className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-white/15 text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          className={`relative w-full bg-black ${
            isVertical ? 'aspect-[9/16] max-h-[76vh]' : 'aspect-video'
          }`}
        >
          <iframe
            src={embedSrc}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full border-0"
          />
        </div>
      </div>
    </div>
  );
}

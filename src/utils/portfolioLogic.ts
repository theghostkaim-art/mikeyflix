import type {
  ClientShowcaseLink,
  PortfolioData,
  PortfolioTheme,
  ThemeOverride,
  VideoAspect,
} from '../types/portfolio';

export function extractYouTubeId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Direct 11-character video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const normalized = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
    const url = new URL(normalized);
    const host = url.hostname.replace(/^www\./, '').toLowerCase();

    if (host === 'youtu.be') {
      const candidate = url.pathname.split('/').filter(Boolean)[0];
      return candidate && /^[a-zA-Z0-9_-]{11}$/.test(candidate) ? candidate : null;
    }

    if (
      host === 'youtube.com' ||
      host === 'm.youtube.com' ||
      host === 'youtube-nocookie.com'
    ) {
      const vParam = url.searchParams.get('v');
      if (vParam && /^[a-zA-Z0-9_-]{11}$/.test(vParam)) {
        return vParam;
      }

      const parts = url.pathname.split('/').filter(Boolean);
      if (
        parts.length >= 2 &&
        (parts[0] === 'shorts' || parts[0] === 'embed' || parts[0] === 'live')
      ) {
        const id = parts[1];
        return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function detectVideoAspect(url: string): VideoAspect {
  return /\/shorts\//i.test(url) ? '9:16' : '16:9';
}

export function buildYouTubeEmbedUrl(
  videoId: string,
  options?: { autoplay?: boolean; hideBranding?: boolean }
): string {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: options?.hideBranding ? '1' : '0',
    playsinline: '1',
    enablejsapi: '0',
  });
  if (options?.autoplay) {
    params.set('autoplay', '1');
  }
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?${params.toString()}`;
}

export function buildYouTubeThumbnailUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/hqdefault.jpg`;
}

export function slugifyClientName(input: string, suffix?: string): string {
  const cleaned = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  const base = cleaned || 'client-showcase';
  if (suffix) {
    const cleanSuffix = suffix.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 12);
    return cleanSuffix ? `${base}-${cleanSuffix}` : base;
  }
  return base;
}

export function buildShareLinkUrl(origin: string, slug: string): string {
  const cleanOrigin = origin.replace(/\/+$/, '');
  return `${cleanOrigin}/?share=${encodeURIComponent(slug)}`;
}

export function resolveActiveTheme(
  baseTheme: PortfolioTheme,
  override?: ThemeOverride
): PortfolioTheme {
  if (!override) return baseTheme;
  return {
    ...baseTheme,
    bgColor: override.bgColor || baseTheme.bgColor,
    accentColor: override.accentColor || baseTheme.accentColor,
    displayFont: override.displayFont || baseTheme.displayFont,
    bodyFont: override.bodyFont || baseTheme.bodyFont,
  };
}

export function validatePortfolioForSave(data: PortfolioData): string[] {
  const errors: string[] = [];
  if (!data.brandName.trim() || data.brandName.trim().length > 80) {
    errors.push('Brand name must be between 1 and 80 characters.');
  }
  if (!data.tagline.trim() || data.tagline.trim().length > 140) {
    errors.push('Tagline must be between 1 and 140 characters.');
  }
  if (data.manifestoQuote.length > 800) {
    errors.push('Manifesto quote must be 800 characters or fewer.');
  }
  if (data.videos.length > 40) {
    errors.push('Maximum 40 videos allowed.');
  }
  if (data.theme.fontScale < 0.75 || data.theme.fontScale > 1.35) {
    errors.push('Font scale must be between 0.75 and 1.35.');
  }
  return errors;
}

export function validateClientLinkDraft(
  draft: Pick<ClientShowcaseLink, 'slug' | 'clientName' | 'projectTitle' | 'videos'>
): string[] {
  const errors: string[] = [];
  if (!/^[a-zA-Z0-9_-]{2,80}$/.test(draft.slug)) {
    errors.push('Share link slug must be 2–80 characters (letters, numbers, hyphens, underscores).');
  }
  if (!draft.clientName.trim() || draft.clientName.trim().length > 120) {
    errors.push('Client name is required (max 120 characters).');
  }
  if (!draft.projectTitle.trim() || draft.projectTitle.trim().length > 160) {
    errors.push('Project title is required (max 160 characters).');
  }
  if (draft.videos.length === 0) {
    errors.push('Select or add at least 1 video for the client showcase.');
  }
  if (draft.videos.length > 30) {
    errors.push('Maximum 30 videos allowed per client showcase.');
  }
  return errors;
}

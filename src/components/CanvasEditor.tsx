import { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Check,
  Copy,
  ExternalLink,
  Film,
  Link2,
  LogIn,
  LogOut,
  Monitor,
  Palette,
  Plus,
  RotateCcw,
  Save,
  Smartphone,
  Trash2,
  Type,
  FileEdit,
  X,
} from 'lucide-react';
import type { User } from 'firebase/auth';
import { COLOR_PRESETS, DEFAULT_PORTFOLIO, FONT_OPTIONS } from '../data/defaultPortfolio';
import { ADMIN_EMAIL } from '../firebase';
import type {
  CanvasEditorTab,
  ClientShowcaseLink,
  PortfolioData,
  VideoAspect,
  VideoItem,
} from '../types/portfolio';
import {
  buildShareLinkUrl,
  detectVideoAspect,
  extractYouTubeId,
  slugifyClientName,
} from '../utils/portfolioLogic';
import { AboutSection } from './AboutSection';
import { ContactAndAgreementSection } from './ContactAndAgreementSection';
import { HeroSection } from './HeroSection';
import { ServicesSection } from './ServicesSection';
import { TopNav } from './TopNav';
import { WorkspaceSection } from './WorkspaceSection';

interface CanvasEditorProps {
  portfolio: PortfolioData;
  onChangePortfolio: (next: PortfolioData) => void;
  onSaveToCloud: () => Promise<void>;
  onResetDefault: () => void;
  onClose: () => void;
  initialTab: CanvasEditorTab;
  user: User | null;
  onSignIn: () => Promise<void>;
  onSignOut: () => Promise<void>;
  clientLinks: ClientShowcaseLink[];
  onCreateClientLink: (link: ClientShowcaseLink) => Promise<void>;
  onDeleteClientLink: (slug: string) => Promise<void>;
  onToggleClientLinkActive: (link: ClientShowcaseLink) => Promise<void>;
  onPreviewClientLink: (slug: string) => void;
  onPlayVideo: (video: VideoItem) => void;
  isSaving: boolean;
  saveStatusMessage: string | null;
  saveErrorMessage: string | null;
}

export function CanvasEditor({
  portfolio,
  onChangePortfolio,
  onSaveToCloud,
  onResetDefault,
  onClose,
  initialTab,
  user,
  onSignIn,
  onSignOut,
  clientLinks,
  onCreateClientLink,
  onDeleteClientLink,
  onToggleClientLinkActive,
  onPreviewClientLink,
  onPlayVideo,
  isSaving,
  saveStatusMessage,
  saveErrorMessage,
}: CanvasEditorProps) {
  const [activeTab, setActiveTab] = useState<CanvasEditorTab>(initialTab);
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop');
  const [selectedPlanId, setSelectedPlanId] = useState(
    portfolio.services[2]?.id || portfolio.services[0]?.id || 'plan-premium'
  );

  // Add video form state
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoCategory, setNewVideoCategory] = useState('Commercial');
  const [newVideoClientTag, setNewVideoClientTag] = useState('Client Cut');
  const [newVideoAspect, setNewVideoAspect] = useState<VideoAspect>('16:9');
  const [newVideoUnlisted, setNewVideoUnlisted] = useState(false);
  const [videoFormError, setVideoFormError] = useState<string | null>(null);

  // Client Link builder state
  const [clientName, setClientName] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [welcomeNote, setWelcomeNote] = useState(
    'Prepared exclusively for your review by MikeyFlix Studios.'
  );
  const [hideYoutubeLinks, setHideYoutubeLinks] = useState(true);
  const [showFullPortfolio, setShowFullPortfolio] = useState(false);
  const [selectedVideoIds, setSelectedVideoIds] = useState<string[]>(
    portfolio.videos.slice(0, 2).map((v) => v.id)
  );
  const [unlistedYtUrl, setUnlistedYtUrl] = useState('');
  const [unlistedYtTitle, setUnlistedYtTitle] = useState('');
  const [clientAccentOverride, setClientAccentOverride] = useState('');
  const [clientLinkError, setClientLinkError] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const isOwner = Boolean(user && user.email === ADMIN_EMAIL);

  const updateTheme = (patch: Partial<PortfolioData['theme']>) => {
    onChangePortfolio({
      ...portfolio,
      theme: { ...portfolio.theme, ...patch },
    });
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    setVideoFormError(null);
    const ytId = extractYouTubeId(newVideoUrl);
    if (!ytId) {
      setVideoFormError('Enter a valid YouTube, Shorts, or Unlisted YouTube URL.');
      return;
    }
    const title = newVideoTitle.trim() || `Studio Cut (${ytId})`;
    const item: VideoItem = {
      id: `vid-${Date.now().toString(36)}`,
      title,
      youtubeUrl: newVideoUrl.trim(),
      youtubeId: ytId,
      aspect: newVideoAspect,
      category: newVideoCategory.trim() || 'Showreel',
      clientTag: newVideoClientTag.trim() || 'Studio Cut',
      isUnlisted: newVideoUnlisted,
    };
    onChangePortfolio({
      ...portfolio,
      videos: [item, ...portfolio.videos],
    });
    setNewVideoUrl('');
    setNewVideoTitle('');
    setNewVideoUnlisted(false);
  };

  const handleRemoveVideo = (videoId: string) => {
    onChangePortfolio({
      ...portfolio,
      videos: portfolio.videos.filter((v) => v.id !== videoId),
    });
  };

  const handleMoveVideo = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= portfolio.videos.length) return;
    const copy = [...portfolio.videos];
    const [moved] = copy.splice(index, 1);
    copy.splice(target, 0, moved);
    onChangePortfolio({ ...portfolio, videos: copy });
  };

  const handleCreateClientLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientLinkError(null);

    if (!clientName.trim()) {
      setClientLinkError('Please enter a client name.');
      return;
    }

    const pickedVideos = portfolio.videos.filter((v) => selectedVideoIds.includes(v.id));
    const linkVideos = [...pickedVideos];

    if (unlistedYtUrl.trim()) {
      const ytId = extractYouTubeId(unlistedYtUrl);
      if (!ytId) {
        setClientLinkError('The unlisted YouTube URL is invalid.');
        return;
      }
      linkVideos.unshift({
        id: `unlisted-${Date.now().toString(36)}`,
        title: unlistedYtTitle.trim() || `${clientName.trim()} — Private Cut`,
        youtubeUrl: unlistedYtUrl.trim(),
        youtubeId: ytId,
        aspect: detectVideoAspect(unlistedYtUrl),
        category: 'Private Pitch',
        clientTag: clientName.trim(),
        isUnlisted: true,
      });
    }

    if (linkVideos.length === 0) {
      setClientLinkError('Select at least 1 video or paste an unlisted YouTube URL.');
      return;
    }

    const randomSuffix = Math.random().toString(36).slice(2, 6);
    const finalSlug = slugifyClientName(
      customSlug.trim() || clientName,
      customSlug.trim() ? undefined : randomSuffix
    );

    const draft: ClientShowcaseLink = {
      id: finalSlug,
      ownerId: user?.uid || 'local-preview',
      slug: finalSlug,
      clientName: clientName.trim(),
      projectTitle: projectTitle.trim() || `${clientName.trim()} — Video Showcase`,
      welcomeNote: welcomeNote.trim(),
      hideYoutubeLinks,
      showFullPortfolio,
      themeOverride: clientAccentOverride ? { accentColor: clientAccentOverride } : {},
      videos: linkVideos,
      active: true,
    };

    try {
      await onCreateClientLink(draft);
      setClientName('');
      setProjectTitle('');
      setCustomSlug('');
      setUnlistedYtUrl('');
      setUnlistedYtTitle('');
      setClientAccentOverride('');
    } catch (err) {
      setClientLinkError(err instanceof Error ? err.message : 'Failed to create client link.');
    }
  };

  const copyShareUrl = async (slug: string) => {
    const shareUrl = buildShareLinkUrl(window.location.origin, slug);
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    } catch {
      setCopiedSlug(slug);
    }
  };

  return (
    <div
      data-testid="canvas-editor"
      className="fixed inset-0 z-50 flex flex-col bg-[#06060A] text-zinc-100"
    >
      {/* Studio Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#0B0C14] px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold tracking-[0.14em] text-white">
            CANVAS STUDIO
          </span>
          <span className="text-xs text-zinc-400">
            Click any section on the canvas to edit
          </span>
        </div>

        {/* Viewport Toggle */}
        <div className="hidden items-center gap-1 rounded-lg border border-white/10 bg-[#06060A] p-1 md:flex">
          <button
            type="button"
            onClick={() => setViewportMode('desktop')}
            className={`inline-flex min-h-[34px] cursor-pointer items-center gap-1.5 rounded-md px-3 text-xs font-medium ${
              viewportMode === 'desktop'
                ? 'bg-white/15 text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Monitor className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setViewportMode('mobile')}
            className={`inline-flex min-h-[34px] cursor-pointer items-center gap-1.5 rounded-md px-3 text-xs font-medium ${
              viewportMode === 'mobile'
                ? 'bg-white/15 text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Mobile</span>
          </button>
        </div>

        {/* Auth + Publish + Close */}
        <div className="flex flex-wrap items-center gap-2">
          {saveStatusMessage && (
            <span className="text-xs font-medium text-emerald-400">
              {saveStatusMessage}
            </span>
          )}
          {saveErrorMessage && (
            <span className="text-xs font-medium text-red-400">{saveErrorMessage}</span>
          )}

          {!user ? (
            <button
              type="button"
              onClick={() => void onSignIn()}
              className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10"
            >
              <LogIn className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Sign in to Publish</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="hidden text-xs text-zinc-400 sm:inline">
                {user.email} {isOwner ? '· Owner' : '· Read-only'}
              </span>
              <button
                type="button"
                onClick={() => void onSignOut()}
                aria-label="Sign out"
                className="inline-flex min-h-[38px] cursor-pointer items-center gap-1 rounded-lg border border-white/15 px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-white/10"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onResetDefault}
            title="Reset draft to MikeyFlix defaults"
            className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-white/10"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            type="button"
            data-testid="publish-canvas-btn"
            disabled={isSaving}
            onClick={() => void onSaveToCloud()}
            className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold text-white transition-opacity disabled:opacity-50"
            style={{ backgroundColor: portfolio.theme.accentColor }}
          >
            <Save className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{isSaving ? 'Publishing...' : 'Save & Publish'}</span>
          </button>

          <button
            type="button"
            data-testid="close-canvas-editor"
            onClick={onClose}
            aria-label="Exit Canvas Editor"
            className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-lg border border-white/20 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            <span>Exit</span>
          </button>
        </div>
      </div>

      {/* Main Split: Left Inspector + Center Live Canvas */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Left Navigation Rail + Inspector Drawer */}
        <aside className="flex w-full shrink-0 flex-col border-b border-white/10 bg-[#0B0C14] lg:w-[400px] lg:border-b-0 lg:border-r">
          {/* Inspector Tabs */}
          <div
            role="tablist"
            aria-label="Canvas Editor Tools"
            className="grid grid-cols-5 border-b border-white/10 bg-[#080910]"
          >
            {(
              [
                { id: 'theme', label: 'Colors', Icon: Palette },
                { id: 'typography', label: 'Fonts', Icon: Type },
                { id: 'videos', label: 'Videos', Icon: Film },
                { id: 'copy', label: 'Copy', Icon: FileEdit },
                { id: 'client-links', label: 'Links', Icon: Link2 },
              ] as const
            ).map(({ id, label, Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(id)}
                  className={`flex min-h-[52px] cursor-pointer flex-col items-center justify-center gap-1 border-b-2 px-2 py-2 text-[11px] font-medium transition-colors ${
                    active
                      ? 'border-white bg-white/5 text-white'
                      : 'border-transparent text-zinc-400 hover:text-white'
                  }`}
                  style={active ? { borderBottomColor: portfolio.theme.accentColor } : undefined}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Inspector Scroll Body */}
          <div className="flex-1 overflow-y-auto p-5">
            {/* TAB 1: THEME & COLORS */}
            {activeTab === 'theme' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                    Studio Presets
                  </h3>
                  <div className="mt-3 grid grid-cols-1 gap-2">
                    {COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() =>
                          updateTheme({
                            bgColor: preset.bgColor,
                            surfaceColor: preset.surfaceColor,
                            accentColor: preset.accentColor,
                            secondaryAccent: preset.secondaryAccent,
                            textColor: preset.textColor,
                            heroBgColor: preset.heroBgColor,
                          })
                        }
                        className="flex min-h-[44px] cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-left text-xs font-medium text-zinc-200 hover:border-white/25 hover:text-white"
                      >
                        <span>{preset.name}</span>
                        <span className="flex items-center gap-1.5">
                          <span
                            className="h-4 w-4 rounded-full border border-white/20"
                            style={{ backgroundColor: preset.heroBgColor }}
                          />
                          <span
                            className="h-4 w-4 rounded-full border border-white/20"
                            style={{ backgroundColor: preset.accentColor }}
                          />
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-5">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                    Custom Canvas Colors
                  </h3>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {(
                      [
                        { key: 'bgColor', label: 'Page Background' },
                        { key: 'surfaceColor', label: 'Card Surface' },
                        { key: 'heroBgColor', label: 'Hero Backdrop' },
                        { key: 'accentColor', label: 'Primary Accent' },
                        { key: 'secondaryAccent', label: 'Hero Glow' },
                        { key: 'textColor', label: 'Body Text' },
                      ] as const
                    ).map(({ key, label }) => (
                      <label
                        key={key}
                        className="flex flex-col gap-1.5 rounded-xl border border-white/10 bg-[#06060A] p-3 text-xs"
                      >
                        <span className="text-zinc-400">{label}</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={portfolio.theme[key]}
                            onChange={(e) => updateTheme({ [key]: e.target.value })}
                            className="h-8 w-10 cursor-pointer rounded border border-white/20 bg-transparent"
                          />
                          <span className="font-mono text-[11px] uppercase text-zinc-200">
                            {portfolio.theme[key]}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: TYPOGRAPHY */}
            {activeTab === 'typography' && (
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="display-font-select"
                    className="block text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400"
                  >
                    Display &amp; Heading Font
                  </label>
                  <select
                    id="display-font-select"
                    value={portfolio.theme.displayFont}
                    onChange={(e) => updateTheme({ displayFont: e.target.value })}
                    className="mt-2 min-h-[42px] w-full rounded-xl border border-white/15 bg-[#06060A] px-3 text-sm text-white focus:border-white/40 focus:outline-none"
                  >
                    {FONT_OPTIONS.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.label} ({font.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="body-font-select"
                    className="block text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400"
                  >
                    Body &amp; UI Font
                  </label>
                  <select
                    id="body-font-select"
                    value={portfolio.theme.bodyFont}
                    onChange={(e) => updateTheme({ bodyFont: e.target.value })}
                    className="mt-2 min-h-[42px] w-full rounded-xl border border-white/15 bg-[#06060A] px-3 text-sm text-white focus:border-white/40 focus:outline-none"
                  >
                    {FONT_OPTIONS.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.label} ({font.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs">
                    <label
                      htmlFor="font-scale-range"
                      className="font-semibold uppercase tracking-[0.16em] text-zinc-400"
                    >
                      Headline Scale
                    </label>
                    <span className="tabular-nums font-mono text-zinc-200">
                      {Math.round(portfolio.theme.fontScale * 100)}%
                    </span>
                  </div>
                  <input
                    id="font-scale-range"
                    type="range"
                    min={0.8}
                    max={1.25}
                    step={0.05}
                    value={portfolio.theme.fontScale}
                    onChange={(e) =>
                      updateTheme({ fontScale: Number.parseFloat(e.target.value) })
                    }
                    className="mt-3 w-full accent-purple-500"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: VIDEO MANAGER */}
            {activeTab === 'videos' && (
              <div className="space-y-6">
                <form
                  onSubmit={handleAddVideo}
                  className="space-y-3 rounded-xl border border-white/10 bg-[#06060A] p-4"
                >
                  <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-300">
                    Add YouTube / Unlisted Video
                  </h3>

                  <div>
                    <label htmlFor="add-yt-url" className="block text-xs text-zinc-400">
                      YouTube Video or Shorts URL
                    </label>
                    <input
                      id="add-yt-url"
                      type="text"
                      value={newVideoUrl}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNewVideoUrl(val);
                        setNewVideoAspect(detectVideoAspect(val));
                      }}
                      placeholder="https://www.youtube.com/watch?v=... or /shorts/..."
                      className="mt-1 min-h-[40px] w-full rounded-lg border border-white/15 bg-[#0B0C14] px-3 text-xs text-white focus:border-white/40 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="add-yt-title" className="block text-xs text-zinc-400">
                      Video Title
                    </label>
                    <input
                      id="add-yt-title"
                      type="text"
                      value={newVideoTitle}
                      onChange={(e) => setNewVideoTitle(e.target.value)}
                      placeholder="e.g. Real Estate Launch Reel"
                      className="mt-1 min-h-[40px] w-full rounded-lg border border-white/15 bg-[#0B0C14] px-3 text-xs text-white focus:border-white/40 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="add-yt-cat" className="block text-xs text-zinc-400">
                        Category
                      </label>
                      <input
                        id="add-yt-cat"
                        type="text"
                        value={newVideoCategory}
                        onChange={(e) => setNewVideoCategory(e.target.value)}
                        className="mt-1 min-h-[38px] w-full rounded-lg border border-white/15 bg-[#0B0C14] px-2.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="add-yt-aspect" className="block text-xs text-zinc-400">
                        Format
                      </label>
                      <select
                        id="add-yt-aspect"
                        value={newVideoAspect}
                        onChange={(e) => setNewVideoAspect(e.target.value as VideoAspect)}
                        className="mt-1 min-h-[38px] w-full rounded-lg border border-white/15 bg-[#0B0C14] px-2.5 text-xs text-white focus:outline-none"
                      >
                        <option value="16:9">16:9 Landscape</option>
                        <option value="9:16">9:16 Vertical Reel</option>
                      </select>
                    </div>
                  </div>

                  <label className="flex cursor-pointer items-center gap-2 pt-1 text-xs text-zinc-300">
                    <input
                      type="checkbox"
                      checked={newVideoUnlisted}
                      onChange={(e) => setNewVideoUnlisted(e.target.checked)}
                      className="h-4 w-4 accent-purple-500"
                    />
                    <span>Mark as Unlisted / Client Cut</span>
                  </label>

                  {videoFormError && (
                    <p className="text-xs text-red-400">{videoFormError}</p>
                  )}

                  <button
                    type="submit"
                    className="inline-flex min-h-[40px] w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-white"
                    style={{ backgroundColor: portfolio.theme.accentColor }}
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    <span>Add Video to Canvas</span>
                  </button>
                </form>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                    Portfolio Videos ({portfolio.videos.length})
                  </h3>
                  <div className="mt-3 space-y-2">
                    {portfolio.videos.map((vid, idx) => (
                      <div
                        key={vid.id}
                        className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-[#06060A] p-3"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-xs font-medium text-white">
                            {vid.title}
                          </div>
                          <div className="mt-0.5 text-[11px] text-zinc-400">
                            {vid.aspect} · {vid.category}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleMoveVideo(idx, -1)}
                            disabled={idx === 0}
                            aria-label={`Move ${vid.title} up`}
                            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-white/10 text-zinc-300 hover:bg-white/10 disabled:opacity-30"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveVideo(idx, 1)}
                            disabled={idx === portfolio.videos.length - 1}
                            aria-label={`Move ${vid.title} down`}
                            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-white/10 text-zinc-300 hover:bg-white/10 disabled:opacity-30"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveVideo(vid.id)}
                            aria-label={`Remove ${vid.title}`}
                            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-red-400/20 text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: COPY & SECTIONS */}
            {activeTab === 'copy' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-brand" className="block text-xs text-zinc-400">
                    Studio Brand Name
                  </label>
                  <input
                    id="edit-brand"
                    type="text"
                    value={portfolio.brandName}
                    onChange={(e) =>
                      onChangePortfolio({ ...portfolio, brandName: e.target.value })
                    }
                    className="mt-1 min-h-[40px] w-full rounded-lg border border-white/15 bg-[#06060A] px-3 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="edit-tagline" className="block text-xs text-zinc-400">
                    Hero Tagline
                  </label>
                  <input
                    id="edit-tagline"
                    type="text"
                    value={portfolio.tagline}
                    onChange={(e) =>
                      onChangePortfolio({ ...portfolio, tagline: e.target.value })
                    }
                    className="mt-1 min-h-[40px] w-full rounded-lg border border-white/15 bg-[#06060A] px-3 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="edit-quote" className="block text-xs text-zinc-400">
                    Workspace Manifesto Quote
                  </label>
                  <textarea
                    id="edit-quote"
                    rows={4}
                    value={portfolio.manifestoQuote}
                    onChange={(e) =>
                      onChangePortfolio({ ...portfolio, manifestoQuote: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-white/15 bg-[#06060A] p-3 text-xs leading-relaxed text-white focus:outline-none"
                  />
                </div>

                <div className="border-t border-white/10 pt-4">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">
                    Contact Channels
                  </h4>
                  <div className="mt-3 space-y-3">
                    <div>
                      <label htmlFor="edit-wa" className="block text-xs text-zinc-400">
                        WhatsApp Link
                      </label>
                      <input
                        id="edit-wa"
                        type="text"
                        value={portfolio.contact.whatsappUrl}
                        onChange={(e) =>
                          onChangePortfolio({
                            ...portfolio,
                            contact: { ...portfolio.contact, whatsappUrl: e.target.value },
                          })
                        }
                        className="mt-1 min-h-[38px] w-full rounded-lg border border-white/15 bg-[#06060A] px-3 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="edit-email" className="block text-xs text-zinc-400">
                        Contact Email
                      </label>
                      <input
                        id="edit-email"
                        type="email"
                        value={portfolio.contact.emailAddress}
                        onChange={(e) =>
                          onChangePortfolio({
                            ...portfolio,
                            contact: { ...portfolio.contact, emailAddress: e.target.value },
                          })
                        }
                        className="mt-1 min-h-[38px] w-full rounded-lg border border-white/15 bg-[#06060A] px-3 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="edit-phone" className="block text-xs text-zinc-400">
                        Phone Number
                      </label>
                      <input
                        id="edit-phone"
                        type="text"
                        value={portfolio.contact.phoneNumber}
                        onChange={(e) =>
                          onChangePortfolio({
                            ...portfolio,
                            contact: { ...portfolio.contact, phoneNumber: e.target.value },
                          })
                        }
                        className="mt-1 min-h-[38px] w-full rounded-lg border border-white/15 bg-[#06060A] px-3 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">
                    Service Plan Pricing
                  </h4>
                  <div className="mt-3 space-y-2.5">
                    {portfolio.services.map((plan, idx) => (
                      <div key={plan.id} className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          aria-label={`Plan ${idx + 1} name`}
                          value={plan.name}
                          onChange={(e) => {
                            const updated = portfolio.services.map((s, i) =>
                              i === idx ? { ...s, name: e.target.value } : s
                            );
                            onChangePortfolio({ ...portfolio, services: updated });
                          }}
                          className="min-h-[36px] rounded-lg border border-white/15 bg-[#06060A] px-2.5 text-xs text-white focus:outline-none"
                        />
                        <input
                          type="text"
                          aria-label={`Plan ${idx + 1} price`}
                          value={plan.price}
                          onChange={(e) => {
                            const updated = portfolio.services.map((s, i) =>
                              i === idx ? { ...s, price: e.target.value } : s
                            );
                            onChangePortfolio({ ...portfolio, services: updated });
                          }}
                          className="min-h-[36px] rounded-lg border border-white/15 bg-[#06060A] px-2.5 text-xs text-white focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: UNLISTED CLIENT SHOWCASE LINKS */}
            {activeTab === 'client-links' && (
              <div className="space-y-6">
                <form
                  onSubmit={handleCreateClientLinkSubmit}
                  className="space-y-3 rounded-xl border border-white/10 bg-[#06060A] p-4"
                >
                  <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-200">
                    Create Unlisted Client Link
                  </h3>
                  <p className="text-[11px] leading-relaxed text-zinc-400">
                    Paste your unlisted YouTube link or select studio cuts to generate a private URL for your client.
                  </p>

                  <div>
                    <label htmlFor="cl-name" className="block text-xs text-zinc-400">
                      Client Name
                    </label>
                    <input
                      id="cl-name"
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Zomato Brand Pitch"
                      className="mt-1 min-h-[38px] w-full rounded-lg border border-white/15 bg-[#0B0C14] px-3 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="cl-title" className="block text-xs text-zinc-400">
                        Showcase Heading
                      </label>
                      <input
                        id="cl-title"
                        type="text"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        placeholder="Campaign Preview"
                        className="mt-1 min-h-[38px] w-full rounded-lg border border-white/15 bg-[#0B0C14] px-2.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="cl-slug" className="block text-xs text-zinc-400">
                        Custom Slug (Optional)
                      </label>
                      <input
                        id="cl-slug"
                        type="text"
                        value={customSlug}
                        onChange={(e) => setCustomSlug(e.target.value)}
                        placeholder="auto-generated"
                        className="mt-1 min-h-[38px] w-full rounded-lg border border-white/15 bg-[#0B0C14] px-2.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="cl-yt-url" className="block text-xs text-zinc-400">
                      Add Unlisted YouTube Link (Optional)
                    </label>
                    <input
                      id="cl-yt-url"
                      type="text"
                      value={unlistedYtUrl}
                      onChange={(e) => setUnlistedYtUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="mt-1 min-h-[38px] w-full rounded-lg border border-white/15 bg-[#0B0C14] px-3 text-xs text-white focus:outline-none"
                    />
                  </div>

                  {unlistedYtUrl.trim() && (
                    <div>
                      <label htmlFor="cl-yt-title" className="block text-xs text-zinc-400">
                        Unlisted Video Title
                      </label>
                      <input
                        id="cl-yt-title"
                        type="text"
                        value={unlistedYtTitle}
                        onChange={(e) => setUnlistedYtTitle(e.target.value)}
                        placeholder="Final Cut V1 — Client Review"
                        className="mt-1 min-h-[38px] w-full rounded-lg border border-white/15 bg-[#0B0C14] px-3 text-xs text-white focus:outline-none"
                      />
                    </div>
                  )}

                  <div>
                    <span className="block text-xs text-zinc-400">
                      Include Studio Library Videos
                    </span>
                    <div className="mt-1.5 max-h-32 space-y-1.5 overflow-y-auto rounded-lg border border-white/10 bg-[#0B0C14] p-2">
                      {portfolio.videos.map((v) => {
                        const checked = selectedVideoIds.includes(v.id);
                        return (
                          <label
                            key={v.id}
                            className="flex cursor-pointer items-center gap-2 text-xs text-zinc-300"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedVideoIds((prev) => [...prev, v.id]);
                                } else {
                                  setSelectedVideoIds((prev) =>
                                    prev.filter((id) => id !== v.id)
                                  );
                                }
                              }}
                              className="h-3.5 w-3.5 accent-purple-500"
                            />
                            <span className="truncate">{v.title}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="cl-note" className="block text-xs text-zinc-400">
                      Welcome Note for Client
                    </label>
                    <textarea
                      id="cl-note"
                      rows={2}
                      value={welcomeNote}
                      onChange={(e) => setWelcomeNote(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-white/15 bg-[#0B0C14] p-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-2 pt-1 text-xs text-zinc-300">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={hideYoutubeLinks}
                        onChange={(e) => setHideYoutubeLinks(e.target.checked)}
                        className="h-4 w-4 accent-purple-500"
                      />
                      <span>Hide external YouTube links from client</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={showFullPortfolio}
                        onChange={(e) => setShowFullPortfolio(e.target.checked)}
                        className="h-4 w-4 accent-purple-500"
                      />
                      <span>Show full studio portfolio below showcase</span>
                    </label>
                  </div>

                  <label className="flex items-center justify-between gap-2 text-xs text-zinc-400">
                    <span>Custom Client Accent (Optional)</span>
                    <input
                      type="color"
                      value={clientAccentOverride || portfolio.theme.accentColor}
                      onChange={(e) => setClientAccentOverride(e.target.value)}
                      className="h-7 w-10 cursor-pointer rounded border border-white/20 bg-transparent"
                    />
                  </label>

                  {clientLinkError && (
                    <p className="text-xs text-red-400">{clientLinkError}</p>
                  )}

                  <button
                    type="submit"
                    className="inline-flex min-h-[40px] w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-white"
                    style={{ backgroundColor: portfolio.theme.accentColor }}
                  >
                    <Link2 className="h-4 w-4" aria-hidden="true" />
                    <span>Generate Unlisted Client Link</span>
                  </button>
                </form>

                {/* Existing Client Links */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                    Active Client Links ({clientLinks.length})
                  </h3>
                  {clientLinks.length === 0 ? (
                    <p className="mt-2 text-xs text-zinc-500">
                      No custom client links yet. Create one above to share privately.
                    </p>
                  ) : (
                    <div className="mt-3 space-y-2.5">
                      {clientLinks.map((link) => (
                        <div
                          key={link.slug}
                          className="rounded-xl border border-white/10 bg-[#06060A] p-3.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="truncate text-xs font-semibold text-white">
                                {link.clientName}
                              </div>
                              <div className="mt-0.5 truncate font-mono text-[11px] text-zinc-400">
                                ?share={link.slug} · {link.videos.length} video(s)
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => void onToggleClientLinkActive(link)}
                              className={`shrink-0 cursor-pointer rounded-md px-2 py-1 text-[11px] font-medium ${
                                link.active
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-zinc-800 text-zinc-400'
                              }`}
                            >
                              {link.active ? 'Active' : 'Paused'}
                            </button>
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => void copyShareUrl(link.slug)}
                              className="inline-flex min-h-[34px] cursor-pointer items-center gap-1.5 rounded-lg border border-white/15 px-2.5 py-1 text-[11px] font-medium text-zinc-200 hover:bg-white/10"
                            >
                              {copiedSlug === link.slug ? (
                                <>
                                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                                  <span>Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3.5 w-3.5" />
                                  <span>Copy Link</span>
                                </>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => onPreviewClientLink(link.slug)}
                              className="inline-flex min-h-[34px] cursor-pointer items-center gap-1.5 rounded-lg border border-white/15 px-2.5 py-1 text-[11px] font-medium text-zinc-200 hover:bg-white/10"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              <span>Preview</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => void onDeleteClientLink(link.slug)}
                              aria-label={`Delete link for ${link.clientName}`}
                              className="ml-auto inline-flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-lg border border-red-400/20 text-red-400 hover:bg-red-500/20"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Center Live Interactive Canvas Stage */}
        <div className="flex-1 overflow-y-auto bg-[#030306] p-4 sm:p-6">
          <div
            className={`mx-auto overflow-hidden rounded-2xl border border-white/15 shadow-2xl transition-all duration-200 ${
              viewportMode === 'mobile' ? 'max-w-[390px]' : 'w-full max-w-[1440px]'
            }`}
            style={{
              backgroundColor: portfolio.theme.bgColor,
              color: portfolio.theme.textColor,
              fontFamily: portfolio.theme.bodyFont,
            }}
          >
            <TopNav brandName={portfolio.brandName} theme={portfolio.theme} />
            <HeroSection
              data={portfolio}
              isCanvasMode
              onSelectSection={() => setActiveTab('copy')}
            />
            <WorkspaceSection
              manifestoQuote={portfolio.manifestoQuote}
              videos={portfolio.videos}
              theme={portfolio.theme}
              onPlayVideo={onPlayVideo}
              isCanvasMode
              onRemoveVideo={handleRemoveVideo}
              onSelectSection={() => setActiveTab('videos')}
            />
            <AboutSection
              about={portfolio.about}
              brandName={portfolio.brandName}
              theme={portfolio.theme}
              isCanvasMode
              onSelectSection={() => setActiveTab('copy')}
            />
            <ServicesSection
              services={portfolio.services}
              theme={portfolio.theme}
              onSelectPlan={setSelectedPlanId}
              isCanvasMode
              onSelectSection={() => setActiveTab('theme')}
            />
            <ContactAndAgreementSection
              brandName={portfolio.brandName}
              contact={portfolio.contact}
              agreement={portfolio.agreement}
              services={portfolio.services}
              selectedPlanId={selectedPlanId}
              onSelectPlan={setSelectedPlanId}
              theme={portfolio.theme}
              isCanvasMode
              onSelectSection={() => setActiveTab('copy')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import { AboutSection } from './components/AboutSection';
import { CanvasEditor } from './components/CanvasEditor';
import { ClientScreeningView } from './components/ClientScreeningView';
import { ContactAndAgreementSection } from './components/ContactAndAgreementSection';
import { EditBar } from './components/EditBar';
import { ErrorBoundary } from './components/ErrorBoundary';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ServicesSection';
import { TopNav } from './components/TopNav';
import { VideoLightbox } from './components/VideoLightbox';
import { WorkspaceSection } from './components/WorkspaceSection';
import { DEFAULT_PORTFOLIO } from './data/defaultPortfolio';
import { ADMIN_EMAIL, auth, googleProvider } from './firebase';
import {
  deleteClientShowcaseLink,
  fetchClientShowcaseLink,
  fetchPublishedPortfolio,
  getLocalClientLinks,
  listOwnerClientLinks,
  saveClientShowcaseLink,
  saveLocalClientLinks,
  savePublishedPortfolio,
} from './services/portfolioService';
import type {
  CanvasEditorTab,
  ClientShowcaseLink,
  PortfolioData,
  VideoItem,
} from './types/portfolio';

const LOCAL_DRAFT_STORAGE_KEY = 'mikeyflix_studio_draft_v1';

function StudioApp() {
  const [portfolio, setPortfolio] = useState<PortfolioData>(DEFAULT_PORTFOLIO);
  const [publishedSnapshot, setPublishedSnapshot] =
    useState<PortfolioData>(DEFAULT_PORTFOLIO);
  const [user, setUser] = useState<User | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorTab, setEditorTab] = useState<CanvasEditorTab>('theme');
  const [activeVideo, setActiveVideo] = useState<{
    video: VideoItem;
    hideYoutube: boolean;
  } | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState('plan-premium');

  // Client Share Link mode (?share=slug)
  const [shareSlug, setShareSlug] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('share');
  });
  const [activeShowcase, setActiveShowcase] = useState<ClientShowcaseLink | null>(null);
  const [shareLoading, setShareLoading] = useState<boolean>(Boolean(shareSlug));
  const [shareNotFound, setShareNotFound] = useState(false);

  // Owner client links list
  const [clientLinks, setClientLinks] = useState<ClientShowcaseLink[]>(() =>
    getLocalClientLinks()
  );

  // Save feedback
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatusMessage, setSaveStatusMessage] = useState<string | null>(null);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);

  // Initial load of published portfolio & optional shared link
  useEffect(() => {
    let mounted = true;
    void (async () => {
      const published = await fetchPublishedPortfolio();
      if (!mounted) return;
      setPublishedSnapshot(published);

      // Restore unsaved local draft if present
      try {
        const localDraftRaw = localStorage.getItem(LOCAL_DRAFT_STORAGE_KEY);
        if (localDraftRaw) {
          const parsed = JSON.parse(localDraftRaw) as PortfolioData;
          if (parsed && parsed.brandName && parsed.theme) {
            setPortfolio(parsed);
            return;
          }
        }
      } catch {
        // Ignore invalid local draft
      }
      setPortfolio(published);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Load client showcase if ?share=<slug> is present
  useEffect(() => {
    if (!shareSlug) {
      setActiveShowcase(null);
      setShareLoading(false);
      setShareNotFound(false);
      return;
    }

    let mounted = true;
    setShareLoading(true);
    setShareNotFound(false);
    void (async () => {
      const found = await fetchClientShowcaseLink(shareSlug);
      if (!mounted) return;
      if (found && found.active) {
        setActiveShowcase(found);
        setShareNotFound(false);
      } else {
        setActiveShowcase(null);
        setShareNotFound(true);
      }
      setShareLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [shareSlug]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email === ADMIN_EMAIL) {
        void listOwnerClientLinks(currentUser.uid)
          .then((links) => {
            setClientLinks(links);
            saveLocalClientLinks(links);
          })
          .catch(() => {
            // Keep local links on offline/fallback
          });
      }
    });
    return () => unsub();
  }, []);

  const handleUpdatePortfolio = (next: PortfolioData) => {
    setPortfolio(next);
    setSaveStatusMessage(null);
    setSaveErrorMessage(null);
    try {
      localStorage.setItem(LOCAL_DRAFT_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage errors
    }
  };

  const handleSignIn = async () => {
    setSaveErrorMessage(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setSaveErrorMessage(
        err instanceof Error ? err.message : 'Google sign-in was cancelled.'
      );
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const handleSaveToCloud = async () => {
    setSaveStatusMessage(null);
    setSaveErrorMessage(null);

    if (!user) {
      await handleSignIn();
      return;
    }
    if (user.email !== ADMIN_EMAIL) {
      setSaveErrorMessage(`Signed in as ${user.email}. Owner account required to publish.`);
      return;
    }

    setIsSaving(true);
    try {
      await savePublishedPortfolio(portfolio, user.uid);
      setPublishedSnapshot(portfolio);
      localStorage.removeItem(LOCAL_DRAFT_STORAGE_KEY);
      setSaveStatusMessage('Published live');
    } catch (err) {
      setSaveErrorMessage(
        err instanceof Error ? err.message : 'Unable to publish changes.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefault = () => {
    localStorage.removeItem(LOCAL_DRAFT_STORAGE_KEY);
    setPortfolio(DEFAULT_PORTFOLIO);
    setSaveStatusMessage('Reset to MikeyFlix defaults');
  };

  const handleCreateClientLink = async (link: ClientShowcaseLink) => {
    const updatedLocal = [link, ...clientLinks.filter((l) => l.slug !== link.slug)];
    setClientLinks(updatedLocal);
    saveLocalClientLinks(updatedLocal);

    if (user && user.email === ADMIN_EMAIL) {
      await saveClientShowcaseLink(link, user.uid);
      setSaveStatusMessage('Client link published');
    } else {
      setSaveStatusMessage('Preview link ready (sign in to sync across devices)');
    }
  };

  const handleDeleteClientLink = async (slug: string) => {
    const filtered = clientLinks.filter((l) => l.slug !== slug);
    setClientLinks(filtered);
    saveLocalClientLinks(filtered);
    if (user && user.email === ADMIN_EMAIL) {
      await deleteClientShowcaseLink(slug);
    }
  };

  const handleToggleClientLinkActive = async (link: ClientShowcaseLink) => {
    const updated: ClientShowcaseLink = { ...link, active: !link.active };
    const nextList = clientLinks.map((l) => (l.slug === link.slug ? updated : l));
    setClientLinks(nextList);
    saveLocalClientLinks(nextList);
    if (user && user.email === ADMIN_EMAIL) {
      await saveClientShowcaseLink(updated, user.uid);
    }
  };

  const handlePreviewClientLink = (slug: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('share', slug);
    window.history.pushState({}, '', url.toString());
    setEditorOpen(false);
    setShareSlug(slug);
  };

  const handleExitSharePreview = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('share');
    window.history.pushState({}, '', url.toString());
    setShareSlug(null);
  };

  const hasUnsavedChanges =
    JSON.stringify(portfolio) !== JSON.stringify(publishedSnapshot);

  // Loading state for Client Share Link
  if (shareSlug && shareLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050508] text-sm text-zinc-400">
        Loading private client showcase...
      </div>
    );
  }

  // Invalid / Paused Share Link screen
  if (shareSlug && shareNotFound) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#050508] px-6 text-center text-zinc-100">
        <div className="max-w-md rounded-2xl border border-white/15 bg-[#0C0D16] p-8">
          <h1 className="text-xl font-semibold text-white">
            Showcase Link Unavailable
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            This private link may have been paused or removed by {portfolio.brandName}.
          </p>
          <button
            type="button"
            onClick={handleExitSharePreview}
            className="mt-6 inline-flex min-h-[42px] cursor-pointer items-center rounded-lg bg-[#9340FF] px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white"
          >
            View Main Portfolio
          </button>
        </div>
      </div>
    );
  }

  // Active Client Screening View (?share=slug)
  if (shareSlug && activeShowcase) {
    return (
      <>
        <ClientScreeningView
          portfolio={portfolio}
          showcase={activeShowcase}
          onPlayVideo={(video, hideYoutube) =>
            setActiveVideo({ video, hideYoutube })
          }
          onExitSharePreview={handleExitSharePreview}
          selectedPlanId={selectedPlanId}
          onSelectPlan={setSelectedPlanId}
        />
        <VideoLightbox
          video={activeVideo?.video || null}
          hideExternalYoutubeLink={Boolean(activeVideo?.hideYoutube)}
          onClose={() => setActiveVideo(null)}
        />
      </>
    );
  }

  // Public Studio Portfolio + Floating Edit Bar + Full Canvas Editor
  return (
    <div
      className="min-h-screen pb-20"
      style={{
        backgroundColor: portfolio.theme.bgColor,
        color: portfolio.theme.textColor,
        fontFamily: portfolio.theme.bodyFont,
      }}
    >
      <TopNav brandName={portfolio.brandName} theme={portfolio.theme} />

      <main>
        <HeroSection data={portfolio} />
        <WorkspaceSection
          manifestoQuote={portfolio.manifestoQuote}
          videos={portfolio.videos}
          theme={portfolio.theme}
          onPlayVideo={(video) => setActiveVideo({ video, hideYoutube: false })}
        />
        <AboutSection
          about={portfolio.about}
          brandName={portfolio.brandName}
          theme={portfolio.theme}
        />
        <ServicesSection
          services={portfolio.services}
          theme={portfolio.theme}
          onSelectPlan={setSelectedPlanId}
        />
        <ContactAndAgreementSection
          brandName={portfolio.brandName}
          contact={portfolio.contact}
          agreement={portfolio.agreement}
          services={portfolio.services}
          selectedPlanId={selectedPlanId}
          onSelectPlan={setSelectedPlanId}
          theme={portfolio.theme}
        />
      </main>

      <EditBar
        accentColor={portfolio.theme.accentColor}
        hasUnsavedChanges={hasUnsavedChanges}
        onOpenEditor={(tab = 'theme') => {
          setEditorTab(tab);
          setEditorOpen(true);
        }}
      />

      {editorOpen && (
        <CanvasEditor
          portfolio={portfolio}
          onChangePortfolio={handleUpdatePortfolio}
          onSaveToCloud={handleSaveToCloud}
          onResetDefault={handleResetDefault}
          onClose={() => setEditorOpen(false)}
          initialTab={editorTab}
          user={user}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
          clientLinks={clientLinks}
          onCreateClientLink={handleCreateClientLink}
          onDeleteClientLink={handleDeleteClientLink}
          onToggleClientLinkActive={handleToggleClientLinkActive}
          onPreviewClientLink={handlePreviewClientLink}
          onPlayVideo={(video) => setActiveVideo({ video, hideYoutube: false })}
          isSaving={isSaving}
          saveStatusMessage={saveStatusMessage}
          saveErrorMessage={saveErrorMessage}
        />
      )}

      <VideoLightbox
        video={activeVideo?.video || null}
        hideExternalYoutubeLink={Boolean(activeVideo?.hideYoutube)}
        onClose={() => setActiveVideo(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <StudioApp />
    </ErrorBoundary>
  );
}

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { DEFAULT_PORTFOLIO } from '../data/defaultPortfolio';
import { db, handleFirestoreError, OperationType } from '../firebase';
import type { ClientShowcaseLink, PortfolioData } from '../types/portfolio';
import { validateClientLinkDraft, validatePortfolioForSave } from '../utils/portfolioLogic';

const PORTFOLIO_DOC_PATH = 'portfolios/main';
const LOCAL_CLIENT_LINKS_KEY = 'mikeyflix_local_client_links_v1';

export async function fetchPublishedPortfolio(): Promise<PortfolioData> {
  try {
    const snap = await getDoc(doc(db, 'portfolios', 'main'));
    if (snap.exists()) {
      const raw = snap.data() as Partial<PortfolioData>;
      return {
        ...DEFAULT_PORTFOLIO,
        ...raw,
        theme: { ...DEFAULT_PORTFOLIO.theme, ...(raw.theme || {}) },
        about: { ...DEFAULT_PORTFOLIO.about, ...(raw.about || {}) },
        contact: { ...DEFAULT_PORTFOLIO.contact, ...(raw.contact || {}) },
        agreement: { ...DEFAULT_PORTFOLIO.agreement, ...(raw.agreement || {}) },
        videos: Array.isArray(raw.videos) ? raw.videos : DEFAULT_PORTFOLIO.videos,
        services: Array.isArray(raw.services) ? raw.services : DEFAULT_PORTFOLIO.services,
      };
    }
    return DEFAULT_PORTFOLIO;
  } catch (err) {
    console.warn('Using bundled default portfolio due to Firestore read fallback:', err);
    return DEFAULT_PORTFOLIO;
  }
}

export async function savePublishedPortfolio(
  data: PortfolioData,
  uid: string
): Promise<void> {
  const errors = validatePortfolioForSave(data);
  if (errors.length > 0) {
    throw new Error(errors.join(' '));
  }

  const ref = doc(db, 'portfolios', 'main');
  try {
    const existingSnap = await getDoc(ref);
    const payload = {
      ownerId: existingSnap.exists()
        ? (existingSnap.data().ownerId as string) || uid
        : uid,
      brandName: data.brandName.trim().slice(0, 80),
      tagline: data.tagline.trim().slice(0, 140),
      manifestoQuote: data.manifestoQuote.trim().slice(0, 800),
      theme: data.theme,
      videos: data.videos.slice(0, 40),
      about: data.about,
      services: data.services.slice(0, 10),
      contact: data.contact,
      agreement: data.agreement,
      createdAt: existingSnap.exists() ? existingSnap.data().createdAt : serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(ref, payload);
  } catch (error) {
    handleFirestoreError(
      error,
      OperationType.WRITE,
      PORTFOLIO_DOC_PATH
    );
  }
}

export function getLocalClientLinks(): ClientShowcaseLink[] {
  try {
    const raw = localStorage.getItem(LOCAL_CLIENT_LINKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLocalClientLinks(links: ClientShowcaseLink[]): void {
  try {
    localStorage.setItem(LOCAL_CLIENT_LINKS_KEY, JSON.stringify(links));
  } catch {
    // Ignore storage quota errors
  }
}

export async function fetchClientShowcaseLink(
  slug: string
): Promise<ClientShowcaseLink | null> {
  if (!/^[a-zA-Z0-9_-]{2,80}$/.test(slug)) {
    return null;
  }
  try {
    const snap = await getDoc(doc(db, 'clientLinks', slug));
    if (snap.exists()) {
      return { id: snap.id, ...(snap.data() as Omit<ClientShowcaseLink, 'id'>) };
    }
  } catch (error) {
    console.warn('Firestore client link read fallback:', error);
  }

  const localMatch = getLocalClientLinks().find((item) => item.slug === slug && item.active);
  return localMatch || null;
}

export async function listOwnerClientLinks(uid: string): Promise<ClientShowcaseLink[]> {
  const path = 'clientLinks';
  try {
    const q = query(collection(db, path), where('ownerId', '==', uid));
    const snap = await getDocs(q);
    const items: ClientShowcaseLink[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<ClientShowcaseLink, 'id'>),
    }));
    items.sort((a, b) => {
      const aSec = (a.updatedAt as { seconds?: number } | undefined)?.seconds ?? 0;
      const bSec = (b.updatedAt as { seconds?: number } | undefined)?.seconds ?? 0;
      return bSec - aSec;
    });
    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveClientShowcaseLink(
  draft: ClientShowcaseLink,
  uid: string
): Promise<void> {
  const errors = validateClientLinkDraft(draft);
  if (errors.length > 0) {
    throw new Error(errors.join(' '));
  }

  const ref = doc(db, 'clientLinks', draft.slug);
  const path = `clientLinks/${draft.slug}`;
  try {
    const existingSnap = await getDoc(ref);
    const payload = {
      ownerId: existingSnap.exists()
        ? (existingSnap.data().ownerId as string) || uid
        : uid,
      slug: draft.slug,
      clientName: draft.clientName.trim().slice(0, 120),
      projectTitle: draft.projectTitle.trim().slice(0, 160),
      welcomeNote: draft.welcomeNote.trim().slice(0, 600),
      hideYoutubeLinks: Boolean(draft.hideYoutubeLinks),
      showFullPortfolio: Boolean(draft.showFullPortfolio),
      themeOverride: draft.themeOverride || {},
      videos: draft.videos.slice(0, 30),
      active: Boolean(draft.active),
      createdAt: existingSnap.exists() ? existingSnap.data().createdAt : serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(ref, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteClientShowcaseLink(slug: string): Promise<void> {
  const path = `clientLinks/${slug}`;
  try {
    await deleteDoc(doc(db, 'clientLinks', slug));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

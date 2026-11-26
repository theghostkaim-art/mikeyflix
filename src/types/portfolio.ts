export type VideoAspect = '16:9' | '9:16';

export interface VideoItem {
  id: string;
  title: string;
  youtubeUrl: string;
  youtubeId: string;
  aspect: VideoAspect;
  category: string;
  clientTag: string;
  isUnlisted?: boolean;
}

export interface PortfolioTheme {
  bgColor: string;
  surfaceColor: string;
  accentColor: string;
  secondaryAccent: string;
  textColor: string;
  heroBgColor: string;
  displayFont: string;
  bodyFont: string;
  fontScale: number;
}

export interface ThemeOverride {
  bgColor?: string;
  accentColor?: string;
  displayFont?: string;
  bodyFont?: string;
}

export interface AboutContent {
  founderName: string;
  title: string;
  whatWeDo: string[];
  whatYouGain: string[];
  problemStatement: string[];
  whoWeWorkWith: string;
}

export interface ServicePlan {
  id: string;
  badge: string;
  name: string;
  price: string;
  cadence: string;
  durationTag: string;
  featured: boolean;
  features: string[];
  footnote: string;
}

export interface ContactContent {
  headline: string;
  subheadline: string;
  whatsappUrl: string;
  emailAddress: string;
  phoneNumber: string;
}

export interface AgreementContent {
  title: string;
  subtitle: string;
  summaryNote: string;
  partnershipLabel: string;
  terms: string[];
}

export interface PortfolioData {
  ownerId: string;
  brandName: string;
  tagline: string;
  manifestoQuote: string;
  theme: PortfolioTheme;
  videos: VideoItem[];
  about: AboutContent;
  services: ServicePlan[];
  contact: ContactContent;
  agreement: AgreementContent;
}

export interface ClientShowcaseLink {
  id: string;
  ownerId: string;
  slug: string;
  clientName: string;
  projectTitle: string;
  welcomeNote: string;
  hideYoutubeLinks: boolean;
  showFullPortfolio: boolean;
  themeOverride: ThemeOverride;
  videos: VideoItem[];
  active: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface FontOption {
  label: string;
  value: string;
  category: 'serif' | 'sans' | 'display';
}

export type CanvasEditorTab = 'theme' | 'typography' | 'videos' | 'copy' | 'client-links';

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildShareLinkUrl,
  buildYouTubeEmbedUrl,
  detectVideoAspect,
  extractYouTubeId,
  resolveActiveTheme,
  slugifyClientName,
  validateClientLinkDraft,
} from './portfolioLogic';

test('extractYouTubeId handles watch, shorts, youtu.be, embed, and raw IDs', () => {
  assert.equal(extractYouTubeId('https://www.youtube.com/watch?v=hGuqKRWgOxE'), 'hGuqKRWgOxE');
  assert.equal(extractYouTubeId('https://youtube.com/shorts/eNJnY5niI1Q?feature=share'), 'eNJnY5niI1Q');
  assert.equal(extractYouTubeId('https://youtu.be/TiKJZ-5QJYQ?t=12'), 'TiKJZ-5QJYQ');
  assert.equal(extractYouTubeId('https://www.youtube-nocookie.com/embed/-XEGTd7nwYA'), '-XEGTd7nwYA');
  assert.equal(extractYouTubeId('c3Y7S256Xoo'), 'c3Y7S256Xoo');
  assert.equal(extractYouTubeId('https://example.com/not-youtube'), null);
});

test('detectVideoAspect identifies Shorts as 9:16 and standard videos as 16:9', () => {
  assert.equal(detectVideoAspect('https://www.youtube.com/shorts/YGNitM25fwU'), '9:16');
  assert.equal(detectVideoAspect('https://www.youtube.com/watch?v=c3Y7S256Xoo'), '16:9');
});

test('buildYouTubeEmbedUrl uses privacy-enhanced nocookie domain', () => {
  const url = buildYouTubeEmbedUrl('hGuqKRWgOxE', { autoplay: true, hideBranding: true });
  assert.ok(url.startsWith('https://www.youtube-nocookie.com/embed/hGuqKRWgOxE?'));
  assert.ok(url.includes('autoplay=1'));
  assert.ok(url.includes('modestbranding=1'));
});

test('slugifyClientName produces Firestore-safe document IDs', () => {
  const slug = slugifyClientName('Zomato Perfume — Pitch #1!', 'x9k2');
  assert.equal(slug, 'zomato-perfume-pitch-1-x9k2');
  assert.match(slug, /^[a-zA-Z0-9_-]+$/);
});

test('buildShareLinkUrl formats query link cleanly', () => {
  assert.equal(
    buildShareLinkUrl('https://mikeyflix.studio/', 'zomato-pitch'),
    'https://mikeyflix.studio/?share=zomato-pitch'
  );
});

test('resolveActiveTheme applies client override without mutating base theme', () => {
  const base = {
    bgColor: '#050508',
    surfaceColor: '#0D0E16',
    accentColor: '#9340FF',
    secondaryAccent: '#1D4ED8',
    textColor: '#F4F4F5',
    heroBgColor: '#081744',
    displayFont: 'Cormorant Garamond',
    bodyFont: 'Plus Jakarta Sans',
    fontScale: 1,
  };
  const resolved = resolveActiveTheme(base, { accentColor: '#F2B705', displayFont: 'Outfit' });
  assert.equal(resolved.accentColor, '#F2B705');
  assert.equal(resolved.displayFont, 'Outfit');
  assert.equal(resolved.bgColor, '#050508');
  assert.equal(base.accentColor, '#9340FF');
});

test('validateClientLinkDraft rejects empty videos or invalid slugs', () => {
  const errs = validateClientLinkDraft({
    slug: 'bad slug!',
    clientName: '',
    projectTitle: 'Test',
    videos: [],
  });
  assert.equal(errs.length, 3);
});

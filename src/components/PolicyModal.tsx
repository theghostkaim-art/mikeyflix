import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Printer, X } from 'lucide-react';
import {
  OFFICIAL_PARTNERSHIP_POLICY,
  type PolicyArticle,
} from '../data/policyData';

interface PolicyModalProps {
  open: boolean;
  onClose: () => void;
}

const ARTICLE_ORDER: PolicyArticle['id'][] = [
  'article-1',
  'article-2',
  'article-3',
  'article-4',
];

export function PolicyModal({ open, onClose }: PolicyModalProps) {
  const [activeArticleId, setActiveArticleId] =
    useState<PolicyArticle['id'] | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      setActiveArticleId(null);
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (activeArticleId) {
          setActiveArticleId(null);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, activeArticleId, onClose]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [activeArticleId, open]);

  if (!open) {
    return null;
  }

  const activeArticle = activeArticleId
    ? OFFICIAL_PARTNERSHIP_POLICY.articles[activeArticleId]
    : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={
        activeArticle
          ? activeArticle.shortLabel
          : 'MikeyFlix Studios Official Partnership Policy'
      }
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-[920px] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white text-zinc-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Navigation Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 bg-zinc-50 px-5 py-3.5 sm:px-8">
          <div className="flex items-center gap-3">
            {activeArticle ? (
              <button
                type="button"
                onClick={() => setActiveArticleId(null)}
                className="inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 transition-colors hover:bg-zinc-100"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Back to Partnership Policy</span>
              </button>
            ) : (
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-700">
                MIKEY<span className="text-red-700">FLIX</span> STUDIOS · POLICY
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-100"
            >
              <Printer className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close policy dialog"
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-zinc-300 bg-white text-zinc-700 transition-colors hover:bg-zinc-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Editorial Body */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-6 py-8 sm:px-12 sm:py-10"
        >
          {!activeArticle ? (
            <div className="mx-auto max-w-[740px] text-zinc-800">
              <h2 className="text-center text-xl font-semibold leading-snug tracking-tight text-zinc-950 sm:text-2xl">
                {OFFICIAL_PARTNERSHIP_POLICY.title}
              </h2>

              <p className="mt-8 text-sm leading-relaxed text-zinc-600 sm:text-[15px]">
                {OFFICIAL_PARTNERSHIP_POLICY.intro}
              </p>

              <div className="mt-8 space-y-7">
                {OFFICIAL_PARTNERSHIP_POLICY.tenets.map((tenet) => (
                  <div
                    key={tenet.articleId}
                    className="border-b border-zinc-100 pb-6 last:border-b-0"
                  >
                    <h3
                      className={`text-base font-medium text-zinc-900 ${
                        tenet.number === 1 ? 'italic' : ''
                      }`}
                    >
                      {tenet.title}
                    </h3>
                    <p
                      className={`mt-2 text-sm leading-relaxed text-zinc-600 sm:text-[15px] ${
                        tenet.number === 1 ? 'italic' : ''
                      }`}
                    >
                      {tenet.summary}
                    </p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-3 text-sm">
                      <span
                        className={`text-zinc-700 ${
                          tenet.number === 1 ? 'italic' : ''
                        }`}
                      >
                        {tenet.linkLabel}
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveArticleId(tenet.articleId)}
                        className="cursor-pointer font-medium text-blue-600 underline decoration-blue-600/80 underline-offset-4 transition-colors hover:text-blue-800"
                      >
                        View more
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Decentralized Cloud Studio Model Statements */}
              <div className="mt-8 space-y-4 rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-sm leading-relaxed text-zinc-700 sm:p-6">
                <p>{OFFICIAL_PARTNERSHIP_POLICY.studioModelQuotes.hinglish}</p>
                <p>{OFFICIAL_PARTNERSHIP_POLICY.studioModelQuotes.english}</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  {OFFICIAL_PARTNERSHIP_POLICY.studioModelQuotes.languageTag}
                </p>
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-[740px] text-zinc-800">
              <h2 className="text-lg font-semibold leading-snug text-zinc-950 sm:text-xl">
                {activeArticle.title}
              </h2>

              <div className="mt-7 space-y-6">
                {activeArticle.sections.map((section) => (
                  <div key={section.heading}>
                    <h3 className="text-sm font-semibold leading-relaxed text-zinc-900 sm:text-[15px]">
                      {section.heading}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-600 sm:text-[15px]">
                      {section.body}
                    </p>
                  </div>
                ))}
              </div>

              {/* Sub-policy Navigation Footer */}
              <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-6">
                <button
                  type="button"
                  onClick={() => setActiveArticleId(null)}
                  className="inline-flex min-h-[38px] cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-800 hover:bg-zinc-100"
                >
                  <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Back to Partnership Policy</span>
                </button>

                <div className="flex flex-wrap items-center gap-2">
                  {ARTICLE_ORDER.map((id, idx) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setActiveArticleId(id)}
                      className={`min-h-[34px] cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                        activeArticleId === id
                          ? 'bg-zinc-900 text-white'
                          : 'border border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
                      }`}
                    >
                      Article {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

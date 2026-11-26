import { Link2, Paintbrush, Sparkles } from 'lucide-react';
import type { CanvasEditorTab } from '../types/portfolio';

interface EditBarProps {
  onOpenEditor: (initialTab?: CanvasEditorTab) => void;
  accentColor: string;
  hasUnsavedChanges: boolean;
}

export function EditBar({
  onOpenEditor,
  accentColor,
  hasUnsavedChanges,
}: EditBarProps) {
  return (
    <div
      data-testid="edit-bar"
      className="fixed bottom-4 left-1/2 z-40 flex max-w-[95vw] -translate-x-1/2 items-center gap-2 rounded-xl border border-white/15 bg-[#0A0B12]/95 px-3 py-2 shadow-2xl backdrop-blur-xl sm:bottom-5 sm:left-auto sm:right-6 sm:translate-x-0 sm:gap-2.5 sm:px-3.5"
    >
      <button
        type="button"
        data-testid="open-canvas-editor"
        onClick={() => onOpenEditor('theme')}
        className="inline-flex min-h-[40px] shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-xs font-semibold tracking-wide text-white transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]"
        style={{ backgroundColor: accentColor }}
      >
        <Paintbrush className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Edit Canvas</span>
      </button>

      <button
        type="button"
        data-testid="open-video-manager"
        onClick={() => onOpenEditor('videos')}
        className="hidden min-h-[40px] shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-200 transition-colors hover:bg-white/10 hover:text-white sm:inline-flex"
      >
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Videos</span>
      </button>

      <button
        type="button"
        data-testid="open-client-links"
        onClick={() => onOpenEditor('client-links')}
        className="inline-flex min-h-[40px] shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-200 transition-colors hover:bg-white/10 hover:text-white"
      >
        <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Client Links</span>
      </button>

      {hasUnsavedChanges && (
        <span className="hidden whitespace-nowrap pr-1 text-[11px] font-medium text-amber-300 md:inline">
          Unsaved draft
        </span>
      )}
    </div>
  );
}

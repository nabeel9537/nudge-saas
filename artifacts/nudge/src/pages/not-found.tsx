import { ArrowLeft, Compass, SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="nudge-noise nudge-grid flex min-h-[100dvh] items-center justify-center px-5 py-10 text-foreground">
      <main className="w-full max-w-xl text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-[1.25rem] bg-[#182338] text-[#f2775e] shadow-[0_18px_35px_-20px_rgba(24,35,56,0.8)]">
          <SearchX className="size-7" />
        </div>
        <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.25em] text-[#a13d30]">
          Signal lost / 404
        </p>
        <h1 className="mt-4 font-sans text-5xl font-extrabold tracking-[-0.08em] text-[#182338] sm:text-7xl">
          That page is not here.
        </h1>
        <p className="mx-auto mt-6 max-w-md text-base leading-7 text-muted-foreground">
          The route may have moved, or it may not be part of this foundation
          yet. The Nudge home is still right where you left it.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#f2775e] px-5 py-3 text-sm font-bold text-[#182338] transition-transform hover:-translate-y-0.5"
            data-testid="link-return-home"
          >
            <ArrowLeft className="size-4" />
            Return home
          </a>
          <a
            href="/#foundation"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-[#f2775e] hover:text-[#a13d30]"
            data-testid="link-view-foundation"
          >
            <Compass className="size-4" />
            View foundation
          </a>
        </div>
      </main>
    </div>
  );
}

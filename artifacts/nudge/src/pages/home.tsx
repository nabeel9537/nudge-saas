'use client';

import { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleDot,
  Clock3,
  Command,
  Compass,
  Layers3,
  LifeBuoy,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import {
  getHealthCheckQueryKey,
  useHealthCheck,
} from '@workspace/api-client-react';

type HealthTone = 'healthy' | 'attention' | 'unknown';

function getHealthTone(status: string | undefined): HealthTone {
  const normalized = status?.toLowerCase().trim();
  if (!normalized) return 'unknown';
  if (['ok', 'healthy', 'up', 'operational', 'ready'].includes(normalized)) {
    return 'healthy';
  }
  return 'attention';
}

function StatusMark({ tone }: { tone: HealthTone }) {
  if (tone === 'healthy') {
    return (
      <span className="relative flex size-10 items-center justify-center rounded-full bg-[#d8efe8] text-[#1f6c62]">
        <span className="nudge-pulse absolute size-5 rounded-full bg-[#82cbb9]/45" />
        <Check className="relative size-4 stroke-[2.5]" />
      </span>
    );
  }

  if (tone === 'attention') {
    return (
      <span className="flex size-10 items-center justify-center rounded-full bg-[#f8ded8] text-[#a13d30]">
        <X className="size-4 stroke-[2.5]" />
      </span>
    );
  }

  return (
    <span className="flex size-10 items-center justify-center rounded-full bg-[#e9e5dd] text-[#696b68]">
      <CircleDot className="size-4" />
    </span>
  );
}

function ServiceStatus() {
  const health = useHealthCheck({
    query: {
      queryKey: getHealthCheckQueryKey(),
      retry: 1,
      refetchInterval: 30000,
    },
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const tone = useMemo(
    () => getHealthTone(health.data?.status),
    [health.data?.status],
  );
  const isLoading = health.isLoading || isRefreshing;

  const refreshStatus = async () => {
    setIsRefreshing(true);
    try {
      await health.refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <section
      id="service-status"
      className="nudge-reveal nudge-reveal-delay-2 relative overflow-hidden rounded-[1.5rem] border border-[#223048] bg-[#182338] text-[#f8f4eb] shadow-[0_20px_50px_-30px_rgba(17,29,49,0.65)]"
      data-testid="section-service-status"
    >
      <div className="nudge-grid-dark absolute inset-0 opacity-60" />
      <div className="relative grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="border-b border-[#31405a] p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#a2b0c4]">
                Core service
              </p>
              <h2 className="mt-3 font-sans text-2xl font-semibold tracking-[-0.04em] text-[#fbf7ef]">
                Health check
              </h2>
            </div>
            <button
              type="button"
              onClick={refreshStatus}
              disabled={isLoading}
              className="group inline-flex size-10 items-center justify-center rounded-full border border-[#46546b] text-[#bcc7d5] transition-colors hover:border-[#f2775e] hover:text-[#f2775e] disabled:cursor-wait disabled:opacity-60"
              data-testid="button-refresh-health"
              aria-label="Refresh service health"
            >
              <RefreshCw className={`size-4 transition-transform ${isLoading ? 'animate-spin' : 'group-hover:rotate-45'}`} />
            </button>
          </div>

          {isLoading ? (
            <div className="mt-10 space-y-4" data-testid="status-loading">
              <div className="h-10 w-48 animate-pulse rounded-lg bg-[#2b3951]" />
              <div className="h-4 w-full max-w-sm animate-pulse rounded bg-[#2b3951]" />
              <div className="h-4 w-3/4 max-w-xs animate-pulse rounded bg-[#2b3951]" />
            </div>
          ) : health.isError ? (
            <div className="mt-10" data-testid="status-error">
              <StatusMark tone="attention" />
              <p className="mt-5 text-lg font-medium text-[#fbf7ef]">
                We could not reach the service.
              </p>
              <p className="mt-2 max-w-sm text-sm leading-6 text-[#a2b0c4]">
                The shell is still available. Try the check again when the
                service is ready.
              </p>
              <button
                type="button"
                onClick={refreshStatus}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#f2775e] px-4 py-2.5 text-sm font-bold text-[#182338] transition-transform hover:-translate-y-0.5 active:translate-y-0"
                data-testid="button-retry-health"
              >
                Try again
                <ArrowUpRight className="size-4" />
              </button>
            </div>
          ) : !health.data?.status ? (
            <div className="mt-10" data-testid="status-empty">
              <StatusMark tone="unknown" />
              <p className="mt-5 text-lg font-medium text-[#fbf7ef]">
                No status reported yet.
              </p>
              <p className="mt-2 max-w-sm text-sm leading-6 text-[#a2b0c4]">
                The service responded, but did not include a status signal.
              </p>
            </div>
          ) : (
            <div className="mt-10 flex items-start gap-4" data-testid="status-success">
              <StatusMark tone={tone} />
              <div>
                <p className="font-mono text-2xl font-medium tracking-[-0.04em] text-[#fbf7ef]">
                  {health.data.status}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#a2b0c4]">
                  {tone === 'healthy'
                    ? 'The Nudge foundation is responding as expected.'
                    : 'The service is responding with a status that needs attention.'}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
          <div>
            <div className="flex items-center gap-2 text-[#a2b0c4]">
              <ShieldCheck className="size-4 text-[#82cbb9]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em]">
                Runtime signal
              </span>
            </div>
            <p className="mt-5 max-w-md text-[1.05rem] leading-7 text-[#d8e0e9]">
              A small, dependable starting point for the product team. The
              shell is intentionally quiet until there is something useful to
              act on.
            </p>
          </div>
          <div className="mt-12 border-t border-[#31405a] pt-4">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="text-[#8492a8]">Polling interval</span>
              <span className="font-mono text-[#d8e0e9]">30 seconds</span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 text-xs">
              <span className="text-[#8492a8]">Endpoint</span>
              <span className="font-mono text-[#d8e0e9]">/api/healthz</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const foundationItems = [
  {
    icon: Layers3,
    title: 'A clear home',
    detail: 'One place to see what deserves attention.',
  },
  {
    icon: Clock3,
    title: 'A sense of timing',
    detail: 'Follow-through should arrive at the right moment.',
  },
  {
    icon: LifeBuoy,
    title: 'A reliable signal',
    detail: 'Start with a foundation that tells the truth.',
  },
];

function Home() {
  return (
    <div className="nudge-noise min-h-[100dvh] overflow-x-hidden bg-background text-foreground">
      <div className="mx-auto flex min-h-[100dvh] max-w-[1600px] flex-col lg:flex-row">
        <aside className="relative z-10 flex shrink-0 flex-col border-b border-[#31405a] bg-[#182338] px-5 py-5 text-[#f8f4eb] lg:min-h-[100dvh] lg:w-[248px] lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
          <div className="flex items-center justify-between lg:block">
            <a
              href="/"
              className="group inline-flex items-center gap-3"
              data-testid="link-brand"
              aria-label="Nudge home"
            >
              <span className="relative flex size-9 items-center justify-center rounded-[11px] bg-[#f2775e] text-[#182338] transition-transform duration-300 group-hover:rotate-6">
                <Sparkles className="size-[18px]" />
              </span>
              <span className="font-sans text-[1.15rem] font-extrabold tracking-[-0.06em]">
                nudge
              </span>
            </a>
            <div
              className="flex items-center gap-2 rounded-full border border-[#46546b] px-3 py-2 text-[#a2b0c4] lg:hidden"
              data-testid="status-mobile-shell"
            >
              <span className="size-1.5 rounded-full bg-[#82cbb9]" />
              <span className="font-mono text-[9px] uppercase tracking-[0.14em]">
                Live shell
              </span>
            </div>
          </div>

          <div className="mt-14 hidden lg:block">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8492a8]">
              Workspace
            </p>
            <nav className="mt-4 space-y-1" aria-label="Primary navigation">
              <a
                href="/"
                className="group flex items-center justify-between rounded-xl bg-[#2b3951] px-3 py-3 text-sm font-semibold text-[#fbf7ef] transition-colors"
                data-testid="link-overview"
              >
                <span className="flex items-center gap-3">
                  <Compass className="size-4 text-[#f2775e]" />
                  Overview
                </span>
                <ChevronRight className="size-3.5 text-[#8492a8] transition-transform group-hover:translate-x-0.5" />
              </a>
            </nav>
          </div>

          <div className="mt-auto hidden lg:block">
            <div className="rounded-2xl border border-[#31405a] bg-[#1f2d43] p-4">
              <div className="flex items-center gap-2 text-[#82cbb9]">
                <span className="size-1.5 rounded-full bg-[#82cbb9]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.15em]">
                  Foundation
                </span>
              </div>
              <p className="mt-3 text-sm leading-5 text-[#d8e0e9]">
                The product surface is ready to grow.
              </p>
            </div>
            <p className="mt-5 font-mono text-[10px] text-[#627188]">
              NUDGE / 0.1.0
            </p>
          </div>
        </aside>

        <main className="nudge-grid flex-1">
          <header className="flex items-center justify-between px-5 py-5 sm:px-8 lg:px-12 lg:py-8">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              <Command className="size-3.5" />
              <span>Product foundation</span>
            </div>
            <a
              href="#service-status"
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-2 text-xs font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-[#f2775e] hover:text-[#a13d30]"
              data-testid="link-status"
            >
              <span className="size-1.5 rounded-full bg-[#82cbb9] transition-transform group-hover:scale-125" />
              Service status
              <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </header>

          <div className="mx-auto max-w-[1180px] px-5 pb-16 sm:px-8 lg:px-12 lg:pb-24">
            <section className="nudge-reveal max-w-4xl pb-14 pt-10 lg:pb-20 lg:pt-16">
              <div className="flex items-center gap-3 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-[#a13d30]">
                <span className="h-px w-8 bg-[#f2775e]" />
                Welcome to Nudge
              </div>
              <h1 className="mt-6 max-w-4xl font-sans text-[clamp(3.4rem,8vw,7.7rem)] font-extrabold leading-[0.93] tracking-[-0.085em] text-[#182338]">
                Make the next
                <span className="relative mx-3 inline-block whitespace-nowrap text-[#d95c47]">
                  move
                  <span className="absolute -bottom-1 left-0 h-2 w-[92%] -rotate-2 rounded-full bg-[#f6c8bb] opacity-80" />
                </span>
                count.
              </h1>
              <p className="mt-8 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                Nudge is the calm layer between an important moment and the
                follow-through it deserves. This is the first signal: a
                dependable home for what comes next.
              </p>
            </section>

            <ServiceStatus />

            <section
              id="foundation"
              className="nudge-reveal nudge-reveal-delay-3 grid gap-10 border-b border-border py-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:py-20"
              data-testid="section-foundation"
            >
              <div>
                <div className="flex items-center gap-2 text-[#a13d30]">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em]">
                    Built for extension
                  </span>
                  <ArrowUpRight className="size-3.5" />
                </div>
                <h2 className="mt-4 max-w-sm font-sans text-3xl font-bold leading-tight tracking-[-0.06em] text-[#182338] sm:text-4xl">
                  Quiet by design. Ready by default.
                </h2>
              </div>
              <div className="divide-y divide-border border-y border-border">
                {foundationItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="group flex items-center gap-5 py-5 transition-transform duration-300 hover:translate-x-1"
                      data-testid={`item-foundation-${index}`}
                    >
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#e9f3ef] text-[#3f8278] transition-colors group-hover:bg-[#d8efe8]">
                        <Icon className="size-5" />
                      </span>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-[#182338]">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {item.detail}
                        </p>
                      </div>
                      <ChevronRight className="size-4 text-[#aeb1ac] transition-transform group-hover:translate-x-1 group-hover:text-[#d95c47]" />
                    </div>
                  );
                })}
              </div>
            </section>

            <footer className="flex flex-col gap-4 pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <p>Important moments, made actionable.</p>
              <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.12em]">
                <span>Foundation shell</span>
                <span className="size-1 rounded-full bg-[#f2775e]" />
                <span>Ready to extend</span>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Home;
import { Metadata } from 'next';
import { Suspense } from 'react';
import { ToolsPageClient } from './ToolsPageClient';

export const metadata: Metadata = {
  title: 'AI Tools Directory - Discover the Best AI Tools',
  description: 'Explore and discover the best AI tools for writing, coding, design, marketing, productivity, and more. Search, filter, and compare 100+ AI tools.',
};

function ToolsPageSuspense() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-8">
          <div className="h-8 w-1/2 rounded bg-white/5" />
          <div className="h-48 rounded-lg bg-white/5" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]" />
                  <div className="h-6 w-6 rounded-lg bg-white/5" />
                </div>
                <div className="mt-5 space-y-3">
                  <div className="h-4 w-3/4 rounded bg-white/5" />
                  <div className="h-3 w-1/2 rounded bg-white/5" />
                  <div className="h-12 w-full rounded bg-white/5" />
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <div className="h-4 w-20 rounded bg-white/5" />
                  <div className="h-8 w-24 rounded bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    }>
      <ToolsPageClient />
    </Suspense>
  );
}

export default function ToolsPage() {
  return <ToolsPageSuspense />;
}
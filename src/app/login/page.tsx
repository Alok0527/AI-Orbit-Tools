import { Suspense } from 'react';
import { LoginPageClient } from './LoginPageClient';

function LoginPageFallback() {
  return (
    <div className="min-h-screen bg-black text-white animate-pulse">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-md mx-auto space-y-6">
          <div className="h-8 w-1/2 rounded bg-white/5" />
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 space-y-4">
            <div className="h-10 rounded bg-white/5" />
            <div className="h-10 rounded bg-white/5" />
            <div className="h-10 rounded bg-white/5" />
            <div className="h-12 rounded bg-white/5" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginPageClient />
    </Suspense>
  );
}
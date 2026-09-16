import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { CategoryPageClient } from './CategoryPageClient';
import prisma from '@/lib/prisma';
import { Category } from '@prisma/client';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug }
  });
  
  if (!category) {
    return { title: 'Category Not Found' };
  }

  return {
    title: `${category.name} AI Tools - AI Tools Directory`,
    description: category.description || `${category.name} AI Tools`,
  };
}

function CategoryPageSuspense({ category }: { category: Category }) {
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
      <CategoryPageClient category={category} />
    </Suspense>
  );
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug }
  });

  if (!category) {
    notFound();
  }

  return <CategoryPageSuspense category={category} />;
}
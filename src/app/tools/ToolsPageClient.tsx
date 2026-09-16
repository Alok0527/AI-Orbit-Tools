'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Filter, ChevronDown } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { ToolCard } from '@/components/ToolCard';
import { ToolSearchFilters } from '@/components/ToolSearchFilters';
import { Pagination } from '@/components/Pagination';
import { Button } from '@/components/ui/Button';
import { mockTools } from '@/data/tools';
import { Tool, ToolFilters, ToolListResponse } from '@/types/tool';
import { cn } from '@/lib/utils';

export function ToolsPageClient() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<ToolFilters>({
    sort: 'popular',
    page: 1,
    limit: 12,
    view: 'grid',
  });

  const fetchTools = useCallback(async (newFilters: ToolFilters) => {
    setIsLoading(true);
    setError(null);
    
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });

    try {
      const response = await fetch(`/api/tools?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch tools');
      const data: ToolListResponse = await response.json();
      setTools(data.tools);
      setTotal(data.total);
      setCurrentPage(data.page);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tools');
      setTools([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTools(filters);
  }, [filters, fetchTools]);

  const handleSearch = (newFilters: ToolFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
    setView(newFilters.view || 'grid');
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleViewChange = (newView: 'grid' | 'list') => {
    setView(newView);
    setFilters((prev) => ({ ...prev, view: newView }));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/50 mb-2">
            AI Tools Directory
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Discover the right
            <br />
            <span className="text-white/50">AI tools.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/60">
            Explore powerful AI tools for writing, coding, design, productivity, marketing and more.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-72 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <ToolSearchFilters
                initialFilters={filters}
                toolCount={total}
                onSearch={handleSearch}
              />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {error && (
              <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-400">
                {error}
              </div>
            )}

            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 animate-pulse">
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
                </motion.div>
              ) : tools.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-16"
                >
                  <Filter className="mx-auto h-12 w-12 text-white/20 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No tools found</h3>
                  <p className="text-white/50 mb-6">Try adjusting your search or filters</p>
                  <Button variant="outline" onClick={() => handleSearch({ search: undefined, category: undefined, pricing: undefined, rating: undefined, sort: 'popular' })}>
                    Clear all filters
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className={cn(
                      'gap-4',
                      view === 'grid' ? 'grid sm:grid-cols-2 lg:grid-cols-3' : 'flex flex-col'
                    )}
                    role="list"
                    aria-label="AI tools"
                  >
                    {tools.map((tool) => (
                      <ToolCard
                        key={tool.id}
                        tool={tool}
                        view={view}
                      />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
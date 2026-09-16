'use client';

import { Search, X, Filter, ChevronDown } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ToolFilters, PricingType, SortOption } from '@/types/tool';
import { cn } from '@/lib/utils';

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'writing', label: 'Writing' },
  { value: 'coding', label: 'Coding' },
  { value: 'design', label: 'Design' },
  { value: 'image', label: 'Image' },
  { value: 'video', label: 'Video' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'productivity', label: 'Productivity' },
  { value: 'research', label: 'Research' },
  { value: 'audio', label: 'Audio' },
  { value: 'education', label: 'Education' },
];

const pricingOptions: { value: PricingType; label: string }[] = [
  { value: 'free', label: 'Free' },
  { value: 'freemium', label: 'Freemium' },
  { value: 'paid', label: 'Paid' },
  { value: 'enterprise', label: 'Enterprise' },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'name', label: 'A-Z' },
  { value: 'newest', label: 'Newest' },
];

const ratingOptions = [
  { value: '', label: 'Any Rating' },
  { value: '4.5', label: '4.5+' },
  { value: '4', label: '4.0+' },
  { value: '3', label: '3.0+' },
];

export function ToolSearchFilters({
  initialFilters,
  toolCount,
  onSearch,
}: {
  initialFilters: ToolFilters;
  toolCount: number;
  onSearch: (filters: ToolFilters) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(initialFilters.search || '');
  const [category, setCategory] = useState(initialFilters.category || '');
  const [pricing, setPricing] = useState<PricingType | ''>(initialFilters.pricing || '');
  const [rating, setRating] = useState(initialFilters.rating?.toString() || '');
  const [sort, setSort] = useState<SortOption>(initialFilters.sort || 'popular');
  const [view, setView] = useState<'grid' | 'list'>(initialFilters.view || 'grid');
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = category || pricing || rating || search;

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const filters: ToolFilters = {
      search: search || undefined,
      category: category || undefined,
      pricing: pricing || undefined,
      rating: rating ? parseFloat(rating) : undefined,
      sort,
      view,
      page: 1,
    };
    onSearch(filters);
  }, [search, category, pricing, rating, sort, view, onSearch]);

  const clearFilters = useCallback(() => {
    setSearch('');
    setCategory('');
    setPricing('');
    setRating('');
    setSort('popular');
    onSearch({ sort: 'popular', view, page: 1 });
  }, [view, onSearch]);

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search AI tools by name, description, or tags..."
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-12 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent"
            aria-label="Search AI tools"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
              aria-label="Clear search"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3" role="group" aria-label="Filter and sort options">
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={categories}
            placeholder="All Categories"
            className="w-full sm:w-48"
            aria-label="Filter by category"
          />

          <Select
            value={pricing}
            onChange={(e) => setPricing(e.target.value as PricingType)}
            options={pricingOptions}
            placeholder="All Pricing"
            className="w-full sm:w-40"
            aria-label="Filter by pricing"
          />

          <Select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            options={ratingOptions}
            placeholder="Any Rating"
            className="w-full sm:w-36"
            aria-label="Filter by minimum rating"
          />

          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            options={sortOptions}
            className="w-full sm:w-40"
            aria-label="Sort by"
          />

          <div className="flex items-center gap-2 ml-auto" role="group" aria-label="View options">
            <button
              type="button"
              onClick={() => setView('grid')}
              className={cn(
                'p-2 rounded-lg transition-colors',
                view === 'grid' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'
              )}
              aria-label="Grid view"
              aria-pressed={view === 'grid'}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setView('list')}
              className={cn(
                'p-2 rounded-lg transition-colors',
                view === 'list' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'
              )}
              aria-label="List view"
              aria-pressed={view === 'list'}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {hasActiveFilters && (
            <Button type="button" variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </form>

      <div className="flex items-center justify-between border-t border-white/10 pt-4">
        <p className="text-sm text-white/50">
          {toolCount} {toolCount === 1 ? 'tool' : 'tools'} found
        </p>
      </div>
    </div>
  );
}
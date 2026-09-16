'use client';

import Link from 'next/link';
import { Star, Heart, ExternalLink, Tag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Tool, PricingType } from '@/types/tool';
import { cn, getPricingColor, getPricingLabel } from '@/lib/utils';
import Image from 'next/image';

interface ToolCardProps {
  tool: Tool;
  view?: 'grid' | 'list';
  onSave?: (toolId: string) => void;
  isSaved?: boolean;
}

import { useState } from 'react';

export function ToolCard({ tool, view = 'grid', onSave, isSaved }: ToolCardProps) {
  const isGrid = view === 'grid';
  const [imgError, setImgError] = useState(false);

  return (
    <article
      className={cn(
        'group relative rounded-2xl border border-white/10 bg-white/[0.03] transition-all',
        'hover:border-white/20 hover:bg-white/[0.05]',
        isGrid ? 'p-5 flex flex-col' : 'p-4 flex items-center gap-4'
      )}
    >
      <div className={cn(
        'flex items-start justify-between',
        isGrid ? 'mb-4' : 'w-full max-w-xs'
      )}>
        <div className="flex items-center gap-3">
          {tool.logo && !imgError ? (
            <Image
              src={tool.logo}
              alt={tool.name}
              width={40}
              height={40}
              className="rounded-xl"
              sizes="40px"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-lg font-semibold">
              {tool.name.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-semibold truncate">{tool.name}</h3>
            <p className="text-xs text-white/40">{tool.category}</p>
          </div>
        </div>
        {onSave && (
          <button
            onClick={() => onSave(tool.id)}
            className={cn(
              'p-1.5 rounded-lg transition-colors',
              'hover:bg-white/10',
              isSaved ? 'text-yellow-400' : 'text-white/40 hover:text-white'
            )}
            aria-label={isSaved ? 'Remove from saved' : 'Save tool'}
            aria-pressed={isSaved}
          >
            <Heart className={cn('h-5 w-5', isSaved ? 'fill-current' : '')} />
          </button>
        )}
      </div>

      <p className={cn('text-sm leading-6 text-white/55', isGrid ? 'mb-4 flex-1' : 'mb-0 flex-1 min-w-0')}>
        {tool.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4" aria-label="Tags">
        {tool.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-xs text-white/50"
          >
            <Tag className="h-3 w-3" />
            {tag}
          </span>
        ))}
        {tool.tags.length > 4 && (
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-xs text-white/40">
            +{tool.tags.length - 4}
          </span>
        )}
      </div>

      <div className={cn(
        'flex items-center justify-between border-t border-white/10 pt-4',
        isGrid ? 'mt-auto' : 'w-full max-w-md ml-auto'
      )}>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-sm text-white/60">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            {tool.rating.toFixed(1)}
            <span className="text-white/30">({tool.reviewCount})</span>
          </span>
          <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', getPricingColor(tool.pricing))}>
            {getPricingLabel(tool.pricing)}
          </span>
        </div>
        <Link
          href={`/tools/${tool.slug}`}
          className={cn(
            'text-sm font-medium text-white/70 transition-colors hover:text-white',
            isGrid ? 'group-hover:underline' : 'whitespace-nowrap'
          )}
        >
          View tool →
        </Link>
      </div>
    </article>
  );
}
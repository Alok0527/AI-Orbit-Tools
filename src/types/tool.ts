export interface Tool {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription?: string;
  category: string;
  pricing: PricingType;
  rating: number;
  reviewCount: number;
  logo?: string;
  website?: string;
  features: string[];
  tags: string[];
  screenshots: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type PricingType = 'free' | 'freemium' | 'paid' | 'enterprise';

export interface ToolFilters {
  search?: string;
  category?: string;
  pricing?: PricingType;
  rating?: number;
  sort?: SortOption;
  page?: number;
  limit?: number;
  view?: 'grid' | 'list';
}

export type SortOption = 'popular' | 'rating' | 'name' | 'newest';

export interface ToolListResponse {
  tools: Tool[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ToolCardProps {
  tool: Tool;
  view?: 'grid' | 'list';
  onSave?: (toolId: string) => void;
  isSaved?: boolean;
}

import { Review } from './review';

export interface ToolDetailProps {
  tool: Tool;
  reviews?: Review[];
  similarTools?: Tool[];
  userReview?: Review | null;
}
import { Tool, ToolFilters } from './tool';

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  toolCount: number;
  createdAt: Date;
}

export interface CategoryPageProps {
  category: Category;
  tools: Tool[];
  total: number;
  filters: ToolFilters;
}
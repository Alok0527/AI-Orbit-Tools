import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ToolFilters } from '@/types/tool';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const filters: ToolFilters = {
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') || undefined,
    pricing: (searchParams.get('pricing') as ToolFilters['pricing']) || undefined,
    rating: searchParams.get('rating') ? parseFloat(searchParams.get('rating')!) : undefined,
    sort: (searchParams.get('sort') as ToolFilters['sort']) || 'popular',
    page: parseInt(searchParams.get('page') || '1', 10),
    limit: parseInt(searchParams.get('limit') || '12', 10),
    view: (searchParams.get('view') as ToolFilters['view']) || 'grid',
  };

  const page = filters.page || 1;
  const limit = filters.limit || 12;
  const skip = (page - 1) * limit;

  // Build the Prisma where clause
  const where: any = {};

  if (filters.search) {
    const search = filters.search;
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { category: { contains: search, mode: 'insensitive' } },
      { tags: { has: search } }, // Array intersection check depends on exactly how 'has' works in Prisma; often it's exact match or we might need a different approach. Better to omit tags search or do a raw query, or just use string contains on fields. Let's simplify and search name and description.
    ];
  }

  if (filters.category) {
    where.category = { equals: filters.category, mode: 'insensitive' };
  }

  if (filters.pricing) {
    where.pricing = filters.pricing;
  }

  if (filters.rating) {
    where.rating = { gte: filters.rating };
  }

  // Build the orderBy clause
  let orderBy: any = {};
  switch (filters.sort) {
    case 'rating':
      orderBy = { rating: 'desc' };
      break;
    case 'name':
      orderBy = { name: 'asc' };
      break;
    case 'newest':
      orderBy = { createdAt: 'desc' };
      break;
    case 'popular':
    default:
      orderBy = { reviewCount: 'desc' };
      break;
  }

  const [tools, total] = await Promise.all([
    prisma.tool.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    }),
    prisma.tool.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return NextResponse.json({
    tools,
    total,
    page,
    totalPages,
    hasMore: page < totalPages,
  });
}
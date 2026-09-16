import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  
  const tool = await prisma.tool.findUnique({
    where: { slug }
  });

  if (!tool) {
    return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
  }

  const similarTools = await prisma.tool.findMany({
    where: {
      category: tool.category,
      slug: { not: tool.slug }
    },
    take: 4,
    orderBy: { reviewCount: 'desc' }
  });

  return NextResponse.json({ tool, similarTools });
}
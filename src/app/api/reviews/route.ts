import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const reviewSchema = z.object({
  toolId: z.string(),
  rating: z.number().min(1).max(5),
  content: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const toolId = searchParams.get('toolId');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  if (!toolId) {
    return NextResponse.json({ error: 'toolId required' }, { status: 400 });
  }

  const [reviews, total, distribution] = await Promise.all([
    prisma.review.findMany({
      where: { toolId },
      include: { user: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.review.count({ where: { toolId } }),
    prisma.review.groupBy({
      by: ['rating'],
      where: { toolId },
      _count: { rating: true },
    }),
  ]);

  const ratingDist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  distribution.forEach((d) => {
    ratingDist[d.rating as keyof typeof ratingDist] = d._count.rating;
  });

  return NextResponse.json({
    reviews,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    distribution: ratingDist,
  });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { toolId, rating, content } = reviewSchema.parse(body);

    const existing = await prisma.review.findUnique({
      where: { toolId_userId: { toolId, userId: session.user.id } },
    });

    if (existing) {
      return NextResponse.json({ error: 'Already reviewed this tool' }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        toolId,
        userId: session.user.id,
        rating,
        content,
      },
      include: { user: { select: { id: true, name: true, image: true } } },
    });

    await updateToolRating(toolId);

    return NextResponse.json({ review });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}

async function updateToolRating(toolId: string) {
  const stats = await prisma.review.aggregate({
    where: { toolId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.tool.update({
    where: { id: toolId },
    data: {
      rating: stats._avg.rating || 0,
      reviewCount: stats._count.rating,
    },
  });
}
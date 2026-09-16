import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const submissionSchema = z.object({
  name: z.string().min(1).max(100),
  website: z.string().url().optional().or(z.literal('')),
  description: z.string().min(10).max(2000),
  category: z.string().min(1),
  pricing: z.enum(['free', 'freemium', 'paid', 'enterprise']),
  tags: z.string().optional(),
  logoUrl: z.string().url().optional().or(z.literal('')),
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = submissionSchema.parse(body);

    const submission = await prisma.toolSubmission.create({
      data: {
        name: data.name,
        website: data.website || null,
        description: data.description,
        category: data.category,
        pricing: data.pricing,
        tags: data.tags ? data.tags.split(',').map((t) => t.trim()) : [],
        logoUrl: data.logoUrl || null,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ submission });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to submit tool' }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const submissions = await prisma.toolSubmission.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ submissions });
}
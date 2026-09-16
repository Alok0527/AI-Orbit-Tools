import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ savedTools: [] });
  }

  const savedTools = await prisma.savedTool.findMany({
    where: { userId: session.user.id },
    include: { tool: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ savedTools });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { toolId } = await request.json();
    
    const saved = await prisma.savedTool.upsert({
      where: {
        toolId_userId: {
          toolId,
          userId: session.user.id,
        },
      },
      update: {},
      create: {
        toolId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ saved });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save tool' }, { status: 500 });
  }
}
import { Navbar } from '@/components/Navbar';
import { ToolCard } from '@/components/ToolCard';
import { Tool } from '@/types/tool';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function SavedToolsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/tools/saved');
  }

  const savedTools = await prisma.savedTool.findMany({
    where: { userId: session.user.id },
    include: { tool: true },
    orderBy: { createdAt: 'desc' },
  });

  const tools: Tool[] = savedTools.map((st) => st.tool).filter(Boolean) as Tool[];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Saved Tools</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/60">
            Your bookmarked AI tools for quick access.
          </p>
        </div>

        {tools.length === 0 ? (
          <div className="text-center py-16">
            <svg className="mx-auto h-16 w-16 text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h3 className="text-lg font-medium mb-2">No saved tools yet</h3>
            <p className="text-white/50 mb-6">Start exploring and save tools you like</p>
            <a href="/tools">
              <button className="rounded-lg bg-white px-6 py-3 text-sm font-medium text-black hover:bg-white/90 transition">
                Browse Tools
              </button>
            </a>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Saved tools">
            {tools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                view="grid"
                isSaved={true}
                onSave={() => {}}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
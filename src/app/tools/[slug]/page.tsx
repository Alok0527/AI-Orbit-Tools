import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ToolDetailClient } from './ToolDetailClient';
import { mockTools } from '@/data/tools';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = mockTools.find((t) => t.slug === slug);
  
  if (!tool) {
    return { title: 'Tool Not Found' };
  }

  return {
    title: `${tool.name} - AI Tools Directory`,
    description: tool.description,
    openGraph: {
      title: tool.name,
      description: tool.description,
      type: 'website',
    },
  };
}

export default async function ToolDetailPage({ params }: Props) {
  const { slug } = await params;
  const tool = mockTools.find((t) => t.slug === slug);

  if (!tool) {
  notFound();
  return null;
}

  return <ToolDetailClient tool={tool!} />;
}
export interface Category {
  slug: string;
  name: string;
  description: string;
  toolCount: number;
}

export const categories: Category[] = [
  {
    slug: 'writing',
    name: 'Writing',
    description: 'AI writing assistants, copywriting, and content creation tools to help you write better and faster.',
    toolCount: 3,
  },
  {
    slug: 'coding',
    name: 'Coding',
    description: 'AI-powered code editors, assistants, and development tools for faster software development.',
    toolCount: 5,
  },
  {
    slug: 'design',
    name: 'Design',
    description: 'AI design tools for graphics, UI/UX, presentations, and creative work.',
    toolCount: 2,
  },
  {
    slug: 'image',
    name: 'Image',
    description: 'AI image generation, editing, and enhancement tools for creators and designers.',
    toolCount: 3,
  },
  {
    slug: 'video',
    name: 'Video',
    description: 'AI video creation, editing, and avatar tools for content creators and teams.',
    toolCount: 3,
  },
  {
    slug: 'marketing',
    name: 'Marketing',
    description: 'AI marketing tools for copywriting, SEO, social media, and campaign automation.',
    toolCount: 2,
  },
  {
    slug: 'productivity',
    name: 'Productivity',
    description: 'AI productivity tools for meetings, notes, presentations, and workflow automation.',
    toolCount: 5,
  },
  {
    slug: 'research',
    name: 'Research',
    description: 'AI research assistants, search engines, and knowledge discovery platforms.',
    toolCount: 2,
  },
  {
    slug: 'audio',
    name: 'Audio',
    description: 'AI voice synthesis, text-to-speech, and audio editing tools.',
    toolCount: 1,
  },
  {
    slug: 'education',
    name: 'Education',
    description: 'AI tools for learning, tutoring, and educational content creation.',
    toolCount: 1,
  },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getAllCategorySlugs() {
  return categories.map((c) => c.slug);
}
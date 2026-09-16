import { PrismaClient } from '@prisma/client';
import { mockTools, mockCategories } from '../src/data/tools';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  for (const category of mockCategories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: {
        slug: category.slug,
        name: category.name,
        description: category.description,
        toolCount: category.toolCount,
      },
    });
  }
  console.log('Categories seeded.');

  for (const tool of mockTools) {
    await prisma.tool.upsert({
      where: { slug: tool.slug },
      update: { logo: tool.logo },
      create: {
        slug: tool.slug,
        name: tool.name,
        description: tool.description,
        longDescription: tool.longDescription,
        category: tool.category,
        pricing: tool.pricing,
        rating: tool.rating,
        reviewCount: tool.reviewCount,
        logo: tool.logo,
        website: tool.website,
        features: tool.features,
        tags: tool.tags,
        screenshots: tool.screenshots,
        createdAt: tool.createdAt,
        updatedAt: tool.updatedAt,
      },
    });
  }
  console.log('Tools seeded.');

  const hashedPassword = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
    },
  });
  console.log('Test user seeded.');
}

main().catch(console.error).finally(() => prisma.$disconnect());

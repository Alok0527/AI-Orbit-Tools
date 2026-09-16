const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
(async () => {
  const counts = {
    users: await p.user.count(),
    tools: await p.tool.count(),
    categories: await p.category.count(),
    reviews: await p.review.count(),
    savedTools: await p.savedTool.count(),
    submissions: await p.toolSubmission.count(),
  };
  console.log(JSON.stringify(counts, null, 2));
  const tools = await p.tool.findMany({ take: 3, select: { name: true, slug: true, category: true } });
  const cats = await p.category.findMany({ take: 5 });
  console.log('categories:', JSON.stringify(cats));
  console.log('sample tools:', JSON.stringify(tools));
})()
  .catch((e) => { console.error('ERR', e.message); process.exitCode = 1; })
  .finally(() => p.$disconnect());
const fs = require('fs');
const path = require('path');
const tools = [
  'chatgpt', 'claude', 'cursor', 'midjourney', 'perplexity',
  'runway', 'canva', 'copy-ai', 'elevenlabs', 'notion-ai',
  'github-copilot', 'gemini', 'ideogram', 'descript', 'jasper',
  'grammarly', 'otter', 'gamma', 'v0', 'replit',
  'fireflies', 'synthesia', 'stable-diffusion', 'hugging-face', 'langchain'
];
const dir = path.join(process.cwd(), 'public', 'tools');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
const colors = [
  ['#4F46E5', '#7C3AED'], ['#2563EB', '#3B82F6'], ['#059669', '#10B981'],
  ['#D97706', '#F59E0B'], ['#DC2626', '#EF4444'], ['#7C3AED', '#DB2777'],
  ];
tools.forEach((slug, i) => {
  const name = slug.replace(/-/g, ' ');
  const initial = name.charAt(0).toUpperCase();
  const [c1, c2] = colors[i % colors.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${c1}" /><stop offset="100%" stop-color="${c2}" /></linearGradient></defs><rect width="100" height="100" rx="20" fill="url(#g)" /><text x="50" y="50" font-family="Arial, sans-serif" font-size="50" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">${initial}</text></svg>`;
  fs.writeFileSync(path.join(dir, slug + '.svg'), svg);
});
console.log('Created SVGs');
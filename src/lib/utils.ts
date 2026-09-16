import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

export function getPricingColor(pricing: string): string {
  switch (pricing) {
    case 'free':
      return 'text-green-400 bg-green-400/10';
    case 'freemium':
      return 'text-blue-400 bg-blue-400/10';
    case 'paid':
      return 'text-purple-400 bg-purple-400/10';
    case 'enterprise':
      return 'text-orange-400 bg-orange-400/10';
    default:
      return 'text-white/50 bg-white/5';
  }
}

export function getPricingLabel(pricing: string): string {
  switch (pricing) {
    case 'free':
      return 'Free';
    case 'freemium':
      return 'Freemium';
    case 'paid':
      return 'Paid';
    case 'enterprise':
      return 'Enterprise';
    default:
      return pricing;
  }
}
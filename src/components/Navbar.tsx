'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Menu, X, User, LogOut, Bookmark, Plus } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/tools', label: 'Tools' },
    { href: '/tools/category/writing', label: 'Writing' },
    { href: '/tools/category/coding', label: 'Coding' },
    { href: '/tools/category/design', label: 'Design' },
    { href: '/tools/category/marketing', label: 'Marketing' },
  ];

  return (
    <nav className="border-b border-white/10 sticky top-0 z-50 bg-black/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/tools" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black font-bold text-lg">
            A
          </div>
          <span className="hidden font-semibold tracking-tight sm:block">AIORBIT</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm text-white/70 transition-colors rounded-lg hover:text-white hover:bg-white/5"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {status === 'loading' ? (
            <div className="h-10 w-24 animate-pulse rounded-lg bg-white/10" />
          ) : session ? (
            <>
              <Link href="/tools/saved">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Bookmark className="h-4 w-4" />
                  <span className="hidden sm:inline">Saved</span>
                </Button>
              </Link>
              <Link href="/tools/submit">
                <Button variant="primary" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Submit Tool</span>
                </Button>
              </Link>
              <div className="relative">
                <Button variant="ghost" size="sm" className="gap-2 h-10 px-3">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline max-w-[120px] truncate">{session.user?.name || session.user?.email}</span>
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary" size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 text-white/70 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 py-4 px-4">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm text-white/70 transition-colors rounded-lg hover:text-white hover:bg-white/5"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
              <Link href="/tools/saved" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="justify-start gap-2">
                  <Bookmark className="h-4 w-4" />
                  Saved Tools
                </Button>
              </Link>
              <Link href="/tools/submit" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" className="justify-start gap-2">
                  <Plus className="h-4 w-4" />
                  Submit Tool
                </Button>
              </Link>
              {session ? (
                <Button variant="outline" onClick={() => signOut({ callbackUrl: '/tools' })} className="justify-start gap-2">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center">Sign In</Button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" className="w-full justify-center">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
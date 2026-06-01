'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function BotanicalHeader() {
  const pathname = usePathname();
  const { user, isAuthenticated, isOrganizer, isGuest, logout } = useAuth();

  const organizerLinks = [
    { href: '/host', label: 'Setup' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/postwedding', label: 'Album' },
  ];

  const guestLinks = [
    { href: '/guestdashboard', label: 'Dashboard' },
    { href: '/postwedding', label: 'Album' },
    { href: '/rsvp', label: 'RSVP' },
  ];

  const navLinks = isOrganizer ? organizerLinks : isGuest ? guestLinks : [];
  const isActive = (href) => pathname === href;

  return (
    <motion.header
      className="header-ethnic"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full bg-ethnic-gradient flex items-center justify-center shadow-md ring-2 ring-ethnic-gold/50">
            <span className="text-white text-sm font-serif font-bold">V</span>
          </div>
          <span className="text-xl font-serif font-semibold text-foreground group-hover:text-primary transition-colors tracking-tight">
            vowly
          </span>
        </Link>

        {isAuthenticated && navLinks.length > 0 && (
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="hidden md:inline text-sm text-muted-foreground font-medium">
                {user?.name}
              </span>
              <motion.button
                onClick={logout}
                className="btn-botanical-outline text-sm py-2 px-4"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Logout</span>
              </motion.button>
            </>
          ) : (
            <Link href="/auth/organizer">
              <motion.button
                className="btn-botanical text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  );
}

export function BotanicalFooter() {
  return (
    <footer className="footer-ethnic">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-full bg-ethnic-gradient flex items-center justify-center ring-2 ring-ethnic-gold/60">
                <span className="text-white text-sm font-serif font-bold">V</span>
              </div>
              <span className="text-xl font-serif font-semibold tracking-tight text-primary-foreground">
                vowly
              </span>
            </Link>
            <p className="text-sm text-primary-foreground/80 max-w-xs leading-relaxed">
              Celebrate every ritual from Mehendi to Vidai. Plan your Indian wedding with warmth, colour, and AI-powered ease.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-4 text-sm uppercase tracking-wider text-ethnic-gold">
              For Organizers
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/auth/organizer" className="text-sm text-primary-foreground/75 hover:text-ethnic-gold transition-colors">
                  Get Started
                </Link>
              </li>
              <li>
                <Link href="/host" className="text-sm text-primary-foreground/75 hover:text-ethnic-gold transition-colors">
                  Create Wedding
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-primary-foreground/75 hover:text-ethnic-gold transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4 text-sm uppercase tracking-wider text-ethnic-gold">
              For Guests
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/auth/guest" className="text-sm text-primary-foreground/75 hover:text-ethnic-gold transition-colors">
                  Guest Login
                </Link>
              </li>
              <li>
                <Link href="/rsvp" className="text-sm text-primary-foreground/75 hover:text-ethnic-gold transition-colors">
                  RSVP
                </Link>
              </li>
              <li>
                <Link href="/guestdashboard" className="text-sm text-primary-foreground/75 hover:text-ethnic-gold transition-colors">
                  Guest Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-ethnic-gold/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-primary-foreground/60">
            &copy; 2026 Vowly. Crafted for Indian celebrations.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-primary-foreground/60 hover:text-ethnic-gold transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-primary-foreground/60 hover:text-ethnic-gold transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

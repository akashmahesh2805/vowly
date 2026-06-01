'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { 
  Heart, ArrowRight, Loader2, Calendar, 
  Sparkles, Camera, Mail, Lock, User, PartyPopper
} from 'lucide-react';

const features = [
  { icon: Calendar, title: 'View Schedule', desc: 'Access the complete event timeline' },
  { icon: Sparkles, title: 'AI Day Planner', desc: 'Get personalized suggestions for the celebration' },
  { icon: Camera, title: 'Photo Album', desc: 'View and share wedding memories' },
  { icon: PartyPopper, title: 'RSVP & More', desc: 'Confirm attendance and dietary preferences' },
];

function GuestAuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { login, signup, isAuthenticated, isGuest } = useAuth();

  const initialMode = searchParams.get('mode') === 'login' ? 'login' : 'signup';
  const [mode, setMode] = useState(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && isGuest) {
      router.push('/guestdashboard');
    }
  }, [isAuthenticated, isGuest, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        if (!formData.name.trim()) {
          throw new Error('Name is required');
        }
        await signup(formData.email, formData.password, formData.name, 'guest');
        toast({ title: 'Welcome to Vowly!', description: 'Your guest account has been created.' });
      } else {
        await login(formData.email, formData.password, 'guest');
        toast({ title: 'Welcome back!', description: 'You have been logged in successfully.' });
      }
      router.push('/guestdashboard');
    } catch (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  return (
    <div className="min-h-screen bg-background flex ethnic-pattern">
      {/* Left Panel - Features */}
      <motion.div 
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-ethnic-saffron/15 via-secondary to-background p-12 flex-col justify-center border-r border-ethnic-gold/30"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-md mx-auto">
          <Link href="/" className="flex items-center gap-2.5 mb-12">
            <div className="w-10 h-10 rounded-full bg-ethnic-gradient flex items-center justify-center shadow-md">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-2xl font-serif font-medium tracking-tight">vowly</span>
          </Link>

          <h2 className="text-3xl font-serif font-normal mb-4">
            Join the
            <br />
            <span className="italic text-gradient-ethnic">celebration</span>
          </h2>
          <p className="text-muted-foreground mb-10">
            Access everything you need as a wedding guest.
          </p>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <div className="w-10 h-10 rounded-lg bg-ethnic-saffron/25 border border-ethnic-gold/30 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right Panel - Auth Form */}
      <motion.div 
        className="w-full lg:w-1/2 flex items-center justify-center p-8"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-full bg-ethnic-gradient flex items-center justify-center shadow-md">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-2xl font-serif font-medium tracking-tight">vowly</span>
          </div>

          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-3xl font-serif font-normal mb-2 text-center lg:text-left">
              {mode === 'signup' ? 'Create guest account' : 'Guest login'}
            </h1>
            <p className="text-muted-foreground mb-8 text-center lg:text-left">
              {mode === 'signup' 
                ? 'Sign up to access wedding details and RSVP' 
                : 'Sign in to view the celebration details'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <AnimatePresence mode="wait">
                {mode === 'signup' && (
                  <motion.div
                    key="name"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="name" className="text-sm font-medium">Your Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input-botanical pl-11"
                        required={mode === 'signup'}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-botanical pl-11"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder={mode === 'signup' ? 'Create a password (min 6 chars)' : 'Enter your password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="input-botanical pl-11"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                className="btn-botanical w-full justify-center py-4 text-base"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {mode === 'signup' ? 'Creating account...' : 'Signing in...'}
                  </>
                ) : (
                  <>
                    {mode === 'signup' ? 'Create Account' : 'Sign In'}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={toggleMode}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {mode === 'signup' 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Sign up"}
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                Planning a wedding?{' '}
                <Link href="/auth/organizer" className="text-primary hover:underline font-medium">
                  Organizer signup
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default function GuestAuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <GuestAuthContent />
    </Suspense>
  );
}

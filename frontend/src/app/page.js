'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Calendar, Users, Sparkles, Camera } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { BotanicalFooter } from '@/components/botanical/Layout';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

export default function Home() {
  const { isAuthenticated, isOrganizer, isGuest } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      if (isOrganizer) {
        router.push('/dashboard');
      } else if (isGuest) {
        router.push('/guestdashboard');
      }
    }
  }, [isAuthenticated, isOrganizer, isGuest, router]);

  const features = [
    { icon: Calendar, title: 'Multi-Day Rituals', desc: 'Mehendi, Sangeet, Haldi, Wedding & Reception — all in one place', color: 'bg-ethnic-saffron/20 text-ethnic-maroon' },
    { icon: Users, title: 'Guest Management', desc: 'Track RSVPs, dietary preferences & accommodations across events', color: 'bg-primary/15 text-primary' },
    { icon: Sparkles, title: 'AI Shaadi Assistant', desc: 'Smart planning help tailored for Indian wedding operations', color: 'bg-ethnic-gold/25 text-ethnic-maroon' },
    { icon: Camera, title: 'Photo Album', desc: 'Share vibrant memories from every ceremony with your loved ones', color: 'bg-ethnic-teal/15 text-ethnic-teal' },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <motion.header
        className="header-ethnic"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-center">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-ethnic-gradient flex items-center justify-center shadow-md ring-2 ring-ethnic-gold/50">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-2xl font-serif font-semibold text-foreground tracking-tight">
              vowly
            </span>
          </Link>
        </div>
      </motion.header>

      <section className="relative min-h-screen flex items-center justify-center pt-20 hero-ethnic ethnic-pattern">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/6 w-72 h-72 rounded-full bg-ethnic-saffron/20 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/6 w-96 h-96 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute top-1/2 right-1/4 w-48 h-48 rounded-full bg-ethnic-gold/25 blur-2xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.p
              className="label-botanical mb-6"
              variants={fadeInUp}
            >
              भारतीय शादियों के लिए · Made for India
            </motion.p>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-serif font-normal leading-tight mb-6 text-foreground"
              variants={fadeInUp}
            >
              Plan your perfect
              <br />
              <span className="italic text-gradient-ethnic">Indian wedding</span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
              variants={fadeInUp}
            >
              From Mehendi to Vidai — manage guests, vendors, and multi-day celebrations with colour, culture, and AI-powered ease.
            </motion.p>
          </motion.div>

          <motion.div
            className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={scaleIn}>
              <Link href="/auth/organizer?mode=signup">
                <motion.button
                  className="group relative w-full md:w-auto px-8 py-4 btn-botanical text-base"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center gap-2 justify-center">
                    Get started as organizer
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </motion.button>
              </Link>
            </motion.div>

            <motion.div variants={scaleIn}>
              <Link href="/auth/organizer?mode=login">
                <motion.button
                  className="group w-full md:w-auto px-8 py-4 btn-botanical-outline text-base"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center gap-2 justify-center">
                    Continue as organizer
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </motion.button>
              </Link>
            </motion.div>

            <motion.div variants={scaleIn}>
              <Link href="/auth/guest">
                <motion.button
                  className="group w-full md:w-auto px-8 py-4 btn-botanical-outline text-base border-ethnic-saffron text-ethnic-maroon hover:bg-ethnic-saffron/20"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center gap-2 justify-center">
                    RSVP as a guest
                    <Heart className="w-5 h-5 transition-transform group-hover:scale-110 text-ethnic-saffron fill-ethnic-saffron" />
                  </span>
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-secondary/50 ethnic-pattern border-y border-ethnic-gold/20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
          >
            <p className="label-botanical mb-4">Features</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-normal mb-4">
              Everything for your
              <br />
              <span className="italic text-primary">shaadi &amp; sanskaar</span>
            </h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group p-6 card-botanical card-botanical-hover"
                whileHover={{ y: -4 }}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-medium mb-2 text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 hero-ethnic">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-normal mb-6">
              Ready to celebrate with
              <br />
              <span className="italic text-gradient-ethnic">joy &amp; tradition?</span>
            </h2>
            <p className="text-muted-foreground mb-10 max-w-lg mx-auto">
              Whether it is an intimate ceremony or a grand baraat, Vowly brings the colours of India to your wedding planning.
            </p>
            <Link href="/auth/organizer?mode=signup">
              <motion.button
                className="group px-10 py-5 btn-botanical text-lg"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center gap-2">
                  Start planning for free
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      <BotanicalFooter />
    </div>
  );
}

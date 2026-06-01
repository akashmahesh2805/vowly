'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, ChevronRight, ChevronLeft, Sparkles, Calendar, Users, MessageCircle } from 'lucide-react';
import Link from 'next/link';

const ONBOARDING_STEPS = [
  {
    title: "Welcome! I'm Aarav",
    message: "Your AI Wedding Ops Assistant! I'll help you plan your perfect celebration. Let me show you around.",
    icon: Sparkles,
  },
  {
    title: "Create Your Wedding",
    message: "Start by setting up your wedding details - name, location, dates, and day-wise events like Mehendi, Sangeet, and the ceremony.",
    icon: Calendar,
  },
  {
    title: "Invite & Manage",
    message: "Send beautiful invitations, track RSVPs, manage dietary preferences, coordinate vendors, and I'll be here to assist with AI-powered insights!",
    icon: Users,
  },
];

export function ShaadiBot({ onDismiss, showOnboarding = true, variant = 'full' }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has seen onboarding
    const seen = localStorage.getItem('shaadi-onboarding-seen');
    if (seen) {
      setHasSeenOnboarding(true);
    } else {
      // Small delay for animation
      setTimeout(() => setIsVisible(true), 500);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('shaadi-onboarding-seen', 'true');
    setTimeout(() => {
      setHasSeenOnboarding(true);
      onDismiss?.();
    }, 300);
  };

  const handleGetStarted = () => {
    handleDismiss();
  };

  if (!showOnboarding || hasSeenOnboarding) {
    return null;
  }

  const step = ONBOARDING_STEPS[currentStep];
  const StepIcon = step.icon;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <Card className={`relative max-w-md mx-4 p-0 overflow-hidden border-2 border-primary/30 shadow-2xl transition-all duration-500 transform ${
        isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
      }`}>
        {/* Close button */}
        <button 
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Header with avatar */}
        <div className="bg-gradient-to-r from-ethnic-saffron/30 via-secondary to-ethnic-gold/20 p-6 pb-4 border-b border-ethnic-gold/30">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-ethnic-gradient flex items-center justify-center shadow-lg animate-float ring-2 ring-ethnic-gold/50">
                <span className="text-2xl">🤵</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-foreground">Aarav</h3>
              <p className="text-sm text-muted-foreground">Wedding Ops Assistant</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <StepIcon className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-serif text-lg font-semibold">{step.title}</h4>
          </div>
          
          <p className="text-muted-foreground leading-relaxed mb-6 min-h-[60px]">
            {step.message}
          </p>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {ONBOARDING_STEPS.map((_, index) => (
              <div 
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? 'w-8 bg-primary' 
                    : index < currentStep 
                      ? 'w-2 bg-primary/60' 
                      : 'w-2 bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>

            {currentStep === ONBOARDING_STEPS.length - 1 ? (
              <Link href="/host">
                <Button 
                  onClick={handleGetStarted}
                  className="gap-2 bg-primary hover:bg-primary/90"
                >
                  Get Started
                  <Sparkles className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <Button
                onClick={handleNext}
                className="gap-1 bg-primary hover:bg-primary/90"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Skip link */}
          <button 
            onClick={handleDismiss}
            className="w-full text-center mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip tour
          </button>
        </div>
      </Card>
    </div>
  );
}

// Mini bot that appears on pages as a helper
export function ShaadiMiniBot({ message, onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 300);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  return (
    <div 
      className={`fixed bottom-24 left-6 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <Card className="max-w-xs p-4 border-2 border-ethnic-gold/40 shadow-xl bg-card/95 backdrop-blur">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-ethnic-gradient flex items-center justify-center flex-shrink-0 animate-float">
            <span className="text-lg">🤵</span>
          </div>
          <div className="flex-1">
            <p className="text-sm text-foreground leading-relaxed">{message}</p>
          </div>
          <button 
            onClick={handleClose}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </Card>
    </div>
  );
}

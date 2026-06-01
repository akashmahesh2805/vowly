'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Calendar, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { BotanicalHeader, BotanicalFooter } from '@/components/botanical/Layout';
import { useAuth } from '@/context/AuthContext';

function RSVPContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8001';

  const weddingIdParam = searchParams.get('weddingId');

  const [wedding, setWedding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weddingId, setWeddingId] = useState(weddingIdParam || '');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [attendingDays, setAttendingDays] = useState([]);
  const [dietary, setDietary] = useState('veg');
  const [accommodation, setAccommodation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user?.email) setEmail(user.email);
    if (user?.name) setName(user.name);
  }, [user]);

  useEffect(() => {
    if (weddingIdParam) fetchWedding(weddingIdParam);
    else setLoading(false);
  }, [weddingIdParam]);

  const fetchWedding = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${backendUrl}/api/wedding/${id}`);
      if (!response.ok) throw new Error('Wedding not found');
      const data = await response.json();
      setWedding(data);
      setAttendingDays(new Array(data.days.length).fill(false));
    } catch (err) {
      setError('Wedding not found. Please check the link or enter a valid Wedding ID.');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchWedding = () => { if (weddingId.trim()) fetchWedding(weddingId.trim()); };
  const toggleDay = (index) => { const newDays = [...attendingDays]; newDays[index] = !newDays[index]; setAttendingDays(newDays); };

  const validateForm = () => {
    if (!name.trim()) return 'Name is required';
    if (!email.trim()) return 'Email is required';
    if (!email.includes('@')) return 'Please enter a valid email address';
    if (!attendingDays.some(d => d)) return 'Please select at least one day you will attend';
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) { toast({ title: 'Validation Error', description: validationError, variant: 'destructive' }); return; }
    setIsSubmitting(true);
    try {
      const response = await fetch(`${backendUrl}/api/guest/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weddingId: wedding?.id, name: name.trim(), email: email.trim(), attendingDays, dietary, accommodation }),
      });
      if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.detail || 'Failed to submit RSVP'); }
      setSubmitted(true);
      toast({ title: 'RSVP Submitted!', description: 'Thank you for your response. We look forward to celebrating with you!' });
    } catch (err) {
      toast({ title: 'Error', description: err.message || 'Failed to submit RSVP', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="page-shell">
        <BotanicalHeader />
        <main className="pt-24 pb-20 flex items-center justify-center min-h-[70vh]">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card-botanical max-w-md w-full mx-6 text-center">
            <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-serif mb-4">Thank You!</h2>
            <p className="text-muted-foreground mb-2">Your RSVP for <strong className="text-foreground">{wedding?.name}</strong> has been submitted.</p>
            <p className="text-sm text-muted-foreground mb-6">We&apos;re excited to celebrate with you!</p>
            <div className="flex flex-col gap-3">
              <Link href="/guestdashboard" className="btn-botanical inline-flex justify-center">Go to Guest Dashboard</Link>
              <Link href="/" className="btn-botanical-outline inline-flex justify-center">Back to Home</Link>
            </div>
          </motion.div>
        </main>
        <BotanicalFooter />
      </div>
    );
  }

  return (
    <div className="page-shell">
      <BotanicalHeader />

      <main className="pt-24 pb-20">
        <div className="max-w-xl mx-auto px-6">
          {/* Wedding Info Header */}
          {wedding && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
              <p className="label-botanical mb-3">You&apos;re Invited</p>
              <h1 className="text-4xl md:text-5xl font-serif mb-4">{wedding.name}</h1>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary" /> {wedding.location}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary" /> {wedding.startDate} - {wedding.endDate}</span>
              </div>
            </motion.div>
          )}

          {loading && (<div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>)}

          {/* No wedding ID */}
          {!loading && !wedding && !error && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-botanical">
              <p className="label-botanical mb-2">Find Your Wedding</p>
              <h2 className="text-2xl font-serif mb-6">Enter Wedding Details</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="weddingIdInput" className="text-sm font-medium">Wedding ID</Label>
                  <Input id="weddingIdInput" placeholder="Enter Wedding ID from your invitation" value={weddingId} onChange={(e) => setWeddingId(e.target.value)} className="input-botanical" />
                </div>
                <button onClick={handleFetchWedding} disabled={!weddingId.trim()} className="btn-botanical w-full justify-center">Find Wedding <ArrowRight className="w-4 h-4" /></button>
              </div>
            </motion.div>
          )}

          {/* Error state */}
          {error && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-botanical border-destructive/30">
              <p className="text-destructive text-center mb-6">{error}</p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="weddingIdInput" className="text-sm font-medium">Try Another Wedding ID</Label>
                  <Input id="weddingIdInput" placeholder="Enter Wedding ID" value={weddingId} onChange={(e) => setWeddingId(e.target.value)} className="input-botanical" />
                </div>
                <button onClick={handleFetchWedding} disabled={!weddingId.trim()} className="btn-botanical w-full justify-center">Find Wedding</button>
              </div>
            </motion.div>
          )}

          {/* RSVP Form */}
          {wedding && !loading && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-botanical">
              <h2 className="text-2xl font-serif mb-6">Your Details</h2>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                    <Input id="name" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} className="input-botanical" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
                    <Input id="email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="input-botanical" readOnly={!!user?.email} style={user?.email ? { backgroundColor: '#f5f5f5', cursor: 'not-allowed' } : {}} />
                    {user?.email && <p className="text-xs text-muted-foreground">Using your logged-in email</p>}
                  </div>
                </div>

                {/* Days Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Which days will you attend? *</Label>
                  <div className="space-y-2">
                    {wedding.days.map((day, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl border border-border hover:border-primary/30 transition-colors cursor-pointer" onClick={() => toggleDay(index)}>
                        <Checkbox id={`day-${index}`} checked={attendingDays[index]} onCheckedChange={() => toggleDay(index)} />
                        <div className="flex-1">
                          <p className="font-medium text-sm">Day {index + 1} - {day.date}</p>
                          <p className="text-xs text-muted-foreground">{day.events?.map(e => e.name).join(', ')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dietary */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Dietary Preference</Label>
                  <RadioGroup value={dietary} onValueChange={setDietary} className="flex flex-wrap gap-4">
                    {['veg', 'non-veg', 'jain', 'vegan'].map((option) => (
                      <div key={option} className="flex items-center gap-2">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className="text-sm capitalize cursor-pointer">{option.replace('-', ' ')}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Accommodation */}
                <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl border border-border">
                  <Checkbox id="accommodation" checked={accommodation} onCheckedChange={setAccommodation} />
                  <div>
                    <Label htmlFor="accommodation" className="font-medium cursor-pointer">I need accommodation</Label>
                    <p className="text-xs text-muted-foreground">Check if you&apos;ll need lodging during the event</p>
                  </div>
                </div>

                <button onClick={handleSubmit} disabled={isSubmitting} className="btn-botanical w-full justify-center py-4">
                  {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</> : <>Submit RSVP <ArrowRight className="w-5 h-5" /></>}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <BotanicalFooter />
    </div>
  );
}

export default function RSVPPage() {
  return (
    <Suspense fallback={
      <div className="page-shell flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <RSVPContent />
    </Suspense>
  );
}

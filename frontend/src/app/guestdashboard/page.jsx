'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useRequireAuth, useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Calendar, Clock, MapPin, Send, Loader2, User, X, MessageCircle, Lightbulb, PartyPopper, Bot, Camera } from 'lucide-react';
import { BotanicalHeader, BotanicalFooter } from '@/components/botanical/Layout';

function FormattedAIResponse({ text }) {
  const cleanedText = text.replace(/\*\*/g, '**').replace(/\n{3,}/g, '\n\n').replace(/^\s*[-•]\s*/gm, '• ').trim();
  return (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-4 mb-3 space-y-1">{children}</ul>,
          li: ({ children }) => <li className="text-sm">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
        }}
      >
        {cleanedText}
      </ReactMarkdown>
    </div>
  );
}

export default function GuestDashboardPage() {
  // Route protection - require guest auth
  const { loading: authLoading } = useRequireAuth('guest');
  const { user } = useAuth();
  
  const { toast } = useToast();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8001';
  const chatEndRef = useRef(null);

  const [weddings, setWeddings] = useState([]);
  const [selectedWeddingId, setSelectedWeddingId] = useState('');
  const [wedding, setWedding] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [suggestions, setSuggestions] = useState('');
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);

  useEffect(() => { const timer = setInterval(() => setCurrentTime(new Date()), 60000); return () => clearInterval(timer); }, []);
  useEffect(() => { if (user?.email) fetchWeddings(); }, [user?.email]);
  useEffect(() => { if (selectedWeddingId) fetchWeddingData(selectedWeddingId); }, [selectedWeddingId]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);

  const fetchWeddings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/guest/weddings?email=${encodeURIComponent(user.email)}`);
      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      setWeddings(data);
      if (data.length > 0) setSelectedWeddingId(data[0].id);
    } catch (err) { toast({ title: 'Error', description: 'Failed to load weddings.', variant: 'destructive' }); }
    finally { setIsLoading(false); }
  };

  const fetchWeddingData = async (weddingId) => {
    try {
      const response = await fetch(`${backendUrl}/api/wedding/${weddingId}`);
      if (!response.ok) throw new Error('Failed');
      const weddingData = await response.json();
      setWedding(weddingData);
      setSuggestions('');
      setChatMessages([]);
      fetchSuggestions(weddingId);
    } catch (err) { toast({ title: 'Error', description: 'Failed to load wedding.', variant: 'destructive' }); }
  };

  const fetchSuggestions = async (weddingId) => {
    setIsLoadingSuggestions(true);
    try {
      const response = await fetch(`${backendUrl}/api/ai/guest-day-suggestions`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weddingId, dayIndex: getTodayDayIndex() >= 0 ? getTodayDayIndex() : 0 }),
      });
      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      setSuggestions(data.result);
    } catch (err) { console.error(err); }
    finally { setIsLoadingSuggestions(false); }
  };

  const getTodayDate = () => currentTime.toISOString().split('T')[0];
  const getTodayDayIndex = () => { if (!wedding?.days) return -1; return wedding.days.findIndex(day => day.date === getTodayDate()); };
  const getTodayEvents = () => { if (!wedding?.days) return []; const idx = getTodayDayIndex(); if (idx >= 0) return wedding.days[idx].events || []; return wedding.days[0]?.events || []; };

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedWeddingId) return;
    const userMessage = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsSendingChat(true);
    try {
      const response = await fetch(`${backendUrl}/api/ai/chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weddingId: selectedWeddingId, message: userMessage, role: 'guest' }),
      });
      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.result }]);
    } catch (err) { setChatMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error.', isError: true }]); }
    finally { setIsSendingChat(false); }
  };

  const todayEvents = getTodayEvents();
  const todayIndex = getTodayDayIndex();
  const isWeddingDay = todayIndex >= 0;

  if (isLoading || authLoading) {
    return (
      <div className="page-shell"><BotanicalHeader />
        <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        <BotanicalFooter />
      </div>
    );
  }

  if (weddings.length === 0) {
    return (
      <div className="page-shell"><BotanicalHeader />
        <main className="pt-24 pb-20 text-center max-w-xl mx-auto px-6">
          <PartyPopper className="w-16 h-16 mx-auto text-muted-foreground/30 mb-6" />
          <h1 className="text-3xl font-serif mb-4">No Weddings Found</h1>
          <p className="text-muted-foreground mb-6">You haven&apos;t RSVPed for any weddings yet.</p>
          <Link href="/rsvp">
            <motion.button className="btn-botanical" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              RSVP for a Wedding
            </motion.button>
          </Link>
        </main>
        <BotanicalFooter />
      </div>
    );
  }

  return (
    <div className="page-shell">
      <BotanicalHeader />

      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <motion.div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div>
              <p className="label-botanical mb-2">Guest Portal</p>
              <h1 className="text-3xl md:text-4xl font-serif flex items-center gap-3">
                <PartyPopper className="w-8 h-8 text-primary" />
                {isWeddingDay ? 'Celebration Day!' : 'Welcome, Guest'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/postwedding">
                <motion.button
                  className="btn-botanical-outline text-sm"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Camera className="w-4 h-4" /> Album
                </motion.button>
              </Link>
              <Select value={selectedWeddingId} onValueChange={setSelectedWeddingId}>
                <SelectTrigger className="input-botanical w-full md:w-56">
                  <SelectValue placeholder="Select Wedding" />
                </SelectTrigger>
                <SelectContent>
                  {weddings.map((w) => (<SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Wedding Info */}
          {wedding && (
            <motion.div className="card-botanical mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h2 className="text-2xl font-serif font-medium mb-2">{wedding.name}</h2>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary" /> {wedding.location}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary" /> {wedding.startDate} - {wedding.endDate}</span>
              </div>
            </motion.div>
          )}

          {/* Today's Events */}
          <motion.div className="card-botanical mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="font-serif text-lg">{isWeddingDay ? 'Today\'s Events' : 'Upcoming Events'}</h3>
            </div>
            {todayEvents.length > 0 ? (
              <div className="space-y-3">
                {todayEvents.map((event, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl border border-border">
                    <div className="text-center bg-primary text-white px-3 py-2 rounded-lg text-sm font-medium min-w-[60px]">{event.time}</div>
                    <div>
                      <p className="font-medium">{event.name}</p>
                      <p className="text-sm text-muted-foreground">{event.venue}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-6">No events scheduled for today.</p>
            )}
          </motion.div>

          {/* AI Suggestions */}
          <motion.div className="card-botanical" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-primary" />
              <h3 className="font-serif text-lg">AI Tips for You</h3>
            </div>
            {isLoadingSuggestions ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
            ) : suggestions ? (
              <div className="p-4 bg-secondary/50 rounded-xl border border-border"><FormattedAIResponse text={suggestions} /></div>
            ) : (
              <p className="text-muted-foreground text-center py-6">Ask the AI assistant for tips!</p>
            )}
          </motion.div>
        </div>
      </main>

      {/* Chat FAB */}
      <motion.button onClick={() => setIsChatOpen(true)} className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-ethnic-gradient text-white flex items-center justify-center shadow-lg ring-2 ring-ethnic-gold/50 z-40" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Drawer */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="fixed inset-y-0 right-0 w-full md:w-96 bg-card border-l-2 border-ethnic-gold/40 shadow-2xl z-50 flex flex-col">
            <div className="p-4 border-b border-ethnic-gold/30 flex items-center justify-between bg-ethnic-gradient text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"><Bot className="w-5 h-5" /></div>
                <div><p className="font-medium">Guest Assistant</p><p className="text-xs text-white/70">Ask me anything!</p></div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/10 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-scrollbar">
              {chatMessages.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                  <Bot className="w-12 h-12 mx-auto mb-4 text-primary/30" />
                  <p>Hi! I&apos;m here to help you.</p>
                  <p className="text-sm">Ask about events, dress codes, or directions!</p>
                </div>
              )}
              {chatMessages.map((msg, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-white rounded-br-md' : 'bg-secondary text-foreground rounded-bl-md'}`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
              {isSendingChat && (<div className="flex justify-start"><div className="bg-secondary p-3 rounded-2xl rounded-bl-md"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div></div>)}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSendChat} className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask anything..." className="input-botanical flex-1" disabled={isSendingChat} />
                <button type="submit" disabled={isSendingChat || !chatInput.trim()} className="btn-botanical px-4"><Send className="w-4 h-4" /></button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <BotanicalFooter />
    </div>
  );
}

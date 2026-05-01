'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Calendar, Clock, X, Check, Loader2, ChevronRight } from 'lucide-react';

export default function ReservationSystem() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    guests: '2',
    date: '',
    time: '19:00',
    lastName: '',
    firstName: '',
    phone: '',
    email: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
          setIsSuccess(false);
        }, 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reservation" className="relative py-32 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-6 uppercase tracking-widest">Reservation</h2>
          <div className="w-24 h-1 bg-secondary mx-auto mb-8"></div>
          <p className="text-accent/60 uppercase tracking-[0.3em] text-xs">Book your table at Milano Marin</p>
        </div>

        {/* Main Entry Bar */}
        <div className="glass-card p-8 md:p-12 flex flex-col md:flex-row gap-8 items-end justify-between">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-secondary font-bold">
                <Users size={14} /> Guests
              </label>
              <select 
                value={formData.guests}
                onChange={(e) => setFormData({...formData, guests: e.target.value})}
                className="w-full bg-transparent border-b border-white/10 py-2 text-white focus:outline-none focus:border-secondary transition-colors cursor-pointer"
              >
                {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n} className="bg-deep-black">{n} {n === 1 ? 'Person' : 'People'}</option>)}
                <option value="9+" className="bg-deep-black">9+ People</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-secondary font-bold">
                <Calendar size={14} /> Date
              </label>
              <input 
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full bg-transparent border-b border-white/10 py-2 text-white focus:outline-none focus:border-secondary transition-colors"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-secondary font-bold">
                <Clock size={14} /> Time
              </label>
              <select 
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                className="w-full bg-transparent border-b border-white/10 py-2 text-white focus:outline-none focus:border-secondary transition-colors cursor-pointer"
              >
                {['11:30', '12:00', '12:30', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'].map(t => (
                  <option key={t} value={t} className="bg-deep-black">{t}</option>
                ))}
              </select>
            </div>
          </div>

          <button 
            onClick={() => setIsOpen(true)}
            className="w-full md:w-auto bg-secondary text-primary-dark px-12 py-4 uppercase tracking-[0.3em] text-xs font-bold hover:bg-white transition-all duration-500 shadow-xl"
          >
            Find a Table
          </button>
        </div>
      </div>

      {/* Slide-in Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 z-[100] backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full md:w-[500px] bg-deep-black border-l border-white/5 z-[101] shadow-2xl overflow-y-auto"
            >
              <div className="p-10">
                <div className="flex justify-between items-center mb-12">
                  <h3 className="text-2xl font-serif text-white uppercase tracking-widest">Details</h3>
                  <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40">Last Name *</label>
                      <input 
                        required
                        className="w-full bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-secondary"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40">First Name *</label>
                      <input 
                        required
                        className="w-full bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-secondary"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40">Phone *</label>
                    <input 
                      required
                      type="tel"
                      className="w-full bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-secondary"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40">Email *</label>
                    <input 
                      required
                      type="email"
                      className="w-full bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-secondary"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-white/40">Notes (Allergies, vegetarian, etc.)</label>
                    <textarea 
                      rows={4}
                      placeholder="Ex: No smoking area, vegetarian options..."
                      className="w-full bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-secondary resize-none"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    />
                  </div>

                  <div className="pt-6">
                    <button 
                      disabled={isSubmitting || isSuccess}
                      className="w-full bg-secondary text-primary-dark py-5 uppercase tracking-[0.4em] text-xs font-black flex items-center justify-center gap-3 hover:bg-white transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin" /> : isSuccess ? <Check /> : 'Confirm Reservation'}
                    </button>
                    {isSuccess && <p className="text-center text-secondary text-xs mt-4 animate-bounce">Reservation Successful!</p>}
                  </div>
                </form>

                <div className="mt-12 pt-12 border-t border-white/5 text-[10px] text-white/20 uppercase tracking-[0.2em] leading-loose text-center">
                  By confirming, you agree to our booking terms.<br />
                  A confirmation email will be sent shortly.
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}

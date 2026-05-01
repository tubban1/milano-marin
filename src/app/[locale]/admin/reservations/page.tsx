'use client';

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { Calendar as CalendarIcon, Users, Clock, Phone, Mail, FileText, Lock, RefreshCcw, LogOut } from 'lucide-react';

const fetcher = ([url, token]: [string, string]) => 
  fetch(url, { headers: { 'Authorization': token } }).then(res => res.json());

export default function AdminReservations() {
  const [token, setToken] = useState<string>('');
  const [isAuth, setIsAuth] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Auth check
  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    if (savedToken) {
      setToken(savedToken);
      setIsAuth(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (token === 'm1l4n0_marin_token_2026_xxyyzz') {
      localStorage.setItem('admin_token', token);
      setIsAuth(true);
    } else {
      alert('Invalid Token');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuth(false);
    setToken('');
  };

  // SWR for data fetching with 5 min refresh interval
  const { data: reservations, error, mutate, isLoading } = useSWR(
    isAuth ? [`/api/admin/reservations?date=${selectedDate}`, token] : null,
    fetcher,
    { refreshInterval: 300000, revalidateOnFocus: true }
  );

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-deep-black flex items-center justify-center px-6">
        <div className="glass-card p-10 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-secondary">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-serif text-white mb-8 uppercase tracking-widest">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="password"
              placeholder="Enter Admin Token"
              className="w-full bg-white/5 border border-white/10 p-4 text-white text-center focus:outline-none focus:border-secondary transition-all"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <button className="w-full bg-secondary text-primary-dark py-4 uppercase tracking-[0.3em] text-xs font-black hover:bg-white transition-all">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-black text-accent p-6 pt-24 md:p-12 md:pt-32">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-secondary flex items-center justify-center text-primary-dark rounded-sm">
              <CalendarIcon size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-serif text-white uppercase tracking-widest">Reservations</h1>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.2em]">Live Management System</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => mutate()}
              className="p-3 bg-white/5 border border-white/10 text-white/60 hover:text-secondary hover:border-secondary transition-all rounded-sm"
              title="Refresh Data"
            >
              <RefreshCcw size={18} className={isLoading ? 'animate-spin' : ''} />
            </button>
            <input 
              type="date"
              className="bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-secondary rounded-sm"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <button 
              onClick={handleLogout}
              className="p-3 text-white/30 hover:text-red-400 transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-6">
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Total Bookings</p>
            <p className="text-3xl font-serif text-white">{reservations?.length || 0}</p>
          </div>
          <div className="glass-card p-6 border-l-2 border-secondary">
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Total Guests</p>
            <p className="text-3xl font-serif text-secondary">
              {reservations?.reduce((acc: number, r: any) => acc + Number(r.guests), 0) || 0}
            </p>
          </div>
          <div className="glass-card p-6">
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Selected Date</p>
            <p className="text-3xl font-serif text-white">{selectedDate}</p>
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="py-20 text-center text-white/20 uppercase tracking-widest text-xs">Loading...</div>
          ) : reservations?.length === 0 ? (
            <div className="py-20 text-center glass-card text-white/20 uppercase tracking-widest text-xs">No reservations for this date</div>
          ) : (
            reservations?.map((res: any) => (
              <div key={res.id} className="glass-card p-6 flex flex-col md:flex-row gap-6 items-start md:items-center hover:bg-white/[0.02] transition-colors border-l border-white/5 hover:border-secondary/50">
                <div className="flex items-center gap-4 min-w-[120px]">
                  <Clock className="text-secondary" size={18} />
                  <span className="text-xl font-serif text-white">{res.time.substring(0, 5)}</span>
                </div>
                
                <div className="flex-1">
                  <h4 className="text-lg text-white font-medium mb-1">
                    {res.last_name} {res.first_name}
                  </h4>
                  <div className="flex flex-wrap gap-4 text-xs text-white/40">
                    <span className="flex items-center gap-1"><Users size={12} /> {res.guests} Guests</span>
                    <span className="flex items-center gap-1"><Phone size={12} /> {res.phone}</span>
                    <span className="flex items-center gap-1"><Mail size={12} /> {res.email}</span>
                  </div>
                </div>

                {res.notes && (
                  <div className="flex-1 max-w-md bg-black/20 p-3 rounded text-xs text-secondary/80 italic">
                    <div className="flex gap-2">
                      <FileText size={14} className="shrink-0" />
                      <span>{res.notes}</span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

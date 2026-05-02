'use client';

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { Calendar as CalendarIcon, Users, Clock, Phone, Mail, FileText, Lock, RefreshCcw, LogOut, Trash2, Edit2, Check, X, Plus } from 'lucide-react';

const fetcher = ([url, token]: [string, string]) => 
  fetch(url, { headers: { 'Authorization': token } }).then(res => res.json());

const INITIAL_FORM = {
  guests: '2',
  date: '',
  time: '19:00',
  lastName: '',
  firstName: '',
  phone: '',
  email: '',
  notes: ''
};

export default function AdminReservations() {
  const [token, setToken] = useState<string>('');
  const [isAuth, setIsAuth] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterMode, setFilterMode] = useState<'recent' | 'date'>('recent');
  const [recentHours, setRecentHours] = useState<number>(24);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newData, setNewData] = useState({...INITIAL_FORM, date: selectedDate});

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

  const { data: reservations, error, mutate, isLoading } = useSWR(
    isAuth 
      ? [`/api/admin/reservations?${filterMode === 'recent' ? `hours=${recentHours}` : `date=${selectedDate}`}`, token] 
      : null,
    fetcher,
    { refreshInterval: 300000, revalidateOnFocus: true }
  );

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) return;
    try {
      const res = await fetch(`/api/admin/reservations?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': token }
      });
      if (res.ok) mutate();
    } catch (err) { alert('Delete failed'); }
  };

  const startEdit = (res: any) => {
    setEditingId(res.id);
    setEditData({
      ...res,
      lastName: res.last_name,
      firstName: res.first_name,
      date: new Date(res.date).toISOString().split('T')[0]
    });
  };

  const handleSaveEdit = async () => {
    try {
      const res = await fetch('/api/admin/reservations', {
        method: 'PATCH',
        headers: { 'Authorization': token, 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      });
      if (res.ok) { setEditingId(null); mutate(); }
    } catch (err) { alert('Save failed'); }
  };

  const handleCreate = async () => {
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      });
      if (res.ok) {
        setIsAdding(false);
        setNewData({...INITIAL_FORM, date: selectedDate});
        mutate();
      }
    } catch (err) { alert('Create failed'); }
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-deep-black flex items-center justify-center px-6">
        <div className="glass-card p-10 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-secondary"><Lock size={32} /></div>
          <h1 className="text-2xl font-serif text-white mb-8 uppercase tracking-widest">Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <input type="password" placeholder="Enter Admin Token" className="w-full bg-white/5 border border-white/10 p-4 text-white text-center focus:outline-none focus:border-secondary transition-all" value={token} onChange={(e) => setToken(e.target.value)} />
            <button className="w-full bg-secondary text-primary-dark py-4 uppercase tracking-[0.3em] text-xs font-black hover:bg-white transition-all">Login</button>
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
            <div className="w-10 h-10 bg-secondary flex items-center justify-center text-primary-dark rounded-sm"><CalendarIcon size={24} /></div>
            <div>
              <h1 className="text-2xl font-serif text-white uppercase tracking-widest">Reservations</h1>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.2em]">Live Management System</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Filter Mode Switcher */}
            <div className="flex bg-white/5 p-1 rounded-sm border border-white/10">
              <button 
                onClick={() => setFilterMode('recent')}
                className={`px-4 py-2 text-[10px] uppercase tracking-widest transition-all ${filterMode === 'recent' ? 'bg-secondary text-primary-dark font-black' : 'text-white/40 hover:text-white'}`}
              >
                Recent
              </button>
              <button 
                onClick={() => setFilterMode('date')}
                className={`px-4 py-2 text-[10px] uppercase tracking-widest transition-all ${filterMode === 'date' ? 'bg-secondary text-primary-dark font-black' : 'text-white/40 hover:text-white'}`}
              >
                By Date
              </button>
            </div>

            {/* Sub-filters based on mode */}
            {filterMode === 'recent' ? (
              <div className="flex gap-2">
                {[12, 24, 48, 72].map(h => (
                  <button 
                    key={h}
                    onClick={() => setRecentHours(h)}
                    className={`w-10 h-10 flex items-center justify-center text-[10px] border transition-all ${recentHours === h ? 'border-secondary text-secondary bg-secondary/5' : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white'}`}
                  >
                    {h}h
                  </button>
                ))}
              </div>
            ) : (
              <input 
                type="date" 
                className="bg-white/5 border border-white/10 p-3 text-white focus:outline-none focus:border-secondary rounded-sm text-sm" 
                value={selectedDate} 
                onChange={(e) => {setSelectedDate(e.target.value); setNewData({...newData, date: e.target.value})}} 
              />
            )}

            <div className="h-8 w-[1px] bg-white/10 hidden md:block mx-2"></div>

            <button onClick={() => setIsAdding(true)} className="p-3 bg-secondary text-primary-dark hover:bg-white transition-all rounded-sm flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              <Plus size={16} /> New
            </button>
            <button onClick={() => mutate()} className="p-3 bg-white/5 border border-white/10 text-white/60 hover:text-secondary hover:border-secondary transition-all rounded-sm">
              <RefreshCcw size={18} className={isLoading ? 'animate-spin' : ''} />
            </button>
            <button onClick={handleLogout} className="p-3 text-white/30 hover:text-red-400 transition-colors"><LogOut size={18} /></button>
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {/* Add Form */}
          {isAdding && (
            <div className="glass-card p-6 border-2 border-secondary animate-reveal">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <input className="bg-white/10 p-2 text-white text-sm" value={newData.lastName} onChange={e => setNewData({...newData, lastName: e.target.value})} placeholder="Last Name *" />
                <input className="bg-white/10 p-2 text-white text-sm" value={newData.firstName} onChange={e => setNewData({...newData, firstName: e.target.value})} placeholder="First Name *" />
                <input className="bg-white/10 p-2 text-white text-sm" type="time" value={newData.time} onChange={e => setNewData({...newData, time: e.target.value})} />
                <input className="bg-white/10 p-2 text-white text-sm" type="number" value={newData.guests} onChange={e => setNewData({...newData, guests: e.target.value})} />
                <input className="bg-white/10 p-2 text-white text-sm md:col-span-2" value={newData.phone} onChange={e => setNewData({...newData, phone: e.target.value})} placeholder="Phone *" />
                <input className="bg-white/10 p-2 text-white text-sm md:col-span-2" value={newData.email} onChange={e => setNewData({...newData, email: e.target.value})} placeholder="Email *" />
                <textarea className="bg-white/10 p-2 text-white text-sm md:col-span-4" value={newData.notes} onChange={e => setNewData({...newData, notes: e.target.value})} placeholder="Notes (optional)" />
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-xs text-white/40 uppercase tracking-widest hover:text-white">Cancel</button>
                <button onClick={handleCreate} className="px-6 py-2 bg-secondary text-primary-dark text-xs font-bold uppercase tracking-widest hover:bg-white">Add Reservation</button>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="py-20 text-center text-white/20 uppercase tracking-widest text-xs animate-pulse">Loading...</div>
          ) : reservations?.length === 0 && !isAdding ? (
            <div className="py-20 text-center glass-card text-white/20 uppercase tracking-widest text-xs">No reservations</div>
          ) : (
            reservations?.map((res: any) => (
              <div key={res.id} className="glass-card p-6 flex flex-col gap-6 hover:bg-white/[0.02] transition-all border-l border-white/5 hover:border-secondary/50">
                {editingId === res.id ? (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input className="bg-white/10 p-2 text-white text-sm" value={editData.lastName} onChange={e => setEditData({...editData, lastName: e.target.value})} />
                    <input className="bg-white/10 p-2 text-white text-sm" value={editData.firstName} onChange={e => setEditData({...editData, firstName: e.target.value})} />
                    <input className="bg-white/10 p-2 text-white text-sm" type="time" value={editData.time} onChange={e => setEditData({...editData, time: e.target.value})} />
                    <input className="bg-white/10 p-2 text-white text-sm" type="number" value={editData.guests} onChange={e => setEditData({...editData, guests: e.target.value})} />
                    <div className="md:col-span-4 flex justify-end gap-2">
                      <button onClick={() => setEditingId(null)} className="px-4 py-2 text-xs text-white/40 uppercase tracking-widest hover:text-white">Cancel</button>
                      <button onClick={handleSaveEdit} className="px-6 py-2 bg-secondary text-primary-dark text-xs font-bold uppercase tracking-widest hover:bg-white">Save Changes</button>
                    </div>
                  </div>
                ) : (
                    <div className="flex flex-col items-start min-w-[120px] gap-1">
                      <div className="flex items-center gap-2"><Clock className="text-secondary" size={16} /><span className="text-xl font-serif text-white">{res.time.substring(0, 5)}</span></div>
                      <div className="flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-widest ml-[22px]">{new Date(res.date).toLocaleDateString('it-IT')}</div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg text-white font-medium mb-1">{res.last_name} {res.first_name}</h4>
                      <div className="flex flex-wrap gap-4 text-xs text-white/40">
                        <span className="flex items-center gap-1"><Users size={12} /> {res.guests} Guests</span>
                        <span className="flex items-center gap-1"><Phone size={12} /> {res.phone}</span>
                        <span className="flex items-center gap-1"><Mail size={12} /> {res.email}</span>
                      </div>
                      {res.notes && <div className="mt-3 text-xs text-secondary/60 italic flex gap-2"><FileText size={14} /> {res.notes}</div>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(res)} className="p-2 text-white/20 hover:text-secondary transition-colors"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(res.id)} className="p-2 text-white/20 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
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

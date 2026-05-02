"use client";

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Clock, Users, Phone, Mail, FileText, Trash2, Edit2, Calendar, Filter, ChevronRight } from 'lucide-react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const INITIAL_FORM = {
  lastName: '',
  firstName: '',
  date: '',
  time: '',
  guests: 2,
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

  const { data: reservations, mutate, isLoading } = useSWR(
    isAuth ? (filterMode === 'recent' 
      ? `/api/admin/reservations?hours=${recentHours}`
      : `/api/admin/reservations?date=${selectedDate}`) : null,
    fetcher,
    { refreshInterval: 30000 }
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (token === 'marin2024') {
      localStorage.setItem('admin_token', token);
      setIsAuth(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuth(false);
    setToken('');
  };

  const startEdit = (res: any) => {
    setEditingId(res.id);
    setEditData({
      lastName: res.last_name,
      firstName: res.first_name,
      date: res.date,
      time: res.time,
      guests: res.guests,
      phone: res.phone,
      email: res.email,
      notes: res.notes
    });
  };

  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`/api/admin/reservations`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, ...editData })
      });
      if (res.ok) {
        setEditingId(null);
        mutate();
      }
    } catch (error) {
      console.error('Failed to update:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this reservation?')) return;
    try {
      const res = await fetch(`/api/admin/reservations?id=${id}`, { method: 'DELETE' });
      if (res.ok) mutate();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      });
      if (res.ok) {
        setIsAdding(false);
        setNewData({...INITIAL_FORM, date: selectedDate});
        mutate();
      }
    } catch (error) {
      console.error('Failed to add:', error);
    }
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center p-6">
        <div className="glass-card p-8 w-full max-w-md">
          <h2 className="text-2xl font-serif text-secondary mb-6 text-center tracking-widest uppercase">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="password"
                className="w-full bg-white/5 border border-white/10 p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-secondary"
                placeholder="Access Token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
            </div>
            <button type="submit" className="w-full bg-secondary text-primary-dark py-4 font-bold uppercase tracking-widest hover:bg-white transition-colors">
              Enter Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-dark p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-serif text-white tracking-widest uppercase mb-2">Reservations</h1>
            <p className="text-white/40 text-sm tracking-widest">Management Dashboard</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setIsAdding(true)} className="px-6 py-2 bg-secondary text-primary-dark text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors">
              Add Reservation
            </button>
            <button onClick={handleLogout} className="px-6 py-2 border border-white/10 text-white/40 text-xs uppercase tracking-widest hover:text-white hover:border-white transition-all">
              Logout
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="flex glass-card p-1">
            <button 
              onClick={() => setFilterMode('recent')}
              className={`px-6 py-2 text-[10px] uppercase tracking-widest transition-all ${filterMode === 'recent' ? 'bg-secondary text-primary-dark font-bold' : 'text-white/40 hover:text-white'}`}
            >
              Recent
            </button>
            <button 
              onClick={() => setFilterMode('date')}
              className={`px-6 py-2 text-[10px] uppercase tracking-widest transition-all ${filterMode === 'date' ? 'bg-secondary text-primary-dark font-bold' : 'text-white/40 hover:text-white'}`}
            >
              By Date
            </button>
          </div>

          {filterMode === 'recent' ? (
            <div className="flex gap-2">
              {[12, 24, 48, 72].map(h => (
                <button 
                  key={h}
                  onClick={() => setRecentHours(h)}
                  className={`px-4 py-2 text-[10px] border border-white/5 transition-all ${recentHours === h ? 'border-secondary text-secondary' : 'text-white/20 hover:text-white/60'}`}
                >
                  {h}h
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-4 glass-card px-4 py-1">
              <Calendar size={16} className="text-secondary" />
              <input 
                type="date" 
                className="bg-transparent text-white text-xs focus:outline-none py-1"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          {isAdding && (
            <div className="glass-card p-8 animate-reveal border-l-2 border-secondary">
              <h3 className="text-white uppercase tracking-widest text-xs mb-6 flex items-center gap-2"><Filter size={14} className="text-secondary" /> New Reservation</h3>
              <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <input className="bg-white/5 border border-white/10 p-3 text-white text-sm" placeholder="Last Name" value={newData.lastName} onChange={e => setNewData({...newData, lastName: e.target.value})} required />
                <input className="bg-white/5 border border-white/10 p-3 text-white text-sm" placeholder="First Name" value={newData.firstName} onChange={e => setNewData({...newData, firstName: e.target.value})} required />
                <input className="bg-white/5 border border-white/10 p-3 text-white text-sm" type="date" value={newData.date} onChange={e => setNewData({...newData, date: e.target.value})} required />
                <input className="bg-white/5 border border-white/10 p-3 text-white text-sm" type="time" value={newData.time} onChange={e => setNewData({...newData, time: e.target.value})} required />
                <input className="bg-white/5 border border-white/10 p-3 text-white text-sm" type="number" placeholder="Guests" value={newData.guests} onChange={e => setNewData({...newData, guests: parseInt(e.target.value)})} required />
                <input className="bg-white/5 border border-white/10 p-3 text-white text-sm" placeholder="Phone" value={newData.phone} onChange={e => setNewData({...newData, phone: e.target.value})} required />
                <input className="bg-white/5 border border-white/10 p-3 text-white text-sm" placeholder="Email" value={newData.email} onChange={e => setNewData({...newData, email: e.target.value})} />
                <input className="bg-white/5 border border-white/10 p-3 text-white text-sm md:col-span-2" placeholder="Notes" value={newData.notes} onChange={e => setNewData({...newData, notes: e.target.value})} />
                <div className="md:col-span-3 flex justify-end gap-4 mt-2">
                  <button type="button" onClick={() => setIsAdding(false)} className="text-white/40 uppercase tracking-widest text-[10px] hover:text-white">Cancel</button>
                  <button type="submit" className="bg-secondary text-primary-dark px-8 py-3 font-bold uppercase tracking-widest text-[10px] hover:bg-white transition-colors">Confirm Reservation</button>
                </div>
              </form>
            </div>
          )}

          {isLoading ? (
            <div className="py-20 text-center text-white/20 uppercase tracking-widest text-xs animate-pulse">Loading...</div>
          ) : reservations?.length === 0 && !isAdding ? (
            <div className="py-20 text-center glass-card text-white/20 uppercase tracking-widest text-xs">No reservations</div>
          ) : (
            reservations?.map((res: any) => {
              const now = new Date().getTime();
              const createdAt = new Date(res.created_at).getTime();
              const diffInMinutes = (now - createdAt) / (1000 * 60);
              
              // 判定为新预订：在过去 60 分钟内创建，或者由于时钟误差处于“未来”10分钟内
              const isNew = diffInMinutes > -10 && diffInMinutes < 60;
              
              return (
                <div key={res.id} className={`glass-card p-6 flex flex-col gap-6 hover:bg-white/[0.02] transition-all border-l-2 relative overflow-hidden ${isNew ? 'border-secondary animate-pulse-subtle bg-secondary/[0.02]' : 'border-white/5 hover:border-secondary/50'}`}>
                  {isNew && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-secondary text-primary-dark text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-bl-sm flex items-center gap-1 shadow-xl">
                        <span className="w-1 h-1 bg-primary-dark rounded-full animate-ping"></span>
                        New Reservation
                      </div>
                    </div>
                  )}
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
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                      <div className="flex flex-col items-start min-w-[120px] gap-1">
                        <div className="flex items-center gap-2"><Clock className="text-secondary" size={16} /><span className="text-xl font-serif text-white">{res.time.substring(0, 5)}</span></div>
                        <div className="flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-widest ml-[22px]">{new Date(res.date).toLocaleDateString('it-IT')}</div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg text-white font-medium mb-1">{res.last_name} {res.first_name}</h4>
                        <div className="text-[8px] text-white/10 uppercase mb-2">Debug: {String(res.created_at)} | Diff: {isNaN(diffInMinutes) ? 'NaN' : diffInMinutes.toFixed(1)}m</div>
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
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

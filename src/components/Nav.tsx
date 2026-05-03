'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, Menu, X } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

export default function Nav() {
  const t = useTranslations('Nav');
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: `#home`, label: t('home') },
    { href: `#menu`, label: t('menu') },
    { href: `#reservation`, label: t('reservation') },
    { href: `#about`, label: t('about') },
    { href: `#contact`, label: t('contact') },
  ];

  return (
    <nav className="nav-blur fixed top-0 left-0 w-full z-[100] transition-all duration-500">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 md:py-5 flex justify-between items-center">
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white/70 hover:text-secondary p-2 -ml-2"
          onClick={() => setIsOpen(true)}
        >
          <Menu size={24} />
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 lg:gap-12 items-center">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={`/${locale}${link.href}`} 
              className="group relative text-[10px] lg:text-xs uppercase tracking-[0.3em] font-medium text-accent/70 hover:text-secondary transition-colors"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-secondary transition-all group-hover:w-full"></span>
            </Link>
          ))}
        </div>
        
        {/* Logo (Centered on mobile if needed, or just keep layout) */}
        <div className="flex gap-4 md:gap-8 items-center text-accent/50">
          <a href="tel:0327557176" className="hover:text-secondary transition-colors"><Phone size={18} strokeWidth={1.5} /></a>
          <a href="mailto:info@milano-marin.ch" className="hidden sm:block hover:text-secondary transition-colors"><Mail size={18} strokeWidth={1.5} /></a>
          
          <div className="flex items-center gap-3 ml-2 md:ml-4 pl-2 md:pl-4 border-l border-white/10 text-[10px] font-bold tracking-widest uppercase">
            {['fr', 'en', 'de'].map((l) => (
              <Link 
                key={l}
                href={`/${l}`} 
                className={`transition-colors ${locale === l ? 'text-secondary' : 'text-accent/30 hover:text-white'}`}
              >
                {l.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 bg-primary-dark/95 backdrop-blur-xl z-[101] transition-all duration-500 md:hidden ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="p-8 flex flex-col h-full">
          <div className="flex justify-end">
            <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white p-2">
              <X size={32} />
            </button>
          </div>
          
          <div className="flex-grow flex flex-col items-center justify-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={`/${locale}${link.href}`} 
                onClick={() => setIsOpen(false)}
                className="text-2xl font-serif text-white hover:text-secondary tracking-widest uppercase"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex justify-center gap-8 pb-12 border-t border-white/5 pt-12">
             <a href="tel:0327557176" className="text-secondary flex items-center gap-2 text-sm uppercase tracking-widest">
               <Phone size={20} /> Call
             </a>
             <a href="mailto:info@milano-marin.ch" className="text-secondary flex items-center gap-2 text-sm uppercase tracking-widest">
               <Mail size={20} /> Email
             </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

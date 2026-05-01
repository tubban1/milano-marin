import Link from 'next/link';
import { Phone, Mail, Camera } from 'lucide-react';

export default function Nav({ locale }: { locale: string }) {
  return (
    <nav className="nav-blur fixed top-0 left-0 w-full z-50 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
        <div className="flex gap-10 items-center">
          <Link href={`/${locale}#home`} className="group relative text-xs uppercase tracking-[0.3em] font-medium text-accent/70 hover:text-secondary transition-colors">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-secondary transition-all group-hover:w-full"></span>
          </Link>
          <Link href={`/${locale}#menu`} className="group relative text-xs uppercase tracking-[0.3em] font-medium text-accent/70 hover:text-secondary transition-colors">
            Menu
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-secondary transition-all group-hover:w-full"></span>
          </Link>
          <Link href={`/${locale}#reservation`} className="group relative text-xs uppercase tracking-[0.3em] font-medium text-accent/70 hover:text-secondary transition-colors">
            Reservation
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-secondary transition-all group-hover:w-full"></span>
          </Link>
          <Link href={`/${locale}#about`} className="group relative text-xs uppercase tracking-[0.3em] font-medium text-accent/70 hover:text-secondary transition-colors">
            Our Story
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-secondary transition-all group-hover:w-full"></span>
          </Link>
          <Link href={`/${locale}#contact`} className="group relative text-xs uppercase tracking-[0.3em] font-medium text-accent/70 hover:text-secondary transition-colors">
            Contact
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-secondary transition-all group-hover:w-full"></span>
          </Link>
        </div>
        
        <div className="flex gap-8 items-center text-accent/50">
          <a href="tel:0327557176" className="hover:text-secondary transition-colors"><Phone size={18} strokeWidth={1.5} /></a>
          <a href="#" className="hover:text-secondary transition-colors">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <a href="mailto:info@milano-marin.ch" className="hover:text-secondary transition-colors"><Mail size={18} strokeWidth={1.5} /></a>
          
          <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/10 text-xs font-bold tracking-widest uppercase">
            <Link 
              href="/fr" 
              className={`transition-colors ${locale === 'fr' ? 'text-secondary' : 'text-accent/30 hover:text-white'}`}
            >
              FR
            </Link>
            <span className="text-white/10">|</span>
            <Link 
              href="/en" 
              className={`transition-colors ${locale === 'en' ? 'text-secondary' : 'text-accent/30 hover:text-white'}`}
            >
              EN
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

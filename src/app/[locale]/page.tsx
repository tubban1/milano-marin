import { readPageContent } from '@/lib/content';
import { homeDefaults } from '@/content/defaults';
import { Locale } from '@/i18n/config';
import { FileText, MapPin, Phone, Mail } from 'lucide-react';
import LiquidBackground from '@/components/LiquidBackground';

export default async function HomePage({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  const content = await readPageContent('home', locale, homeDefaults(locale as Locale));
  const { hero, drinkMenu, foodMenu } = content;

  return (
    <div className="relative min-h-screen">
      <LiquidBackground />
      {/* HERO SECTION - 高级暗调背景 */}
      <section id="home" className="relative h-screen flex flex-col items-center justify-center text-center overflow-hidden">
        {/* 遮罩层 (让背景透出来) */}
        <div className="absolute inset-0 hero-overlay"></div>
        
        <div className="relative z-10 px-4 animate-reveal pt-24">
          <div className="flex justify-center mb-10">
            <img 
              src="/logo2.png" 
              alt="Milano Marin Logo" 
              className="h-40 w-auto brightness-110 drop-shadow-[0_0_20px_rgba(212,175,55,0.3)]"
            />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-serif text-white mb-6 tracking-tight leading-none">
            {hero.title}
          </h1>
          <p className="text-secondary uppercase tracking-[0.6em] text-sm mb-12 font-medium">
            {hero.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <a href="#menu" className="text-white/60 hover:text-secondary uppercase tracking-[0.3em] text-xs transition-colors border-b border-white/10 pb-1">
              Explore Menu
            </a>
          </div>
        </div>

        {/* 底部装饰线 */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30">
          <div className="w-[1px] h-20 bg-gradient-to-b from-transparent to-secondary"></div>
          <span className="text-[10px] uppercase tracking-[0.5em] text-secondary">Scroll</span>
        </div>
      </section>

      {/* MENU SECTIONS */}
      <main id="menu" className="relative z-10 -mt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6 space-y-40">
          
          {/* DRINK SECTION */}
          <section className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 space-y-8 order-2 lg:order-1">
              <div className="glass-card">
                <div className="mb-10 text-center">
                  <h2 className="text-4xl font-serif text-secondary mb-2 uppercase tracking-tighter">{drinkMenu.title}</h2>
                  <div className="w-20 h-[1px] bg-secondary/30 mx-auto mb-4"></div>
                </div>
                <ul className="space-y-4 mb-10">
                  {drinkMenu.items.map((item: any, i: number) => (
                    <li key={i} className="menu-item group">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-lg font-serif text-accent group-hover:text-secondary transition-colors">{item.name}</span>
                        <span className="text-sm font-bold text-secondary">{item.price}</span>
                      </div>
                      <p className="text-xs text-accent/40 italic font-light">{item.description}</p>
                    </li>
                  ))}
                </ul>
                <div className="text-center">
                  <a 
                    href="/drinks.pdf" 
                    target="_blank" 
                    className="inline-flex items-center gap-3 text-secondary hover:text-white border border-secondary/30 hover:border-secondary px-8 py-3 transition-all uppercase tracking-widest text-xs font-bold"
                  >
                    <FileText size={16} /> View Full Drink List (PDF)
                  </a>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-7 grid grid-cols-2 gap-6 order-1 lg:order-2">
              <div className="pt-12">
                <img src={drinkMenu.images[0]} className="w-full aspect-[3/4] object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-1000 border border-secondary/20 shadow-2xl" alt="Drink" />
              </div>
              <div>
                <img src={drinkMenu.images[1]} className="w-full aspect-[3/4] object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-1000 border border-secondary/20 shadow-2xl" alt="Drink" />
              </div>
            </div>
          </section>

          {/* FOOD SECTION - 左右反转 */}
          <section className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 grid grid-cols-2 gap-6">
              <div>
                <img src={foodMenu.images[0]} className="w-full aspect-[3/4] object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-1000 border border-secondary/20 shadow-2xl" alt="Food" />
              </div>
              <div className="pt-12">
                <img src={foodMenu.images[1]} className="w-full aspect-[3/4] object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-1000 border border-secondary/20 shadow-2xl" alt="Food" />
              </div>
            </div>

            <div className="lg:col-span-5 space-y-8">
              <div className="glass-card">
                <div className="mb-10 text-center">
                  <h2 className="text-4xl font-serif text-secondary mb-2 uppercase tracking-tighter">{foodMenu.title}</h2>
                  <div className="w-20 h-[1px] bg-secondary/30 mx-auto mb-4"></div>
                </div>
                <ul className="space-y-4 mb-10">
                  {foodMenu.items.map((item: any, i: number) => (
                    <li key={i} className="menu-item group">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-lg font-serif text-accent group-hover:text-secondary transition-colors">{item.name}</span>
                        <span className="text-sm font-bold text-secondary">{item.price}</span>
                      </div>
                      <p className="text-xs text-accent/40 italic font-light">{item.description}</p>
                    </li>
                  ))}
                </ul>
                <div className="text-center">
                  <a 
                    href="/menu.pdf" 
                    target="_blank" 
                    className="inline-flex items-center gap-3 text-secondary hover:text-white border border-secondary/30 hover:border-secondary px-8 py-3 transition-all uppercase tracking-widest text-xs font-bold"
                  >
                    <FileText size={16} /> View Full Menu (PDF)
                  </a>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* ABOUT SECTION */}
      <section id="about" className="py-40 bg-deep-black/50 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-12">
          <h2 className="text-5xl font-serif text-gold-gradient uppercase tracking-widest">Our Passion</h2>
          <p className="text-xl text-accent/70 font-serif leading-relaxed italic">
            "At Milano Marin, we believe that food is more than just sustenance; it is a celebration of life. 
            Every dish is a tribute to the timeless traditions of Italy, crafted with ingredients sourced 
            with the same love and care our grandmothers once used in their kitchens."
          </p>
          <div className="flex justify-center gap-4">
            <div className="w-2 h-2 rounded-full bg-secondary"></div>
            <div className="w-2 h-2 rounded-full bg-secondary/30"></div>
            <div className="w-2 h-2 rounded-full bg-secondary/10"></div>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="border-t border-white/5 py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-12 uppercase tracking-wider animate-reveal">Contact</h2>
          <div className="glass-card flex flex-col items-center gap-12 animate-reveal">
            <div className="flex flex-col items-center gap-4">
              <MapPin className="text-secondary" size={24} />
              <address className="not-italic text-lg text-accent/80 font-light tracking-wide">
                Route des Marais 10, 2074 Marin-Epagnier
              </address>
            </div>

            <div className="flex flex-col md:flex-row gap-12 md:gap-24">
              <div className="flex flex-col items-center gap-4">
                <Phone className="text-secondary" size={24} />
                <a href="tel:0327557176" className="text-lg text-accent/80 hover:text-secondary transition-colors font-light tracking-widest">
                  032 755 71 76
                </a>
              </div>
              
              <div className="flex flex-col items-center gap-4">
                <Mail className="text-secondary" size={24} />
                <a href="mailto:info@milano-marin.ch" className="text-lg text-accent/80 hover:text-secondary transition-colors font-light tracking-wide">
                  info@milano-marin.ch
                </a>
              </div>
            </div>
            
            <a 
              href="https://www.google.com/maps/dir/?api=1&destination=Route+des+Marais+10+2074+Marin-Epagnier" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-secondary border border-secondary/30 px-10 py-4 hover:bg-secondary hover:text-black transition-all duration-500 tracking-[0.2em] uppercase text-xs font-bold"
            >
              Google Maps
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-20 text-center">
        <img 
          src="/logo2.png" 
          alt="Milano Marin Logo" 
          className="w-16 h-auto mx-auto mb-8 opacity-20 grayscale brightness-110"
        />
        <p className="text-[10px] uppercase tracking-[0.8em] text-accent/30 font-light">
          Milano Marin — Authentic Passion
        </p>
      </footer>
    </div>
  );
}

import { Locale } from '@/i18n/config';

export type PageKey = 'home' | 'menu' | 'reservation' | 'about' | 'contact';

export const homeDefaults = (locale: Locale) => ({
  hero: {
    title: locale === 'fr' ? 'Bienvenue à Milano Marin' : 'Welcome to Milano Marin',
    subtitle: locale === 'fr' ? 'Cuisine Italienne Authentique' : 'Authentic Italian Cuisine',
    description: locale === 'fr' ? "L'essence de Milan au cœur de la ville." : 'The essence of Milan in the heart of the city.',
    ctaLabel: locale === 'fr' ? 'Réserver une Table' : 'Book a Table',
    heroImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80'
  },
  drinkMenu: {
    title: locale === 'fr' ? 'CARTE DES BOISSONS' : 'DRINK MENU',
    subtitle: locale === 'fr' ? 'Vins, spiritueux et bières' : 'Spirits, wine, and beer',
    items: [
      { name: 'Negroni', price: '€12', description: 'Gin, Campari, Vermouth Rosso.' },
      { name: 'Aperol Spritz', price: '€10', description: 'Aperol, Prosecco, Soda.' },
      { name: 'Vino Rosso', price: '€8', description: 'Sélection de vins rouges italiens.' }
    ],
    images: [
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800',
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800'
    ]
  },
  foodMenu: {
    title: locale === 'fr' ? 'CARTE DES PLATS' : 'FOOD MENU',
    subtitle: locale === 'fr' ? 'Entrées, plats et pâtes' : 'Entrees, mains, and pasta',
    items: [
      { name: 'Lasagna alla Bolognese', price: '€18', description: 'Pâtes fraîches, sauce ragù, béchamel.' },
      { name: 'Pizza Margherita', price: '€14', description: 'Tomate, mozzarella fior di latte, basilic.' },
      { name: 'Risotto ai Funghi', price: '€20', description: 'Riz arborio, champignons sauvages, parmesan.' }
    ],
    images: [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800',
      'https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=800'
    ]
  },
  features: [
    {
      title: locale === 'fr' ? 'Tradition' : 'Tradition',
      description: locale === 'fr' ? 'Des recettes transmises de génération en génération.' : 'Recipes passed down through generations.'
    },
    {
      title: locale === 'fr' ? 'Qualité' : 'Quality',
      description: locale === 'fr' ? 'Des ingrédients frais ed sélectionnés.' : 'Fresh and selected ingredients.'
    }
  ]
});

export const getDefaultContent = (page: PageKey, locale: string) => {
  if (page === 'home') return homeDefaults(locale as Locale);
  return {};
};

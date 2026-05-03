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
    title: locale === 'fr' ? 'SÉLECTION DE BOISSONS' : 'DRINK SELECTION',
    subtitle: locale === 'fr' ? 'Vins et spiritueux' : 'Fine wines and spirits',
    items: [
      { 
        name: 'Prosecco Casa Canevel Brut', 
        price: '8.00 CHF', 
        description: locale === 'fr' ? 'Vins au verre, 1 dl' : 'Classic sparkling wine by the glass, 1 dl' 
      },
      { 
        name: 'Estival Bouvet - Jabloir', 
        price: '9.00 CHF', 
        description: locale === 'fr' ? 'Vin blanc de Neuchâtel, 1 dl' : 'Local white wine from Neuchâtel, 1 dl' 
      },
      { 
        name: 'Sauvignon - Tenuta Valloccata', 
        price: '50.00 CHF', 
        description: locale === 'fr' ? 'Toscana Bianco, 75 cl' : 'Premium Sauvignon from Tuscany, 75 cl' 
      },
      { 
        name: 'Brunello di Montalcino - Banfi', 
        price: '86.00 CHF', 
        description: locale === 'fr' ? 'Le roi des vins toscans, 75 cl' : 'The king of Tuscan wines, 75 cl' 
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800',
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800'
    ]
  },
  foodMenu: {
    title: locale === 'fr' ? 'DÉLICES CULINAIRES' : 'CULINARY DELIGHTS',
    subtitle: locale === 'fr' ? 'Antipasti et plats principaux' : 'Antipasti and main courses',
    items: [
      { 
        name: 'Tagliere Parmigiano', 
        price: '24.00 CHF', 
        description: locale === 'fr' ? 'Jambon de Parme, Coppa, Salami et Parmesan 24 mois' : 'Parma Ham, Coppa, Salami and 24-month aged Parmesan' 
      },
      { 
        name: 'Vitello Tonnato', 
        price: '25.00 CHF', 
        description: locale === 'fr' ? 'Veau cuit à basse température, sauce au thon' : 'Slow-cooked veal with traditional tuna sauce' 
      },
      { 
        name: 'Spaghettone aux Vongole', 
        price: '30.00 CHF', 
        description: locale === 'fr' ? 'Vin blanc, ail, persil et palourdes fraîches' : 'Classic white wine, garlic, parsley and fresh clams' 
      },
      { 
        name: 'Gnocchi Farcis au Sanglier', 
        price: '28.00 CHF', 
        description: locale === 'fr' ? 'Farce au sanglier, sauce sauge et parmesan' : 'Wild boar stuffing, sage sauce and parmesan' 
      }
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
      description: locale === 'fr' ? 'Des ingrédients frais et sélectionnés.' : 'Fresh and selected ingredients.'
    }
  ]
});

export const getDefaultContent = (page: PageKey, locale: string) => {
  if (page === 'home') return homeDefaults(locale as Locale);
  return {};
};

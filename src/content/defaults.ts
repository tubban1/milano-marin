import { Locale } from '@/i18n/config';

export type PageKey = 'home' | 'menu' | 'reservation' | 'about' | 'contact';

export const homeDefaults = (locale: Locale) => ({
  hero: {
    title: 
      locale === 'fr' ? 'Bienvenue à Milano Marin' : 
      locale === 'de' ? 'Willkommen im Milano Marin' : 
      'Welcome to Milano Marin',
    subtitle: 
      locale === 'fr' ? 'Cuisine Italienne Authentique' : 
      locale === 'de' ? 'Authentische italienische Küche' : 
      'Authentic Italian Cuisine',
    description: 
      locale === 'fr' ? "L'essence de Milan au cœur de la ville." : 
      locale === 'de' ? 'Die Essenz von Mailand im Herzen der Stadt.' : 
      'The essence of Milan in the heart of the city.',
    ctaLabel: 
      locale === 'fr' ? 'Réserver une Table' : 
      locale === 'de' ? 'Tisch Reservieren' : 
      'Book a Table',
    heroImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80'
  },
  drinkMenu: {
    title: 
      locale === 'fr' ? 'SÉLECTION DE BOISSONS' : 
      locale === 'de' ? 'GETRÄNKEAUSWAHL' : 
      'DRINK SELECTION',
    subtitle: 
      locale === 'fr' ? 'Vins et spiritueux' : 
      locale === 'de' ? 'Erlesene Weine und Spirituosen' : 
      'Fine wines and spirits',
    items: [
      { 
        name: 'Prosecco Casa Canevel Brut', 
        price: '8.00 CHF', 
        description: 
          locale === 'fr' ? 'Vins au verre, 1 dl' : 
          locale === 'de' ? 'Schaumwein im Glas, 1 dl' : 
          'Classic sparkling wine by the glass, 1 dl' 
      },
      { 
        name: 'Estival Bouvet - Jabloir', 
        price: '9.00 CHF', 
        description: 
          locale === 'fr' ? 'Vin blanc de Neuchâtel, 1 dl' : 
          locale === 'de' ? 'Neuenburger Weißwein, 1 dl' : 
          'Local white wine from Neuchâtel, 1 dl' 
      },
      { 
        name: 'Sauvignon - Tenuta Valloccata', 
        price: '50.00 CHF', 
        description: 
          locale === 'fr' ? 'Toscana Bianco, 75 cl' : 
          locale === 'de' ? 'Premium Sauvignon aus der Toskana, 75 cl' : 
          'Premium Sauvignon from Tuscany, 75 cl' 
      },
      { 
        name: 'Brunello di Montalcino - Banfi', 
        price: '86.00 CHF', 
        description: 
          locale === 'fr' ? 'Le roi des vins toscans, 75 cl' : 
          locale === 'de' ? 'Der König der toskanischen Weine, 75 cl' : 
          'The king of Tuscan wines, 75 cl' 
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800',
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800'
    ]
  },
  foodMenu: {
    title: 
      locale === 'fr' ? 'DÉLICES CULINAIRES' : 
      locale === 'de' ? 'KULINARISCHE GENÜSSE' : 
      'CULINARY DELIGHTS',
    subtitle: 
      locale === 'fr' ? 'Antipasti et plats principaux' : 
      locale === 'de' ? 'Antipasti und Hauptspeisen' : 
      'Antipasti and main courses',
    items: [
      { 
        name: 'Tagliere Parmigiano', 
        price: '24.00 CHF', 
        description: 
          locale === 'fr' ? 'Jambon de Parme, Coppa, Salami et Parmesan 24 mois' : 
          locale === 'de' ? 'Parma Schinken, Coppa, Salami und 24 Monate alter Parmesan' : 
          'Parma Ham, Coppa, Salami and 24-month aged Parmesan' 
      },
      { 
        name: 'Vitello Tonnato', 
        price: '25.00 CHF', 
        description: 
          locale === 'fr' ? 'Veau cuit à basse température, sauce au thon' : 
          locale === 'de' ? 'Niedriggegartes Kalbfleisch mit traditioneller Thunfischsauce' : 
          'Slow-cooked veal with traditional tuna sauce' 
      },
      { 
        name: 'Spaghettone aux Vongole', 
        price: '30.00 CHF', 
        description: 
          locale === 'fr' ? 'Vin blanc, ail, persil et palourdes fraîches' : 
          locale === 'de' ? 'Weißwein, Knoblauch, Petersilie und frische Venusmuscheln' : 
          'Classic white wine, garlic, parsley and fresh clams' 
      },
      { 
        name: 'Gnocchi Farcis au Sanglier', 
        price: '28.00 CHF', 
        description: 
          locale === 'fr' ? 'Farce au sanglier, sauce sauge et parmesan' : 
          locale === 'de' ? 'Wildschweinfüllung, Salbeisauce und Parmesan' : 
          'Wild boar stuffing, sage sauce and parmesan' 
      }
    ],
    images: [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800',
      'https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=800'
    ]
  },
  features: [
    {
      title: locale === 'fr' ? 'Tradition' : locale === 'de' ? 'Tradition' : 'Tradition',
      description: 
        locale === 'fr' ? 'Des recettes transmises de génération en génération.' : 
        locale === 'de' ? 'Rezepte, die über Generationen weitergegeben wurden.' : 
        'Recipes passed down through generations.'
    },
    {
      title: locale === 'fr' ? 'Qualité' : locale === 'de' ? 'Qualität' : 'Quality',
      description: 
        locale === 'fr' ? 'Des ingrédients frais et sélectionnés.' : 
        locale === 'de' ? 'Frische und ausgewählte Zutaten.' : 
        'Fresh and selected ingredients.'
    }
  ]
});

export const getDefaultContent = (page: PageKey, locale: string) => {
  if (page === 'home') return homeDefaults(locale as Locale);
  return {};
};

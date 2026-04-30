import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/config';
import Nav from '@/components/Nav';
import CustomCursor from '@/components/CustomCursor';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;
  
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <CustomCursor />
      <div className="flex flex-col min-h-screen">
        <Nav locale={locale} />
        <main className="flex-grow">
          {children}
        </main>
      </div>
    </NextIntlClientProvider>
  );
}

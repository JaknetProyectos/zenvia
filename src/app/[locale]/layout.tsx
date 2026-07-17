import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { CartProvider } from '@/context/CartContext';
import React from 'react';
import ClientBody from './ClientBody';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { AlertProvider } from '@/context/AlertContext';
import { LocaleProvider } from '@/context/LangContext';
import LangSwitcher from '@/components/LangSwitcher';
import Header from '@/components/Header';
import Footer from '@/components/Footer';


export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // ESPERAR PARAMS (Next.js 15 Sync Dynamic APIs Fix)
  const { locale } = await params;

  // Validar que el idioma existe en nuestra config
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Carga de mensajes
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <ClientBody>
        <LocaleProvider>
          <CartProvider>
            <AlertProvider>
              <>
                <div className="min-h-screen bg-white flex flex-col font-sans antialiased text-black selection:bg-black selection:text-white">
                  <Header />

                  {/* 
        Márgenes dinámicos del contenido: 
        - En móvil deja espacio arriba para el header superior fijo (pt-16).
        - En escritorio se alinea a la izquierda de forma fija contemplando el ancho colapsado del menú (md:pl-16).
      */}
                  <main className="flex-grow pt-16 md:pt-0 md:pl-16 min-h-screen w-full transition-all duration-200">
                    {children}
                  </main>

                  <Footer />
                </div>
              </>
            </AlertProvider>
          </CartProvider>
        </LocaleProvider>
      </ClientBody>
    </NextIntlClientProvider>
  );
}
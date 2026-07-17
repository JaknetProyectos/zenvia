"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  ShoppingCart,
  House,
  Store,
  Users,
  Mail,
  Languages,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useLocaleContext } from "@/context/LangContext";

export function Logo({ className = "" }: { className?: string }) {
  const t = useTranslations("header");

  return (
    <Link
      href="/"
      className={`flex items-center gap-3 p-4 border-b border-black bg-white h-16 ${className}`}
    >
      <div className="bg-white  p-1 flex-shrink-0">
        <Image
          src="/logo.png"
          width={28}
          height={28}
          alt={t("logoAlt")}
          className="object-contain"
        />
      </div>
      {/* El título se oculta si la barra está colapsada, pero se muestra al hacer hover */}
      <div className="hidden group-hover:block transition-all duration-100 md:block">
        <Image
          src="/title.png"
          width={120}
          height={30}
          alt={t("titleAlt")}
          className="object-contain"
        />
      </div>
    </Link>
  );
}

export default function Header() {
  const t = useTranslations("header");
  const { locale, switchLanguage } = useLocaleContext();
  const { itemCount } = useCart();
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const nextLang = locale === "es" ? "en" : "es";

  const navItems = [
    { label: t("nav.home"), href: "/", icon: House },
    { label: t("nav.store"), href: "/tienda", icon: Store },
    { label: t("nav.about"), href: "/nosotros", icon: Users },
    { label: t("nav.contact"), href: "/contacto", icon: Mail },
  ];

  return (
    <>
      {/* HEADER SUPERIOR EXCLUSIVO MÓVIL (PANTALLAS PEQUEÑAS) */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-black z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-white">
            <Image src="/logo.png" width={24} height={24} alt="Logo" />
          </div>
          <Image src="/title.png" width={100} height={25} alt="Title" />
        </div>

        <div className="flex items-center gap-4">
          <Link href="/carrito" className="relative p-1">
            <ShoppingCart className="w-5 h-5 text-black" />
            <span className="absolute -top-1 -right-2 bg-[#EC4899] text-white text-[10px] font-bold px-1 border border-black">
              {itemCount}
            </span>
          </Link>
          <button
            onClick={() => setIsOpenMobile(!isOpenMobile)}
            className="p-1 border border-black bg-gray-100"
          >
            {isOpenMobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* MENÚ MÓVIL DESPLEGABLE */}
      {isOpenMobile && (
        <div className="md:hidden fixed inset-0 top-16 bg-black/40 z-40" onClick={() => setIsOpenMobile(false)}>
          <nav className="w-64 h-full bg-gray-100 border-r border-black flex flex-col justify-between" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col mt-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsOpenMobile(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium border-b border-gray-200 text-black hover:bg-black hover:text-white"
                  >
                    <Icon className="w-4 h-4 text-[#EC4899]" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
            <div className="flex flex-col border-t border-black bg-white">
              <button
                onClick={() => { switchLanguage(nextLang); setIsOpenMobile(false); }}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-black border-b border-gray-200 text-left"
              >
                <Languages className="w-4 h-4" />
                <span>{locale === "es" ? "English (EN)" : "Español (ES)"}</span>
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* NAVBAR ESCRITORIO INTELIGENTE (COLAPSADO POR DEFECTO, SE ABRE AL HACER HOVER) */}
      <aside
        className="group fixed top-0 left-0 z-50 h-screen bg-gray-100 border-r border-black hidden md:flex flex-col justify-between text-black transition-all duration-200 ease-in-out w-16 hover:w-64"
      >
        <div className="flex flex-col overflow-hidden">
          <Logo />

          <nav className="flex flex-col mt-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center h-12 px-5 text-sm font-medium border-b border-gray-200 bg-gray-100 hover:bg-black hover:text-white transition-colors duration-150 relative"
                >
                  <Icon className="w-4 h-4 text-black group-hover:text-[#EC4899] transition-colors duration-150 flex-shrink-0" />
                  {/* El texto permanece oculto y aparece limpiamente al expandir */}
                  <span className="ml-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-150 whitespace-nowrap truncate">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* PARTE INFERIOR: IDIOMA Y CARRITO ESCRITORIO */}
        <div className="flex flex-col border-t border-black bg-white overflow-hidden">
          <button
            onClick={() => switchLanguage(nextLang)}
            className="flex items-center h-12 px-5 text-sm font-medium border-b border-gray-200 bg-white hover:bg-gray-100 text-black transition-colors duration-150 text-left whitespace-nowrap"
          >
            <Languages className="w-4 h-4 text-black flex-shrink-0" />
            <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-150 truncate">
              {locale === "es" ? "Español (ES)" : "English (EN)"}
            </span>
          </button>

          <Link
            href="/carrito"
            aria-label={t("cart")}
            className="flex items-center justify-between h-14 px-5 text-sm font-medium bg-black text-white hover:bg-[#DB2777] transition-colors duration-150 whitespace-nowrap"
          >
            <div className="flex items-center">
              <ShoppingCart className="w-4 h-4 text-[#EC4899] flex-shrink-0" />
              <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-150 truncate">
                {t("cart") || "Carrito"}
              </span>
            </div>

            <span className="bg-white text-black font-bold text-xs px-1.5 py-0.5 border border-black min-w-[20px] text-center hidden group-hover:block">
              {itemCount}
            </span>
          </Link>
        </div>
      </aside>
    </>
  );
}

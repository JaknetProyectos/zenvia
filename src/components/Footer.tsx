"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

import {
  MapPin,
  Phone,
  Mail,
  CreditCard,
  FileText,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

import { Logo } from "./Header";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="w-full border-t border-black bg-white pt-12 pb-8 text-black font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Línea divisoria rígida superior */}
        <div className="mb-10">
          <div className="h-1 w-full bg-black" />
        </div>

        {/* Encabezado con Logo y Título */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="border border-black bg-white p-3 mb-4">
            <Logo />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-black uppercase">
            {t("title")}
          </h3>
        </div>

        {/* Rejilla Principal: Dirección y Soporte */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          
          {/* Dirección */}
          <div className="border border-black bg-gray-100 p-6 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center border border-black bg-white flex-shrink-0">
                <MapPin className="h-5 w-5 text-[#2563EB]" />
              </div>
              <h4 className="text-lg font-bold uppercase tracking-wider text-black">
                {t("address.title")}
              </h4>
            </div>

            <div className="space-y-1 text-sm text-black leading-relaxed">
              <p>{t("address.line1")}</p>
              <p>{t("address.line2")}</p>
              <p>{t("address.line3")}</p>
              <p>{t("address.line4")}</p>
            </div>
          </div>

          {/* Contacto / Soporte */}
          <div className="border border-black bg-white p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center border border-black bg-gray-100 flex-shrink-0">
                <Phone className="h-5 w-5 text-[#2563EB]" />
              </div>
              <h4 className="text-lg font-bold uppercase tracking-wider text-black">
                {t("support.title")}
              </h4>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center bg-gray-100 border border-gray-300 flex-shrink-0">
                  <Phone className="h-4 w-4 text-black" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">{t("support.phone")}</p>
                  <a href="tel:+5215525836217" className="text-sm font-medium hover:text-[#2563EB] transition-colors">
                    +52 1 55 2583 6217
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center bg-gray-100 border border-gray-300 flex-shrink-0">
                  <Mail className="h-4 w-4 text-black" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">{t("support.email")}</p>
                  <a href="mailto:hello@zenvia.com.mx" className="text-sm font-medium underline hover:text-[#2563EB] transition-colors">
                    hello@zenvia.com.mx
                  </a>
                </div>
              </div>

              <div className="border-t border-gray-300 pt-3 text-xs text-gray-700 leading-normal">
                {t("support.description")}
              </div>
            </div>
          </div>
        </div>

        {/* Métodos de Pago */}
        <div className="border border-black bg-gray-100 p-6 mb-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center border border-black bg-white flex-shrink-0">
              <CreditCard className="h-5 w-5 text-[#2563EB]" />
            </div>
            <h4 className="text-lg font-bold uppercase tracking-wider text-black">
              {t("payments.title")}
            </h4>
          </div>

          <div className="flex justify-center gap-4">
            <div className="border border-gray-300 bg-white px-4 py-2 flex items-center justify-center">
              <Image src="/mastercard.png" alt="Mastercard" width={50} height={30} className="object-contain" />
            </div>
            <div className="border border-gray-300 bg-white px-4 py-2 flex items-center justify-center">
              <Image src="/visa.png" alt="Visa" width={50} height={30} className="object-contain" />
            </div>
          </div>
        </div>

        {/* Enlaces Legales */}
        <div className="grid gap-3 max-w-4xl mx-auto mb-8 sm:grid-cols-3">
          <Link
            href="/legal/terminos"
            className="flex items-center gap-3 border border-black bg-white px-4 py-3 text-black hover:bg-black hover:text-white transition-colors duration-150"
          >
            <div className="flex h-8 w-8 items-center justify-center border border-gray-300 bg-gray-100 flex-shrink-0">
              <FileText className="h-4 w-4 text-[#2563EB]" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide">{t("legal.terms")}</span>
          </Link>

          <Link
            href="/legal/privacidad"
            className="flex items-center gap-3 border border-black bg-white px-4 py-3 text-black hover:bg-black hover:text-white transition-colors duration-150"
          >
            <div className="flex h-8 w-8 items-center justify-center border border-gray-300 bg-gray-100 flex-shrink-0">
              <ShieldCheck className="h-4 w-4 text-[#2563EB]" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide">{t("legal.privacy")}</span>
          </Link>

          <Link
            href="/legal/reembolsos"
            className="flex items-center gap-3 border border-black bg-white px-4 py-3 text-black hover:bg-black hover:text-white transition-colors duration-150"
          >
            <div className="flex h-8 w-8 items-center justify-center border border-gray-300 bg-gray-100 flex-shrink-0">
              <RotateCcw className="h-4 w-4 text-[#2563EB]" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide">{t("legal.returns")}</span>
          </Link>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 pt-4 text-center">
          <p className="text-xs text-gray-600 font-mono">
            {t("copyright")}
          </p>
        </div>

      </div>
    </footer>
  );
}
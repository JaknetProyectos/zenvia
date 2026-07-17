"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  BadgeCheck,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FeaturesSection } from "@/components/FeaturesSection";

export default function NosotrosPage() {
  const t = useTranslations("about");

  return (
    <main className="min-h-screen bg-white text-black font-sans">

      {/* HERO TÉCNICO */}
      <section className="relative bg-gray-100 pt-12 pb-16 border-b border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-stretch gap-0 border border-black bg-white lg:grid-cols-[1.05fr_.95fr]">

            {/* CONTENIDO */}
            <div className="p-8 md:p-12 flex flex-col justify-center bg-white order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 border border-black bg-gray-100 px-3 py-1 text-xs font-mono uppercase tracking-wider text-black w-max mb-6">
                <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>{t("hero.badge")}</span>
              </div>

              <h1 className="font-sans text-3xl font-black leading-tight tracking-tight text-black md:text-5xl xl:text-6xl uppercase mb-6">
                {t("hero.title")}
              </h1>

              <div className="space-y-4 max-w-2xl text-sm leading-relaxed text-gray-700">
                <p>{t("hero.description1")}</p>
                <p>{t("hero.description2")}</p>
              </div>

              <div className="pt-8">
                <Link href="/tienda">
                  <Button className="rounded-none bg-black px-6 py-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#2563EB] transition-colors shadow-none">
                    {t("hero.button")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* IMAGEN */}
            <div className="relative order-1 lg:order-2 bg-gray-100 border-b lg:border-b-0 lg:border-l border-black p-6 flex items-center justify-center">
              <div className="relative w-full aspect-[4/5] border border-black bg-white p-2">
                <Image
                  src="https://plus.unsplash.com/premium_photo-1681967035389-84aabd80cb1e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt={t("images.medicalProfessionalAlt")}
                  fill
                  priority
                  className="object-cover p-1"
                />

                {/* Etiqueta Técnica flotante rígida */}
                <div className="absolute -bottom-2 -left-2 bg-white border border-black px-4 py-3 shadow-none rounded-none">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border border-black bg-gray-100 flex items-center justify-center text-[#2563EB]">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-mono font-bold text-black uppercase tracking-tight">
                      {t("whyChooseUs.title")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECCIÓN: POR QUÉ ELEGIRNOS */}
      <section className="py-12 bg-white border-b border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-stretch gap-0 border border-black bg-white xl:grid-cols-[.9fr_1.1fr]">

            {/* IMAGEN */}
            <div className="relative min-h-[350px] bg-gray-100 border-b xl:border-b-0 xl:border-r border-black">
              <Image
                src="https://images.unsplash.com/photo-1640876777012-bdb00a6323e2?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt={t("images.medicalProfessionalAlt")}
                fill
                className="object-cover"
              />
            </div>

            {/* CONTENIDO */}
            <div className="p-8 md:p-12 bg-white flex flex-col justify-center">
              <div className="w-10 h-10 border border-black bg-gray-100 flex items-center justify-center mb-6 text-[#2563EB]">
                <HeartHandshake className="w-5 h-5" />
              </div>

              <h2 className="text-2xl md:text-4xl font-black text-black uppercase tracking-tight mb-6 border-l-4 border-[#2563EB] pl-4">
                {t("whyChooseUs.title")}
              </h2>

              <div className="space-y-4 text-sm leading-relaxed text-gray-700">
                <p>{t("whyChooseUs.description1")}</p>
                <p>{t("whyChooseUs.description2")}</p>
                <p>{t("whyChooseUs.description3")}</p>
              </div>

              <div className="pt-8">
                <Link href={"/contacto"}>
                  <Button className="rounded-none bg-black px-6 py-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#2563EB] transition-colors shadow-none">
                    {t("whyChooseUs.button")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECCIÓN: SOCIO ESTRATÉGICO */}
      <section className="py-12 bg-gray-50 border-b border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-stretch gap-0 border border-black bg-white lg:grid-cols-2">

            {/* CONTENIDO */}
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white order-2 lg:order-1">
              <div className="w-10 h-10 border border-black bg-gray-100 flex items-center justify-center mb-6 text-[#2563EB]">
                <BadgeCheck className="w-5 h-5" />
              </div>

              <h2 className="text-2xl md:text-4xl font-black text-black uppercase tracking-tight mb-6 border-l-4 border-black pl-4">
                {t("strategicPartner.title")}
              </h2>

              <div className="space-y-4 text-sm leading-relaxed text-gray-700">
                <p>{t("strategicPartner.description1")}</p>
                <p>{t("strategicPartner.description2")}</p>
                <p>{t("strategicPartner.description3")}</p>
                <p>{t("strategicPartner.description4")}</p>
                <p>{t("strategicPartner.description5")}</p>
              </div>

              <div className="pt-8">
                <Link href={"/contacto"}>
                  <Button className="rounded-none bg-[#2563EB] px-6 py-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition-colors shadow-none">
                    {t("strategicPartner.button")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* IMAGEN */}
            <div className="relative min-h-[450px] lg:h-auto order-1 lg:order-2 border-b lg:border-b-0 lg:border-l border-black bg-gray-100">
              <Image
                src="https://images.unsplash.com/photo-1740953448394-86122e98c1be?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt={t("images.medicalProfessionalAlt")}
                fill
                className="object-cover grayscale"
              />
            </div>

          </div>
        </div>
      </section>

      <FeaturesSection />

      {/* SECCIÓN: RESULTADOS */}
      <section className="py-12 bg-white border-b border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-stretch gap-0 border border-black bg-white lg:grid-cols-[1fr_.9fr]">

            {/* CONTENIDO */}
            <div className="p-8 md:p-12 bg-white flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-black">
              <h2 className="text-2xl md:text-4xl font-black text-black uppercase tracking-tight mb-6 border-l-4 border-[#2563EB] pl-4">
                {t("results.title")}
              </h2>

              <div className="space-y-4 mb-6 text-sm leading-relaxed text-gray-700">
                <p>{t("results.description1")}</p>
                <p>{t("results.description2")}</p>
              </div>

              {/* Lista rígida estilo viñeta técnica */}
              <ul className="space-y-3 mb-6">
                {[1, 2, 3, 4].map((num) => (
                  <li key={num} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-[#2563EB] mt-2 flex-shrink-0 rounded-none" />
                    <span className="text-xs font-mono uppercase tracking-tight text-black font-semibold">
                      {t(`results.items.item${num}` as any)}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="text-sm text-gray-700 leading-relaxed mb-8">
                {t("results.description3")}
              </p>

              <Link href={"/contacto"}>
                <Button className="rounded-none bg-black px-6 py-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#2563EB] transition-colors shadow-none w-max">
                  {t("results.button")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* IMAGEN CORTE RETÍCULA */}
            <div className="relative min-h-[350px] lg:h-auto bg-gray-100 p-6 flex items-center justify-center">
              <div className="relative w-full aspect-[4/5] border border-black bg-white p-2">
                <Image
                  src="https://images.unsplash.com/photo-1640876777012-bdb00a6323e2?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt={t("images.medicalProfessionalAlt")}
                  fill
                  className="object-cover p-1"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECCIÓN CONTACTO DIRECTO */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-black bg-white p-8 md:p-12 text-center rounded-none relative">
            <h2 className="text-2xl md:text-4xl font-black text-black uppercase tracking-tight mb-6">
              {t("contact.title")}
            </h2>

            <div className="space-y-4 max-w-2xl mx-auto text-sm leading-relaxed text-gray-700 font-mono">
              <p>{t("contact.description1")}</p>
              <p className="text-[#2563EB] font-bold text-base">{t("contact.phone")}</p>
              <p className="text-xs text-gray-500">{t("contact.description2")}</p>
            </div>

            <div className="pt-8">
              <Link href="/contacto">
                <Button className="rounded-none bg-black px-6 py-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#2563EB] transition-colors shadow-none">
                  {t("contact.button")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
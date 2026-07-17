"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import {
  FileText,
  BadgeInfo,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Package,
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function CustomProductPage() {
  const t = useTranslations("customPlan");

  const router = useRouter();
  const { addItem } = useCart();

  const [quoteNumber, setQuoteNumber] = useState("");
  const [totalPrice, setTotalPrice] = useState<number | "">("");
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    const finalPrice = Number(totalPrice) || 0;

    if (!quoteNumber.trim()) {
      setError(t("errors.quoteRequired"));
      return;
    }

    if (finalPrice <= 0) {
      setError(t("errors.invalidAmount"));
      return;
    }

    setIsAdding(true);

    const folioUpper = quoteNumber.trim().toUpperCase();

    addItem(
      {
        category_slug: "custom",
        description: t("product.description", {
          quote: folioUpper,
        }),
        name: t("product.name", {
          quote: folioUpper,
        }),
        name_english: `Special Order - Quote #${folioUpper}`,
        price: finalPrice,
        slug: `custom-quote-${quoteNumber
          .trim()
          .toLowerCase()}`,
        description_english: `Medical supplies pre-agreed with the sales department under quote #${folioUpper}.`,
        featured: false,
        id: `custom-quote-${folioUpper}-${Date.now()}`,
        image: "/logo-default.png",
        isNew: false,
      },
      1
    );

    setTimeout(() => {
      setIsAdding(false);
      router.push("/carrito");
    }, 1000);
  };

  return (
    <>

      <main className="min-h-screen bg-white pb-24 text-black font-sans">
        
        {/* HERO CONTENEDOR INDUSTRIAL */}
        <section className="relative border-b border-black bg-gray-50 py-12">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl border-l-4 border-[#2563EB] pl-4 md:pl-6">
              <div className="inline-flex items-center gap-2 border border-black bg-black text-white px-3 py-1 text-[9px] font-mono font-bold uppercase tracking-wider mb-4">
                <Package className="w-3 h-3 text-[#2563EB]" />
                {t("hero.badge")}
              </div>

              <h1 className="text-3xl md:text-5xl font-black leading-tight text-black uppercase tracking-tight mb-4">
                {t("hero.title")}
              </h1>

              <p className="text-xs md:text-sm font-sans text-gray-600 max-w-2xl leading-relaxed">
                {t("hero.description")}
              </p>
            </div>
          </div>
        </section>

        {/* ESTRUCTURA TÉCNICA PRINCIPAL */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="grid lg:grid-cols-2 gap-0 border border-black bg-white">
            
            {/* PANEL DE VALIDACIÓN (IZQUIERDA) */}
            <div className="bg-gray-50 border-b lg:border-b-0 lg:border-r border-black p-8 md:p-12 flex flex-col justify-between">
              <div className="w-full max-w-md mx-auto lg:mx-0">
                <div className="border border-gray-300 bg-white p-6 flex items-center justify-center relative aspect-square max-w-[320px] mx-auto lg:mx-0">
                  <Image
                    src={"/logo-default.png"}
                    width={200}
                    height={200}
                    alt={t("imageAlt")}
                    className="object-contain transition-none"
                  />
                  <div className="absolute top-3 left-3 px-2 py-0.5 border border-black bg-gray-100 text-[9px] font-mono font-bold uppercase text-gray-600">
                    B2B SPEC
                  </div>
                </div>

                <div className="mt-8 border-t border-gray-200 pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 border border-black bg-black flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5 text-[#2563EB]" />
                    </div>
                    <h2 className="text-sm font-black uppercase tracking-tight text-black">
                      {t("authorized.title")}
                    </h2>
                  </div>

                  <p className="text-xs leading-relaxed text-gray-600 font-sans">
                    {t("authorized.description")}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-200 text-[11px] font-mono text-gray-400 uppercase hidden lg:block">
                SECURE B2B PROCUREMENT NODE // TERMINAL
              </div>
            </div>

            {/* FORMULARIO DE CARGA DE ÓRDENES (DERECHA) */}
            <div className="p-6 sm:p-10 md:p-12 flex flex-col justify-center bg-white">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-200">
                <div className="w-12 h-12 border border-black bg-gray-50 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-black uppercase tracking-tight">
                    {t("hero.title")}
                  </h2>
                  <span className="text-[10px] font-mono text-gray-500 uppercase">
                    Ingrese los datos validados por su asesor
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="border-l-4 border-red-600 bg-red-50 p-4 rounded-none">
                    <div className="flex items-start gap-2.5">
                      <BadgeInfo className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <p className="text-xs font-mono font-bold text-red-800">
                        {error}
                      </p>
                    </div>
                  </div>
                )}

                {/* CAMPO: NÚMERO DE COTIZACIÓN */}
                <div className="space-y-2">
                  <label
                    htmlFor="quoteNumber"
                    className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 block"
                  >
                    {t("form.quoteLabel")}
                  </label>

                  <div className="relative">
                    <input
                      id="quoteNumber"
                      type="text"
                      required
                      placeholder={t("form.quotePlaceholder")}
                      value={quoteNumber}
                      onChange={(e) => setQuoteNumber(e.target.value)}
                      className="w-full h-14 border border-black bg-white px-4 text-sm font-mono font-bold uppercase text-black focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] rounded-none"
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center">
                      <span className="text-[9px] font-mono text-gray-400 bg-gray-100 px-2 py-1 border border-gray-200">
                        REQ
                      </span>
                    </div>
                  </div>
                </div>

                {/* CAMPO: PRECIO TOTAL */}
                <div className="space-y-2">
                  <label
                    htmlFor="totalPrice"
                    className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 block"
                  >
                    {t("form.amountLabel")}
                  </label>

                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <span className="text-sm font-mono font-bold text-black">
                        $
                      </span>
                    </div>

                    <input
                      id="totalPrice"
                      type="number"
                      required
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                      value={totalPrice}
                      onChange={(e) =>
                        setTotalPrice(
                          e.target.value !== "" ? Number(e.target.value) : ""
                        )
                      }
                      className="w-full h-14 border border-black bg-white pl-8 pr-16 text-sm font-mono font-bold text-black focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] rounded-none"
                    />

                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <span className="text-[10px] font-mono font-bold text-[#2563EB]">
                        MXN
                      </span>
                    </div>
                  </div>
                </div>

                {/* RETROALIMENTACIÓN EN TIEMPO REAL */}
                <div className="border border-black bg-gray-50 p-4 rounded-none">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                    <p className="text-xs leading-relaxed text-gray-600 font-mono">
                      {t("infoText.before")}{" "}
                      <span className="text-black font-bold underline">
                        {t("product.name", {
                          quote: quoteNumber.trim().toUpperCase() || "...",
                        })}
                      </span>{" "}
                      {t("infoText.after")}
                    </p>
                  </div>
                </div>

                {/* BOTÓN INDUSTRIAL ACCIONABLE MÓVIL/ESCRITORIO */}
                <Button
                  type="submit"
                  disabled={isAdding}
                  className={`w-full h-14 text-sm font-bold uppercase tracking-wider transition-colors rounded-none flex items-center justify-center gap-2 border shadow-none ${
                    isAdding
                      ? "bg-green-100 text-green-800 border-green-800"
                      : "bg-black text-white hover:bg-[#2563EB] hover:border-[#2563EB] border-black"
                  }`}
                >
                  {isAdding ? (
                    t("buttons.adding")
                  ) : (
                    <>
                      {t("buttons.addToCart")}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>

          </div>
        </section>
      </main>

      
    </>
  );
}
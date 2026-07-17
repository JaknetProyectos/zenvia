"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";

import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Phone,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/hooks/useProducts";
import { FeaturesSection } from "@/components/FeaturesSection";

function SectionTitle({
  title,
  description,
  centered = true,
}: {
  title: string;
  description: string;
  centered?: boolean;
}) {
  return (
    <div className={`border-l-4 border-[#2563EB] pl-4 ${centered ? "md:max-w-3xl mx-auto" : ""}`}>
      <h2 className="text-2xl md:text-4xl font-bold text-black uppercase tracking-tight">
        {title}
      </h2>
      <p className="mt-2 text-sm text-gray-700 leading-relaxed max-w-2xl">
        {description}
      </p>
    </div>
  );
}

function HeroSection() {
  const t = useTranslations("home.hero");

  return (
    <section className="relative bg-gray-100 pt-12 pb-16 border-b border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-stretch gap-0 border border-black bg-white md:grid-cols-12">
          
          <div className="p-8 md:p-12 lg:col-span-7 flex flex-col justify-center order-2 md:order-1 bg-white">
            <div className="inline-flex items-center gap-2 border border-black bg-gray-100 px-3 py-1 text-xs font-mono uppercase tracking-wider text-black w-max">
              <span className="h-2 w-2 bg-[#2563EB]" />
              <span>{t("title")}</span>
            </div>

            <h1 className="mt-6 font-sans text-3xl font-black leading-tight tracking-tight text-black md:text-5xl uppercase">
              {t("title")}
            </h1>

            <p className="mt-4 text-sm leading-relaxed text-gray-700 max-w-xl">
              {t("description")}
            </p>
          </div>

          <div className="lg:col-span-5 order-1 md:order-2 bg-gray-100 border-b md:border-b-0 md:border-l border-black p-6 flex items-center justify-center">
            <div className="relative w-full aspect-[4/3] md:h-full border border-black bg-white p-2">
              <Image
                src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt={t("imageAlt")}
                fill
                priority
                className="object-cover p-1"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function ProductsSection() {
  const t = useTranslations("home.products");
  const locale = useLocale();
  const [currentSlide, setCurrentSlide] = useState(0);

  const { products, loading } = useProducts({
    featured: false,
    limit: 6,
  });

  const maxSlides = Math.max(1, products.length - 2);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % maxSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + maxSlides) % maxSlides);
  };

  const displayProducts = useMemo(() => {
    return loading ? [] : products;
  }, [loading, products]);

  return (
    <section className="relative py-12 bg-white border-b border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionTitle title={t("title")} description={t("description")} centered={true} />

        <div className="mt-10">
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-black bg-gray-50 p-4 animate-pulse rounded-none">
                  <div className="aspect-square bg-gray-200 mb-3 rounded-none" />
                  <div className="h-4 bg-gray-200 w-3/4 mx-auto rounded-none" />
                </div>
              ))}
            </div>
          ) : (
            <div className="relative">
              <div className="overflow-hidden border border-black bg-gray-100">
                <div
                  className="flex transition-transform duration-300 ease-in-out will-change-transform"
                  style={{
                    transform: `translateX(-${currentSlide * (100 / 3)}%)`,
                  }}
                >
                  {displayProducts.map((product) => (
                    <div
                      key={product.id}
                      className="min-w-full sm:min-w-[50%] lg:min-w-[33.333%] border-r border-gray-300 last:border-r-0 p-4 bg-white"
                    >
                      <Link href={`/tienda/${product.slug}`} className="group block h-full">
                        <div className="relative mb-4 aspect-square border border-gray-300 bg-gray-50 p-2">
                          <Image
                            src={product.image}
                            alt={
                              locale === "es"
                                ? product.name
                                : product.name_english || product.name
                            }
                            fill
                            className="object-contain p-2"
                          />
                        </div>

                        <h3 className="text-center text-xs font-bold uppercase tracking-wide text-black group-hover:text-[#2563EB] transition-colors">
                          {locale === "es"
                            ? product.name
                            : product.name_english || product.name}
                        </h3>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {displayProducts.length > 3 && (
                <>
                  <button
                    type="button"
                    onClick={prevSlide}
                    className="absolute left-2 top-1/2 -translate-y-1/2 border border-black bg-white p-2 hover:bg-black hover:text-white transition-colors rounded-none shadow-none"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={nextSlide}
                    className="absolute right-2 top-1/2 -translate-y-1/2 border border-black bg-white p-2 hover:bg-black hover:text-white transition-colors rounded-none shadow-none"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          )}

          {!loading && displayProducts.length > 3 && (
            <div className="mt-6 flex justify-center gap-1">
              {Array.from({ length: maxSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 transition-all duration-150 rounded-none ${
                    currentSlide === index ? "w-6 bg-black" : "w-2 bg-gray-300"
                  }`}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <Link href="/tienda">
              <Button className="rounded-none bg-black px-6 py-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#2563EB] transition-colors shadow-none">
                {t("button")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function PaymentSection() {
  const t = useTranslations("home.payment");

  return (
    <section className="relative py-12 bg-gray-100 border-b border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-stretch gap-0 border border-black md:grid-cols-2 bg-white">
          
          <div className="relative min-h-[250px] md:min-h-full border-b md:border-b-0 md:border-r border-black">
            <Image
              src="https://plus.unsplash.com/premium_photo-1723514536306-26fe5c4adeb7?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt={t("imageAlt")}
              fill
              className="object-cover"
            />
          </div>

          <div className="p-6 md:p-10 flex flex-col justify-center bg-white">
            <SectionTitle
              title={t("title")}
              description={t("description")}
              centered={false}
            />

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contacto">
                <Button className="rounded-none bg-black px-5 py-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#2563EB] transition-colors shadow-none">
                  {t("contactButton")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link href="/pagar-personalizado">
                <Button
                  variant="outline"
                  className="rounded-none border-black bg-white px-5 py-4 text-xs font-bold uppercase tracking-wider text-black hover:bg-gray-100 transition-colors shadow-none"
                >
                  {t("payButton")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const t = useTranslations("home.contact");

  return (
    <section className="relative py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-stretch gap-0 border border-black md:grid-cols-2">
          
          <div className="p-6 md:p-10 flex flex-col justify-center bg-white order-2 md:order-1">
            <SectionTitle
              title={t("title")}
              description={t("description")}
              centered={false}
            />

            <div className="mt-6 border border-black bg-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center border border-black bg-white flex-shrink-0">
                  <Phone className="h-4 w-4 text-[#2563EB]" />
                </div>
                <a
                  href="tel:+5215525836217"
                  className="text-sm font-bold text-black font-mono tracking-tight hover:text-[#2563EB] transition-colors"
                >
                  +52 1 55 2583 6217
                </a>
              </div>
              <p className="mt-2 text-xs text-gray-700 leading-normal">
                {t("phoneDescription")}
              </p>
            </div>

            <div className="mt-6">
              <Link href="/contacto">
                <Button className="rounded-none bg-black px-6 py-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#2563EB] transition-colors shadow-none">
                  {t("button")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative min-h-[250px] md:min-h-full order-1 md:order-2 border-b md:border-b-0 md:border-l border-black">
            <Image
              src="https://plus.unsplash.com/premium_photo-1681967035389-84aabd80cb1e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt={t("imageAlt")}
              fill
              className="object-cover"
            />
          </div>

        </div>
      </div>
    </section>
  );
}

export default function Home() {
  useCart();

  return (
    <div className="bg-white min-h-screen">
      <HeroSection />
      <ProductsSection />
      <FeaturesSection />
      <PaymentSection />
      <ContactSection />
    </div>
  );
}
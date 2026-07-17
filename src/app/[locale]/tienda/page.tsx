"use client";

import React, { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { ProductFilters } from "@/types/product";
import { Link } from "@/i18n/routing";

import {
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatPrice } from "@/lib/price";

export default function StorePage() {
  const t = useTranslations("store");
  const locale = useLocale();

  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 15,
    search: "",
    categorySlug: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    featured: undefined,
    isNew: undefined,
    sortBy: "name",
  });

  const [searchInput, setSearchInput] = useState("");
  const { categories, loading: loadingCategories } = useCategories();
  const { products, loading: loadingProducts, pagination } = useProducts(filters);

  useEffect(() => {
    setSearchInput(filters.search || "");
  }, [filters.search]);

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      page: key !== "page" ? 1 : value,
      [key]: value === "" || value === undefined ? undefined : value,
    }));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange("search", searchInput);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setFilters({
      page: 1,
      limit: 15,
      search: "",
      categorySlug: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      featured: undefined,
      isNew: undefined,
      sortBy: "name",
    });
  };

  return (
    <>

      <main className="min-h-screen bg-white text-black font-sans">
        {/* HERO TÉCNICO */}
        <section className="relative border-b border-black bg-gray-100 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="border-l-4 border-[#2563EB] pl-4 max-w-4xl">
              <div className="inline-flex items-center gap-2 border border-black bg-white px-3 py-1 text-xs font-mono uppercase tracking-wider text-black mb-4">
                <Sparkles className="h-3.5 w-3.5 text-[#2563EB]" />
                <span>{t("hero.badge")}</span>
              </div>

              <h1 className="text-3xl font-black tracking-tight text-black md:text-5xl uppercase mb-4">
                {t("hero.title")}
              </h1>

              <p className="max-w-2xl text-sm leading-relaxed text-gray-700">
                {t("hero.description")}
              </p>
            </div>
          </div>
        </section>

        {/* CONTENIDO PRINCIPAL */}
        <section className="py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-4 lg:gap-8">

              {/* FILTROS LATERALES */}
              <aside className="hidden lg:block">
                <div className="sticky top-28 border border-black bg-white rounded-none shadow-none">
                  {/* Encabezado Filtros */}
                  <div className="border-b border-black bg-gray-50 px-5 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center border border-black bg-white text-black">
                          <SlidersHorizontal className="h-4 w-4" />
                        </div>
                        <div>
                          <h2 className="text-xs font-bold uppercase tracking-wide text-black">
                            {t("filters.title")}
                          </h2>
                          <p className="text-[10px] font-mono text-gray-500">
                            {t("filters.subtitle")}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={handleClearFilters}
                        className="text-[10px] font-mono font-bold uppercase text-[#2563EB] hover:underline"
                      >
                        {t("filters.clear")}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6 p-5">
                    {/* Categorías */}
                    <div>
                      <h3 className="mb-3 text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">
                        {t("filters.categories")}
                      </h3>

                      {loadingCategories ? (
                        <div className="space-y-2 animate-pulse">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="h-9 border border-gray-200 bg-gray-50" />
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <button
                            onClick={() => handleFilterChange("categorySlug", undefined)}
                            className={`w-full border text-left px-3 py-2 text-xs font-mono uppercase transition-colors rounded-none ${!filters.categorySlug
                                ? "border-black bg-black text-white"
                                : "border-gray-300 bg-white text-black hover:bg-gray-50"
                              }`}
                          >
                            {t("filters.allCategories")}
                          </button>

                          {categories.map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() => handleFilterChange("categorySlug", cat.slug)}
                              className={`w-full border text-left px-3 py-2 text-xs font-mono uppercase transition-colors rounded-none ${filters.categorySlug === cat.slug
                                  ? "border-black bg-[#2563EB] text-white"
                                  : "border-gray-300 bg-white text-black hover:bg-gray-50"
                                }`}
                            >
                              {locale === "es" ? cat.name : cat.name_english}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Rango de Precios */}
                    <div className="border-t border-black pt-5">
                      <h3 className="mb-3 text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">
                        {t("filters.priceRange")}
                      </h3>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder={t("filters.min")}
                          value={filters.minPrice || ""}
                          onChange={(e) =>
                            handleFilterChange(
                              "minPrice",
                              e.target.value ? Number(e.target.value) : undefined
                            )
                          }
                          className="h-10 w-full border border-black bg-white px-3 text-xs font-mono text-black outline-none focus:border-[#2563EB] rounded-none shadow-none"
                        />

                        <input
                          type="number"
                          placeholder={t("filters.max")}
                          value={filters.maxPrice || ""}
                          onChange={(e) =>
                            handleFilterChange(
                              "maxPrice",
                              e.target.value ? Number(e.target.value) : undefined
                            )
                          }
                          className="h-10 w-full border border-black bg-white px-3 text-xs font-mono text-black outline-none focus:border-[#2563EB] rounded-none shadow-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </aside>

              {/* CONTENEDOR DE PRODUCTOS */}
              <div className="space-y-6 lg:col-span-3">

                {/* BARRA SUPERIOR DE BÚSQUEDA */}
                <div className="border border-black bg-white p-4 rounded-none shadow-none">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                    {/* Buscador */}
                    <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-xl">
                      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder={t("search.placeholder")}
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="h-11 w-full border border-black bg-white pl-10 pr-24 text-xs text-black outline-none focus:border-[#2563EB] rounded-none shadow-none"
                      />
                      <button
                        type="submit"
                        className="absolute right-1 top-1 bottom-1 bg-black px-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#2563EB] transition-colors rounded-none"
                      >
                        {t("search.button")}
                      </button>
                    </form>

                    {/* Ordenamiento */}
                    <select
                      value={filters.sortBy || "name"}
                      onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                      className="h-11 border border-black bg-white px-3 text-xs font-mono uppercase text-black outline-none focus:border-[#2563EB] rounded-none shadow-none"
                    >
                      <option value="name">{t("sort.name")}</option>
                      <option value="price-asc">{t("sort.priceAsc")}</option>
                      <option value="price-desc">{t("sort.priceDesc")}</option>
                      <option value="newest">{t("sort.newest")}</option>
                    </select>
                  </div>
                </div>

                {/* INFORMACIÓN DE RESULTADOS */}
                <div className="flex items-center justify-between">
                  <p className="text-xs font-mono text-gray-600">
                    {t("results.showing")}{" "}
                    <span className="font-bold text-black">{products.length}</span>{" "}
                    {t("results.of")}{" "}
                    <span className="font-bold text-black">{pagination.total}</span>{" "}
                    {t("results.products")}
                  </p>

                  {filters.categorySlug && (
                    <div className="inline-flex items-center gap-1.5 border border-black bg-gray-100 px-3 py-1 text-[10px] font-mono font-bold uppercase text-[#2563EB] rounded-none">
                      <Star className="h-3 w-3 fill-current" />
                      <span>{filters.categorySlug.replace(/-/g, " ")}</span>
                    </div>
                  )}
                </div>

                {/* VISTA CUADRÍCULA DE PRODUCTOS */}
                {loadingProducts ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="border border-black bg-white p-4 animate-pulse rounded-none">
                        <div className="aspect-square bg-gray-100 mb-4 rounded-none" />
                        <div className="h-4 bg-gray-100 w-3/4 mb-2" />
                        <div className="h-3 bg-gray-100 w-1/2 mb-4" />
                        <div className="h-10 bg-gray-100" />
                      </div>
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <div className="border border-dashed border-black bg-white px-6 py-16 text-center rounded-none">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center border border-black bg-gray-50 text-gray-400">
                      <Search className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold uppercase tracking-tight text-black">
                      {t("empty.title")}
                    </h3>
                    <p className="mx-auto mb-6 max-w-sm text-xs text-gray-600">
                      {t("empty.description")}
                    </p>
                    <button
                      onClick={handleClearFilters}
                      className="bg-black px-5 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#2563EB] transition-colors rounded-none shadow-none"
                    >
                      {t("empty.button")}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {products.map((product) => (
                      <article
                        key={product.id}
                        className="group flex flex-col border border-black bg-white rounded-none shadow-none transition-colors hover:border-[#2563EB]"
                      >
                        {/* IMAGEN DE PRODUCTO */}
                        <div className="relative aspect-square overflow-hidden border-b border-black bg-gray-50 p-6 flex items-center justify-center">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="max-h-full max-w-full object-contain p-2"
                              loading="lazy"
                            />
                          ) : (
                            <div className="text-xs font-mono text-gray-400">
                              {t("product.noImage")}
                            </div>
                          )}

                          <div className="absolute left-3 top-3 flex flex-col gap-1">
                            {product.isNew && (
                              <span className="bg-black border border-white px-2 py-0.5 text-[9px] font-mono font-bold uppercase text-white">
                                {t("product.new")}
                              </span>
                            )}
                            {product.featured && (
                              <span className="bg-[#2563EB] px-2 py-0.5 text-[9px] font-mono font-bold uppercase text-white">
                                {t("product.featured")}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* DETALLES DE PRODUCTO */}
                        <div className="flex flex-1 flex-col p-4">
                          <div className="mb-4 flex-1">
                            <Link href={`/tienda/${product.slug}`}>
                              <h3 className="text-sm font-bold uppercase tracking-tight text-black group-hover:text-[#2563EB] transition-colors line-clamp-2">
                                {locale === "es" ? product.name : product.name_english}
                              </h3>
                            </Link>

                            <p className="mt-2 line-clamp-2 text-xs text-gray-600 leading-normal">
                              {locale === "es" ? product.description : product.description_english}
                            </p>
                          </div>

                          <div className="mt-auto border-t border-gray-200 pt-3 flex items-end justify-between gap-2">
                            <div>
                              <span className="mb-0.5 block text-[9px] font-mono text-gray-400 uppercase">
                                {t("product.price")}
                              </span>
                              <span className="text-base font-black font-mono text-black">
                                {formatPrice(product.price)}
                                <span className="text-[10px] font-normal text-gray-500 lowercase ml-0.5">
                                  {t("tax")}
                                </span>
                              </span>
                            </div>

                            <Link
                              href={`/tienda/${product.slug}`}
                              className="border border-black bg-white px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-black hover:bg-black hover:text-white transition-colors rounded-none"
                            >
                              {t("product.viewDetail")}
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}

                {/* PAGINACIÓN TÉCNICA */}
                {!loadingProducts && pagination.totalPages > 1 && (
                  <div className="flex flex-col gap-3 border border-black bg-white p-4 sm:flex-row sm:items-center sm:justify-between rounded-none shadow-none">
                    <button
                      onClick={() => handleFilterChange("page", Math.max(pagination.page - 1, 1))}
                      disabled={pagination.page === 1}
                      className="inline-flex h-9 items-center justify-center gap-1.5 border border-black bg-gray-50 px-4 text-xs font-bold uppercase text-black hover:bg-black hover:text-white disabled:opacity-30 disabled:cursor-not-allowed rounded-none transition-colors"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      {t("pagination.previous")}
                    </button>

                    <div className="flex flex-wrap items-center justify-center gap-1">
                      {Array.from({ length: pagination.totalPages }, (_, index) => {
                        const pageNum = index + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handleFilterChange("page", pageNum)}
                            className={`h-9 w-9 border text-xs font-mono font-bold rounded-none transition-colors ${pagination.page === pageNum
                                ? "border-black bg-[#2563EB] text-white"
                                : "border-gray-300 bg-white text-black hover:bg-gray-50"
                              }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handleFilterChange("page", Math.min(pagination.page + 1, pagination.totalPages))}
                      disabled={pagination.page === pagination.totalPages}
                      className="inline-flex h-9 items-center justify-center gap-1.5 border border-black bg-gray-50 px-4 text-xs font-bold uppercase text-black hover:bg-black hover:text-white disabled:opacity-30 disabled:cursor-not-allowed rounded-none transition-colors"
                    >
                      {t("pagination.next")}
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}

              </div>
            </div>
          </div>
        </section>
      </main>

    </>
  );
}
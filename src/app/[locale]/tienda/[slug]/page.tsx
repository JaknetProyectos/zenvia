'use client';

import React, { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import {
  ShoppingCart,
  Check,
  Minus,
  Plus,
  Package,
  ArrowRight,
} from 'lucide-react';

import { useProducts } from '@/hooks/useProducts';
import { useProduct } from '@/hooks/useProduct';
import { useCart } from '@/context/CartContext';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { formatPrice } from '@/lib/price';

export default function ProductDetailPage() {
  const t = useTranslations('productDetail');

  const params = useParams();
  const router = useRouter();

  const slugOrId = params?.slug as string;

  const [quantity, setQuantity] = useState<number>(1);
  const language = useLocale();

  const [isAdding, setIsAdding] = useState<boolean>(false);

  const { product, loading, error } = useProduct(slugOrId);

  const { products: relatedProducts, loading: loadingRelated } =
    useProducts({
      categorySlug: product?.category_slug || undefined,
      limit: 5,
    });

  const { addItem, getItemQuantity } = useCart();

  const currentInCartCount = product
    ? getItemQuantity(product.id)
    : 0;

  const cleanRelatedProducts = useMemo(() => {
    return relatedProducts
      .filter((item) => item.id !== product?.id)
      .slice(0, 4);
  }, [relatedProducts, product]);

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product) return;

    setIsAdding(true);

    addItem(product, quantity);

    setTimeout(() => {
      setIsAdding(false);
      setQuantity(1);
    }, 1000);
  };

  if (loading) {
    return (
      <>
        
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
          <div className="w-full max-w-lg bg-white border border-black p-12 text-center rounded-none shadow-none">
            <div className="w-12 h-12 border-2 border-black border-t-[#2563EB] animate-spin mx-auto mb-6 rounded-none" />
            <h2 className="text-xl font-bold text-black uppercase tracking-tight mb-2">
              {t('loadingTitle')}
            </h2>
            <p className="text-xs font-mono text-gray-600">
              {t('loadingDescription')}
            </p>
          </div>
        </div>
        
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-24">
          <div className="w-full max-w-lg bg-white border border-black p-10 text-center rounded-none shadow-none">
            <div className="w-16 h-16 bg-gray-100 border border-black flex items-center justify-center mx-auto mb-6 rounded-none">
              <Package className="w-6 h-6 text-black" />
            </div>
            <h2 className="text-2xl font-black text-black uppercase tracking-tight mb-4">
              {t('notFoundTitle')}
            </h2>
            <p className="text-xs text-gray-600 mb-8 font-mono">
              {t('notFoundDescription')}
            </p>
            <button
              onClick={() => router.push('/tienda')}
              className="w-full h-12 bg-black hover:bg-[#2563EB] text-white text-xs font-bold uppercase tracking-wider transition-colors rounded-none shadow-none"
            >
              {t('backToStore')}
            </button>
          </div>
        </div>
        
      </>
    );
  }

  return (
    <>
      
      <main className="min-h-screen bg-white pb-24 text-black font-sans">
        
        {/* HERO CONTENEDOR TÉCNICO */}
        <section className="relative border-b border-black bg-gray-50 py-12">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-0 border border-black bg-white">
              
              {/* VISTA DE IMAGEN */}
              <div className="bg-white border-b lg:border-b-0 lg:border-r border-black p-6 flex items-center justify-center relative">
                <div className="relative w-full aspect-square border border-gray-300 p-2 bg-white flex items-center justify-center">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={
                        language === 'es'
                          ? product.name
                          : product.name_english || product.name
                      }
                      className="object-contain w-full h-full p-4 transition-none"
                    />
                  ) : (
                    <div className="text-xs font-mono text-gray-500">
                      {t('noImage')}
                    </div>
                  )}

                  {/* Etiquetas Técnicas Rígidas */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                    {product.isNew && (
                      <span className="px-2 py-1 border border-black bg-black text-white text-[9px] font-mono font-bold uppercase tracking-wider">
                        {t('new')}
                      </span>
                    )}
                    {product.featured && (
                      <span className="px-2 py-1 border border-black bg-[#2563EB] text-white text-[9px] font-mono font-bold uppercase tracking-wider">
                        {t('featured')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* PANEL DE INFORMACIÓN */}
              <div className="flex flex-col justify-between bg-white">
                <div className="p-8 md:p-10 border-b border-black flex-1">
                  <div className="border-l-4 border-[#2563EB] pl-4 mb-6">
                    <h1 className="text-2xl md:text-4xl font-black text-black uppercase tracking-tight leading-tight">
                      {language === 'es'
                        ? product.name
                        : product.name_english || product.name}
                    </h1>
                  </div>

                  {/* PRECIO PLANO */}
                  <div className="border border-black bg-gray-50 p-5 mb-6 rounded-none">
                    <span className="text-[10px] uppercase tracking-wider text-gray-500 font-mono font-bold block mb-1">
                      {t('price')}
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl md:text-4xl font-black font-mono tracking-tight text-black">
                        ${formatPrice(product.price)}
                      </span>
                      <span className="text-[11px] font-mono uppercase tracking-wide text-gray-500">
                        {t('tax')}
                      </span>
                    </div>
                  </div>

                  {/* ESPECIFICACIÓN / DESCRIPCIÓN */}
                  <div>
                    <h2 className="text-[10px] uppercase tracking-wider font-mono font-bold text-[#2563EB] mb-3">
                      {t('description')}
                    </h2>
                    <p className="text-sm text-gray-700 leading-relaxed font-sans max-w-xl">
                      {language === 'es'
                        ? product.description
                        : product.description_english}
                    </p>
                  </div>
                </div>

                {/* COMPRA INDUSTRIAL RESPONSIVA */}
                <div className="p-6 md:p-8 bg-gray-50 flex flex-col sm:flex-row gap-4">
                  {/* SELECTOR CANTIDAD RÍGIDO (Más alto en móvil) */}
                  <div className="flex items-center justify-between border border-black bg-white h-14 sm:h-12 sm:w-44 rounded-none w-full">
                    <button
                      type="button"
                      onClick={handleDecrement}
                      className="w-12 sm:w-10 h-full flex items-center justify-center border-r border-black hover:bg-gray-100 transition-colors rounded-none"
                    >
                      <Minus className="w-3.5 h-3.5 text-black" />
                    </button>
                    <span className="font-mono font-bold text-black text-base sm:text-sm">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={handleIncrement}
                      className="w-12 sm:w-10 h-full flex items-center justify-center border-l border-black hover:bg-gray-100 transition-colors rounded-none"
                    >
                      <Plus className="w-3.5 h-3.5 text-black" />
                    </button>
                  </div>

                  {/* ACCIÓN DE AGREGAR ROBUSTA */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className={`w-full sm:flex-1 h-14 sm:h-12 text-sm sm:text-xs font-bold uppercase tracking-wider transition-colors rounded-none flex items-center justify-center gap-2 border border-black ${
                      isAdding
                        ? 'bg-green-100 text-green-800 border-green-800'
                        : 'bg-black text-white hover:bg-[#2563EB] hover:border-[#2563EB]'
                    }`}
                  >
                    {isAdding ? (
                      <>
                        <Check className="w-4 h-4" />
                        {t('added')}
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        {t('addToCart')}
                      </>
                    )}
                  </button>
                </div>

                {currentInCartCount > 0 && (
                  <div className="border-t border-black bg-blue-50 px-6 py-3 text-xs text-blue-900 font-mono rounded-none">
                    {t('cartQuantityText')}{' '}
                    <span className="font-bold underline">
                      {currentInCartCount}
                    </span>{' '}
                    {t('cartQuantityUnits')}
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* PRODUCTOS RELACIONADOS CENTRADOS SIMÉTRICAMENTE */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 border-b border-black pb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-black uppercase tracking-tight">
                {t('relatedTitle')}
              </h2>
              <p className="text-xs text-gray-600 mt-1 font-mono">
                {t('relatedDescription')}
              </p>
            </div>
            <button
              onClick={() => router.push('/tienda')}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2563EB] hover:text-black transition-colors font-mono"
            >
              {t('viewAll')}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loadingRelated ? (
            <div className="flex flex-wrap justify-center border border-black bg-gray-200 gap-0">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white p-6 border-r border-b border-black last:border-r-0 animate-pulse rounded-none w-full sm:w-1/2 md:w-1/3 xl:w-1/4">
                  <div className="aspect-square bg-gray-100 rounded-none mb-4" />
                  <div className="h-3 bg-gray-200 w-3/4 mb-2 rounded-none" />
                  <div className="h-3 bg-gray-200 w-1/2 rounded-none" />
                </div>
              ))}
            </div>
          ) : cleanRelatedProducts.length === 0 ? (
            <div className="bg-white border border-black py-16 px-4 text-center rounded-none">
              <div className="w-12 h-12 border border-black bg-gray-50 flex items-center justify-center mx-auto mb-4 rounded-none">
                <Package className="w-5 h-5 text-black" />
              </div>
              <h3 className="text-base font-bold text-black uppercase tracking-tight mb-2">
                {t('noRelatedTitle')}
              </h3>
              <p className="text-xs text-gray-600 max-w-sm mx-auto font-mono">
                {t('noRelatedDescription')}
              </p>
            </div>
          ) : (
            /* grid cambiado por flexbox estructurado y centrado para evitar el vacío lateral si faltan elementos */
            <div className="flex flex-wrap justify-center border-t border-l border-black bg-gray-200 gap-0">
              {cleanRelatedProducts.slice(0, 4).map((relProd) => (
                <article
                  key={relProd.id}
                  onClick={() => {
                    router.push(`/tienda/${relProd.slug}`);
                    setQuantity(1);
                  }}
                  className="group bg-white p-5 border-b border-r border-black cursor-pointer flex flex-col justify-between hover:bg-gray-50 transition-colors w-full sm:w-1/2 md:w-1/3 xl:w-1/4"
                >
                  <div>
                    <div className="relative aspect-square border border-gray-200 bg-white p-2 mb-4 flex items-center justify-center">
                      <img
                        src={relProd.image}
                        alt={relProd.name}
                        className="object-contain w-full h-full p-2 transition-none"
                      />
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {relProd.isNew && (
                          <span className="px-1.5 py-0.5 border border-black bg-black text-white text-[8px] font-mono font-bold uppercase">
                            {t('new')}
                          </span>
                        )}
                        {relProd.featured && (
                          <span className="px-1.5 py-0.5 border border-black bg-[#2563EB] text-white text-[8px] font-mono font-bold uppercase">
                            {t('featured')}
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="font-bold text-black text-xs uppercase tracking-tight line-clamp-2 group-hover:text-[#2563EB] transition-colors">
                      {language == 'es' ? relProd.name : relProd.name_english}
                    </h3>
                    <p className="text-[11px] text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                      {language == 'es' ? relProd.description : relProd.description_english}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between gap-2">
                    <div>
                      <span className="block text-[9px] font-mono uppercase text-gray-400">
                        {t('price')}
                      </span>
                      <span className="font-bold font-mono text-xs text-black">
                        ${formatPrice(relProd.price)} <span className="text-[9px] font-normal text-gray-500 font-sans">{t('tax')}</span>
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase text-[#2563EB]">
                      {t('viewDetail')}
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      
    </>
  );
}
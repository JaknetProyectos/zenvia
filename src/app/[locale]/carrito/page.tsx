"use client";

import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ChevronLeft,
  CreditCard,
  User,
  MapPin,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { processOctanoPayment } from "@/lib/payment";
import { formatPrice } from "@/lib/price";

const VALID_COUPONS = [
  { code: "MED10", discount: 0.1 },
  { code: "CONFIANZA15", discount: 0.15 },
  { code: "PROMO20", discount: 0.2 },
];

type Step = 1 | 2 | 3;

function CardShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border border-neutral-200 bg-white rounded-none transition-all duration-200 ${className}`}
    >
      {children}
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-neutral-200 pb-3">
      <Icon className="h-4 w-4 text-neutral-900 stroke-[1.5]" />
      <h3 className="text-xs font-semibold tracking-widest uppercase text-neutral-900">
        {title}
      </h3>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
  className = "",
  maxLength,
  mono = false,
  inputClassName = "",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  maxLength?: number;
  mono?: boolean;
  inputClassName?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-[10px] font-medium tracking-wider uppercase text-neutral-500">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full rounded-none border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-0 ${
          mono ? "font-mono" : ""
        } ${inputClassName}`}
      />
    </div>
  );
}

export default function CarritoCheckoutPage() {
  const t = useTranslations("cartPage");
  const locale = useLocale();

  const { items, total, updateQuantity, removeItem, clearCart } = useCart();

  const [step, setStep] = useState<Step>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successData, setSuccessData] = useState<any>(null);

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    empresa: "",
    direccion: "",
    direccion2: "",
    ciudad: "",
    estado: "",
    cp: "",
    pais: "MX",
    cardNumber: "",
    cardName: "",
    cardMonth: "",
    cardYear: "",
    cardCvv: "",
  });

  const discountAmount = appliedCoupon ? total * appliedCoupon.discount : 0;
  const totalWithDiscount = total - discountAmount;
  const iva = totalWithDiscount * 0.16;
  const grandTotal = totalWithDiscount + iva;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = (e: FormEvent) => {
    e.preventDefault();
    setCouponError("");

    const found = VALID_COUPONS.find(
      (c) => c.code === couponInput.trim().toUpperCase()
    );

    if (found) {
      setAppliedCoupon(found);
      setCouponInput("");
      return;
    }

    setCouponError(t("financial.couponInvalid"));
  };

  const handleCheckoutSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage("");

    const uniqueOrderId = `MC-${Date.now()}`;

    const paymentPayload = {
      amount: Number(grandTotal.toFixed(2)),
      orderId: uniqueOrderId,
      cardData: {
        number: formData.cardNumber.replace(/\s/g, ""),
        name: formData.cardName.trim(),
        month: formData.cardMonth.padStart(2, "0"),
        year: formData.cardYear.trim(),
        cvv: formData.cardCvv.trim(),
      },
      customer: {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        email: formData.email.trim(),
        telefono: formData.telefono.trim(),
        direccion: formData.direccion.trim(),
        direccion2: formData.direccion2.trim() || undefined,
        ciudad: formData.ciudad.trim(),
        estado: formData.estado.trim(),
        pais: formData.pais,
        cp: formData.cp.trim(),
        empresa: formData.empresa.trim() || undefined,
      },
      metadata: {
        notes: appliedCoupon
          ? `${t("metadata.couponApplied")}: ${appliedCoupon.code}`
          : t("metadata.standardSale"),
      },
    };

    try {
      const response = await processOctanoPayment(paymentPayload);

      if (response.success) {
        setSuccessData(response.data);

        try {
          await fetch("/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: uniqueOrderId,
              amount: paymentPayload.amount,
              customer: paymentPayload.customer,
              items,
              metadata: paymentPayload.metadata,
              locale
            }),
          });
        } catch (emailError) {
          console.error("⚠️ Falló el despacho de correos informativos:", emailError);
        }

        clearCart();
        setStep(3);
      } else {
        setErrorMessage(response.error || t("errors.declined"));
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(t("errors.connection"));
    } finally {
      setIsProcessing(false);
    }
  };

  if (step === 3) {
    return (
      <main className="flex min-h-screen flex-col justify-between bg-neutral-50 font-sans antialiased">
        <section className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-6 py-20 text-center">
          <div className="mb-6 flex h-14 w-14 items-center justify-center border border-neutral-900 bg-blue-600 text-white rounded-none">
            <CheckCircle2 className="h-6 w-6 stroke-[1.5]" />
          </div>
          <h1 className="mb-3 text-2xl font-light tracking-wide uppercase text-neutral-900">
            {t("success.title")}
          </h1>
          <p className="mb-8 text-sm text-neutral-500 max-w-md">
            {t("success.description")}
          </p>

          <CardShell className="mb-8 w-full p-6 text-left border-neutral-300">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium tracking-wider uppercase text-neutral-400">
                {t("success.transactionStatus")}
              </span>
              <span className="bg-neutral-900 px-3 py-1 text-[10px] font-mono tracking-widest uppercase font-semibold text-white">
                {t("success.approved")}
              </span>
            </div>
          </CardShell>

          <Link href="/tienda" className="w-full">
            <Button className="w-full rounded-none bg-blue-600 py-6 text-xs font-semibold tracking-widest uppercase text-white transition-colors hover:bg-neutral-800 focus:ring-0">
              {t("success.backToCatalog")}
            </Button>
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 font-sans antialiased">
      <div className="sticky top-0 z-10 border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-stretch justify-between gap-4 px-6 py-4 sm:flex-row sm:items-center lg:px-8">
          <nav className="flex items-center gap-2 text-[10px] font-medium tracking-widest uppercase text-neutral-400">
            <Link href="/" className="transition-colors hover:text-neutral-900">
              {t("breadcrumb.home")}
            </Link>
            <span className="text-neutral-300">/</span>
            <span className={step === 1 ? "font-bold text-neutral-900" : ""}>
              {t("breadcrumb.summary")}
            </span>
            <span className="text-neutral-300">/</span>
            <span className={step === 2 ? "font-bold text-neutral-900" : ""}>
              {t("breadcrumb.shippingPayment")}
            </span>
          </nav>

          <div className="flex items-center gap-1.5 h-1">
            <div className={`h-[3px] w-8 transition-colors duration-300 ${step >= 1 ? "bg-neutral-900" : "bg-neutral-200"}`} />
            <div className={`h-[3px] w-8 transition-colors duration-300 ${step >= 2 ? "bg-neutral-900" : "bg-neutral-200"}`} />
          </div>
        </div>
      </div>

      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {items.length === 0 ? (
            <CardShell className="mx-auto max-w-md p-12 text-center border-neutral-200">
              <ShoppingBag className="mx-auto mb-5 h-10 w-10 text-neutral-300 stroke-[1]" />
              <h2 className="mb-2 text-lg font-light tracking-wide uppercase text-neutral-900">
                {t("empty.title")}
              </h2>
              <p className="mb-8 text-xs text-neutral-500">
                {t("empty.description")}
              </p>
              <Link href="/tienda">
                <Button className="rounded-none bg-blue-600 px-8 py-5 text-xs font-semibold tracking-widest uppercase text-white transition-colors hover:bg-neutral-800">
                  {t("empty.goToStore")}
                </Button>
              </Link>
            </CardShell>
          ) : (
            <div className="grid items-start gap-8 lg:grid-cols-3">
              <div className="space-y-4 lg:col-span-2">
                {errorMessage && (
                  <div className="flex items-center gap-3 rounded-none border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-800">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0 text-red-600" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-4">
                    <CardShell className="flex items-center justify-between p-4 border-neutral-200 bg-white">
                      <h2 className="text-xs font-semibold tracking-widest uppercase text-neutral-900">
                        {t("order.title")}
                      </h2>
                      <button
                        type="button"
                        onClick={clearCart}
                        className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider uppercase text-neutral-400 transition-colors hover:text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> {t("order.clear")}
                      </button>
                    </CardShell>

                    {items.map((item) => (
                      <CardShell key={item.product.id} className="flex gap-6 p-5 border-neutral-200 bg-white">
                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden border border-neutral-100 bg-neutral-50 rounded-none">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-contain p-2  hover:-0 transition-all duration-300"
                          />
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col justify-between">
                          <div className="flex justify-between gap-4">
                            <div className="min-w-0">
                              <span className="text-[9px] font-semibold tracking-widest uppercase text-neutral-400 block mb-1">
                                {item.product.category_slug}
                              </span>
                              <h3 className="line-clamp-1 text-xs font-medium tracking-wide uppercase text-neutral-900">
                                {item.product.name}
                              </h3>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item.product.id)}
                              className="p-1 text-neutral-400 transition-colors hover:text-neutral-900"
                            >
                              <Trash2 className="h-4 w-4 stroke-[1.5]" />
                            </button>
                          </div>

                          <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3">
                            <div className="flex items-center border border-neutral-200 bg-white">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(item.product.id, item.quantity - 1)
                                }
                                className="p-2 text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-8 text-center text-xs font-mono font-medium text-neutral-900">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(item.product.id, item.quantity + 1)
                                }
                                className="p-2 text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <span className="text-sm font-mono font-medium tracking-tight text-neutral-900">
                              {formatPrice(item.product.price * item.quantity, "MXN", true)}
                            </span>
                          </div>
                        </div>
                      </CardShell>
                    ))}
                  </div>
                )}

                {step === 2 && (
                  <form
                    id="keycop-payment-form"
                    onSubmit={handleCheckoutSubmit}
                    className="space-y-6"
                  >
                    <CardShell className="space-y-5 p-6 border-neutral-200 bg-white">
                      <SectionTitle icon={User} title={t("form.buyerTitle")} />
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field
                          label={t("form.firstName")}
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleInputChange}
                          required
                        />
                        <Field
                          label={t("form.lastName")}
                          name="apellido"
                          value={formData.apellido}
                          onChange={handleInputChange}
                          required
                        />
                        <Field
                          label={t("form.email")}
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                        <Field
                          label={t("form.phone")}
                          name="telefono"
                          type="tel"
                          value={formData.telefono}
                          onChange={handleInputChange}
                          required
                        />
                        <Field
                          label={t("form.company")}
                          name="empresa"
                          value={formData.empresa}
                          onChange={handleInputChange}
                          className="sm:col-span-2"
                        />
                      </div>
                    </CardShell>

                    <CardShell className="space-y-5 p-6 border-neutral-200 bg-white">
                      <SectionTitle icon={MapPin} title={t("form.addressTitle")} />
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field
                          label={t("form.streetAddress")}
                          name="direccion"
                          value={formData.direccion}
                          onChange={handleInputChange}
                          required
                          placeholder={t("form.streetAddressPlaceholder")}
                          className="sm:col-span-2"
                        />
                        <Field
                          label={t("form.neighborhood")}
                          name="direccion2"
                          value={formData.direccion2}
                          onChange={handleInputChange}
                          placeholder={t("form.neighborhoodPlaceholder")}
                          className="sm:col-span-2"
                        />
                        <Field
                          label={t("form.city")}
                          name="ciudad"
                          value={formData.ciudad}
                          onChange={handleInputChange}
                          required
                        />
                        <Field
                          label={t("form.state")}
                          name="estado"
                          value={formData.estado}
                          onChange={handleInputChange}
                          required
                          placeholder={t("form.statePlaceholder")}
                        />
                        <Field
                          label={t("form.postalCode")}
                          name="cp"
                          value={formData.cp}
                          onChange={handleInputChange}
                          required
                        />
                        <div>
                          <label className="mb-1.5 block text-[10px] font-medium tracking-wider uppercase text-neutral-500">
                            {t("form.country")}
                          </label>
                          <select
                            name="pais"
                            value={formData.pais}
                            onChange={handleInputChange}
                            className="w-full rounded-none border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-900 focus:ring-0"
                          >
                            <option value="MX">{t("form.mexico")}</option>
                          </select>
                        </div>
                      </div>
                    </CardShell>

                    <CardShell className="space-y-5 p-6 border-neutral-200 bg-white">
                      <SectionTitle icon={CreditCard} title={t("form.paymentTitle")} />
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <Field
                          label={t("form.cardNumber")}
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          required
                          maxLength={16}
                          placeholder={t("form.cardNumberPlaceholder")}
                          className="sm:col-span-3"
                          mono
                          inputClassName="tracking-widest"
                        />
                        <Field
                          label={t("form.cardHolderName")}
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleInputChange}
                          required
                          placeholder={t("form.cardHolderPlaceholder")}
                          className="sm:col-span-3"
                        />
                        <Field
                          label={t("form.expiryMonth")}
                          name="cardMonth"
                          value={formData.cardMonth}
                          onChange={handleInputChange}
                          required
                          maxLength={2}
                          placeholder={t("form.expiryMonthPlaceholder")}
                          mono
                          inputClassName="text-center"
                        />
                        <Field
                          label={t("form.expiryYear")}
                          name="cardYear"
                          value={formData.cardYear}
                          onChange={handleInputChange}
                          required
                          maxLength={4}
                          placeholder={t("form.expiryYearPlaceholder")}
                          mono
                          inputClassName="text-center"
                        />
                        <Field
                          label={t("form.cvv")}
                          name="cardCvv"
                          type="password"
                          value={formData.cardCvv}
                          onChange={handleInputChange}
                          required
                          maxLength={4}
                          placeholder={t("form.cvvPlaceholder")}
                          mono
                          inputClassName="text-center"
                        />
                      </div>
                    </CardShell>
                  </form>
                )}
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6 border border-neutral-200 bg-white p-6 rounded-none shadow-none">
                  <h2 className="text-xs font-semibold tracking-widest uppercase text-neutral-900">
                    {t("financial.title")}
                  </h2>

                  {step === 1 && (
                    <div className="space-y-3 border-b border-neutral-100 pb-5">
                      {!appliedCoupon ? (
                        <form onSubmit={handleApplyCoupon} className="flex gap-2">
                          <input
                            type="text"
                            placeholder={t("financial.couponPlaceholder")}
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            className="flex-1 rounded-none border border-neutral-200 bg-white px-3 py-2 text-xs font-mono uppercase text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900"
                          />
                          <button
                            type="submit"
                            className="rounded-none bg-neutral-900 px-4 text-xs font-medium tracking-wider uppercase text-white transition-colors hover:bg-neutral-800"
                          >
                            {t("financial.applyCoupon")}
                          </button>
                        </form>
                      ) : (
                        <div className="flex items-center justify-between border border-neutral-200 bg-neutral-50 p-3 rounded-none">
                          <div className="text-xs font-medium text-neutral-700">
                            {t("financial.appliedCoupon", {
                              code: appliedCoupon.code,
                              discount: appliedCoupon.discount * 100,
                            })}
                          </div>
                          <button
                            type="button"
                            onClick={() => setAppliedCoupon(null)}
                            className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 transition-colors hover:text-neutral-900 underline"
                          >
                            {t("financial.remove")}
                          </button>
                        </div>
                      )}
                      {couponError && (
                        <p className="text-[10px] font-medium tracking-wide text-red-600">
                          ⚠️ {couponError}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="space-y-3 border-b border-neutral-100 pb-5 text-xs font-medium text-neutral-500">
                    <div className="flex justify-between items-center">
                      <span className="tracking-wide uppercase text-[11px] text-neutral-400">{t("financial.subtotal")}</span>
                      <span className="font-mono text-neutral-900 font-medium">
                        {formatPrice(total, "MXN", true)}
                      </span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between items-center text-neutral-900">
                        <span className="tracking-wide uppercase text-[11px] text-neutral-400">{t("financial.discount")}</span>
                        <span className="font-mono font-medium">
                          -{formatPrice(discountAmount, "MXN", true)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-semibold tracking-widest uppercase text-neutral-900">
                        {t("financial.netTotal")}
                      </span>
                      <span className="text-2xl font-mono font-normal tracking-tight text-neutral-900">
                        {formatPrice(grandTotal, "MXN", true)}
                      </span>
                    </div>
                    <p className="text-right text-[10px] font-mono text-neutral-400">
                      {t("financial.tax", {
                        tax: formatPrice(iva, "MXN", true),
                      })}
                    </p>
                  </div>

                  {step === 1 ? (
                    <Button
                      onClick={() => setStep(2)}
                      className="w-full rounded-none bg-blue-600 py-6 text-xs font-semibold tracking-widest uppercase text-white transition-all hover:bg-neutral-800"
                    >
                      {t("actions.proceedToPayment")}
                      <ArrowRight className="ml-2 h-3.5 w-3.5 stroke-[2]" />
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <Button
                        type="submit"
                        form="keycop-payment-form"
                        disabled={isProcessing}
                        className={`w-full rounded-none py-6 text-xs font-semibold tracking-widest uppercase text-white transition ${
                          isProcessing
                            ? "cursor-wait bg-neutral-400"
                            : "bg-blue-600 hover:bg-neutral-800"
                        }`}
                      >
                        {isProcessing
                          ? t("actions.processing")
                          : t("actions.payAmount", {
                              amount: formatPrice(grandTotal, "MXN", true),
                            })}
                      </Button>

                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => setStep(1)}
                        className="flex w-full items-center justify-center gap-1 py-2 text-center text-[10px] font-semibold tracking-widest uppercase text-neutral-400 transition-colors hover:text-neutral-900"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                        {t("actions.backToCart")}
                      </button>
                    </div>
                  )}

                  <div className="border-t border-neutral-100 pt-5 text-center">
                    <p className="text-[10px] tracking-wide text-neutral-400 leading-relaxed">
                      {t("security.note")}
                    </p>
                    <div className="mt-5 flex flex-row items-center justify-center gap-6 opacity-40  contrast-200 transition-all duration-300 hover:opacity-80">
                      <Image
                        src="/logo-keycop.webp"
                        alt={t("images.octanoAlt")}
                        width={110}
                        height={22}
                        className="object-contain"
                      />
                      <Image
                        src="/secure-payment.png"
                        alt={t("images.securePaymentAlt")}
                        width={110}
                        height={22}
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
"use client";

import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { useCart } from "@/context/CartContext";
import { useContact } from "@/hooks/useContact";

export default function ContactoPage() {
  const t = useTranslations("contactPage");

  const contactInfo = [
    {
      icon: MapPin,
      title: t("info.visit.title"),
      subtitle: t("info.visit.subtitle"),
      details: [
        t("info.visit.address1"),
        t("info.visit.address2"),
        t("info.visit.address3"),
        t("info.visit.address4"),
        t("info.visit.address5"),
      ],
    },
    {
      icon: Phone,
      title: t("info.call.title"),
      subtitle: t("info.call.subtitle"),
      details: ["+52 1 55 2583 6217"],
      link: "tel:+5215525836217",
    },
    {
      icon: Mail,
      title: t("info.email.title"),
      subtitle: t("info.email.subtitle"),
      details: ["hello@zenvia.com.mx"],
      link: "mailto:hello@zenvia.com.mx",
    },
  ];

  useCart();
  const { sendContactForm, isLoading } = useContact();

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    const response = await sendContactForm(formData);

    if (response.success) {
      setIsSubmitted(true);
      setFormData({
        nombre: "",
        email: "",
        mensaje: "",
      });
      setTimeout(() => setIsSubmitted(false), 5000);
    } else {
      setSubmitError(response.error || t("errors.unexpected"));
    }
  };

  return (
    <main className="min-h-screen bg-white text-black font-sans">

      {/* HERO TÉCNICO */}
      <section className="relative border-b border-black bg-gray-100 py-16 md:py-20">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-l-4 border-[#2563EB] pl-4 max-w-4xl">
            <div className="inline-block border border-black bg-white px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-black mb-3">
              {t("hero.title")}
            </div>

            <h1 className="text-3xl font-black tracking-tight text-black md:text-5xl uppercase">
              {t("hero.title")}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-700">
              {t("hero.description")}
            </p>
          </div>
        </div>
      </section>

      {/* TARJETAS DE INFORMACIÓN */}
      <section className="relative py-12 border-b border-black bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-0 border border-black bg-gray-200 lg:grid-cols-3">
            {contactInfo.map((info, index) => (
              <div
                key={`contact-${index}`}
                className="relative bg-white p-8 border-b border-r last:border-r-0 border-black lg:border-b-0"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center border border-black bg-gray-100 text-black">
                    <info.icon className="h-4 w-4" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#2563EB] font-bold">
                    {info.subtitle}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-black uppercase tracking-tight mb-4">
                  {info.title}
                </h3>

                {info.link ? (
                  <a
                    href={info.link}
                    className="text-xs font-mono font-bold text-black hover:text-[#2563EB] transition-colors underline decoration-1"
                  >
                    {info.details[0]}
                  </a>
                ) : (
                  <div className="space-y-1">
                    {info.details.map((detail, i) => (
                      <p key={`detail-${i}`} className="text-xs text-gray-700 leading-normal">
                        {detail}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORMULARIO Y MAPA INTEGRADOS */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-0 border border-black bg-white lg:grid-cols-2">
            
            {/* CONTENEDOR FORMULARIO */}
            <div className="p-8 md:p-10 border-b lg:border-b-0 lg:border-r border-black bg-white">
              <div className="mb-8">
                <div className="inline-block border border-black bg-gray-100 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-black mb-3">
                  {t("form.title")}
                </div>
                <h2 className="text-2xl font-black text-black uppercase tracking-tight">
                  {t("form.title")}
                </h2>
                <p className="mt-2 text-xs text-gray-700 leading-relaxed">
                  {t("form.description")}
                </p>
              </div>

              {submitError && (
                <div className="mb-6 flex items-start gap-3 border border-red-400 bg-red-50 p-4 text-xs font-mono text-red-700 rounded-none">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}

              {isSubmitted ? (
                <div className="border border-black bg-[#2563EB] px-6 py-12 text-center text-white rounded-none">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center border border-white bg-white/10">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-white">
                    {t("success.title")}
                  </h3>
                  <p className="mx-auto mt-2 max-w-sm text-xs text-white/90 leading-relaxed">
                    {t("success.description")}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="nombre"
                        className="mb-1.5 block text-[10px] font-mono font-bold uppercase tracking-wider text-black"
                      >
                        {t("form.fullName")}
                      </label>
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        required
                        disabled={isLoading}
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder={t("form.fullNamePlaceholder")}
                        className="h-11 w-full border border-black bg-white px-3 text-xs text-black outline-none placeholder:text-gray-400 focus:border-[#2563EB] disabled:bg-gray-100 rounded-none shadow-none transition-colors"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="mb-1.5 block text-[10px] font-mono font-bold uppercase tracking-wider text-black"
                      >
                        {t("form.email")}
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        disabled={isLoading}
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={t("form.emailPlaceholder")}
                        className="h-11 w-full border border-black bg-white px-3 text-xs text-black outline-none placeholder:text-gray-400 focus:border-[#2563EB] disabled:bg-gray-100 rounded-none shadow-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="mensaje"
                      className="mb-1.5 block text-[10px] font-mono font-bold uppercase tracking-wider text-black"
                    >
                      {t("form.message")}
                    </label>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      required
                      disabled={isLoading}
                      rows={6}
                      value={formData.mensaje}
                      onChange={handleChange}
                      placeholder={t("form.messagePlaceholder")}
                      className="w-full resize-none border border-black bg-white px-3 py-3 text-xs text-black outline-none placeholder:text-gray-400 focus:border-[#2563EB] disabled:bg-gray-100 rounded-none shadow-none transition-colors"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-12 w-full bg-black text-xs font-bold uppercase tracking-wider text-white hover:bg-[#2563EB] transition-colors rounded-none shadow-none"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("form.sending")}
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        {t("form.submit")}
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* CONTENEDOR MAPA */}
            <div className="flex flex-col h-full bg-white">
              <div className="flex items-center justify-between border-b border-black px-6 py-4 bg-gray-50">
                <div>
                  <h3 className="text-sm font-bold text-black uppercase tracking-tight">
                    {t("map.title")}
                  </h3>
                  <p className="text-[11px] text-gray-600 font-mono">
                    {t("map.subtitle")}
                  </p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center border border-black bg-white text-[#2563EB]">
                  <MapPin className="h-4 w-4" />
                </div>
              </div>

              <div className="h-80 lg:flex-1 lg:h-full min-h-[400px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.402994869746!2d-99.2103289!3d19.4381843!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d20218e6121855%3A0x6dfea8c4f363522e!2sAv.%20Jaime%20Balmes%2011-INTERIOR%2015A%20TORRE%20A%20PISO%201%2C%20Polanco%2C%20Polanco%20I%20Secc%2C%20Miguel%20Hidalgo%2C%2011510%20Ciudad%20de%20M%C3%A9xico%2C%20CDMX!5e0!3m2!1ses-419!2smx!4v1780337617019!5m2!1ses-419!2smx"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={t("map.iframeTitle")}
                  className="contrast-125"
                />
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
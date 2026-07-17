import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

export function FeaturesSection() {
  const t = useTranslations("features");

  const features = [
    t("items.0"),
    t("items.1"),
    t("items.2"),
    t("items.3"),
  ];

  return (
    <section className="relative bg-gray-100 py-12 border-b border-black text-black font-sans">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado Principal */}
        <div className="border-l-4 border-[#2563EB] pl-4 mb-10 max-w-3xl">
          <div className="inline-block border border-black bg-white px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-black mb-3">
            {t("badge")}
          </div>

          <h2 className="text-2xl md:text-4xl font-black text-black uppercase tracking-tight">
            {t("title")}
          </h2>

          <p className="mt-2 text-sm text-gray-700 leading-relaxed max-w-2xl">
            {t("description")}
          </p>

          <p className="text-[#2563EB] font-bold text-xs uppercase tracking-wide mt-3 font-mono">
            {t("subtitle")}
          </p>
        </div>

        {/* Cuadrícula de Características */}
        <div className="grid gap-0 border border-black bg-gray-200 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          {features.map((feature, index) => (
            <div
              key={`feature-${index}`}
              className="group relative bg-white p-6 border-b border-r last:border-r-0 border-black sm:even:border-r-0 lg:even:border-r lg:last:border-r-0 md:border-b-0"
            >
              <div className="flex items-center justify-between mb-4">
                {/* Cuadro de Ícono Rígido */}
                <div className="flex h-8 w-8 items-center justify-center border border-black bg-gray-100 group-hover:bg-[#2563EB] group-hover:text-white transition-colors duration-150">
                  <Check className="w-4 h-4 text-black group-hover:text-white transition-colors duration-150" />
                </div>
                {/* Indicador numérico técnico */}
                <span className="font-mono text-xs text-gray-400">0{index + 1}</span>
              </div>

              <p className="text-xs font-medium text-black leading-relaxed uppercase">
                {feature}
              </p>
            </div>
          ))}
        </div>

        {/* Bloque Destacado Inferior en Azul Plano */}
        <div className="border border-black bg-[#2563EB] p-8 text-center text-white">
          <h3 className="font-sans text-xl md:text-2xl font-black uppercase tracking-tight text-white leading-snug max-w-4xl mx-auto">
            {t("footer")}
          </h3>
        </div>

      </div>
    </section>
  );
}
// src/feature/landing/components/PricingSection.tsx
import { Check, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: "0",
    period: "Gratis por siempre",
    description: "Perfecto para empezar a gestionar tu primer edificio",
    features: [
      "1 propiedad",
      "Hasta 10 pisos",
      "Hasta 8 habitaciones por piso",
      "Registro de inquilinos",
      "Creación de contratos",
      "Control de pagos",
      "Ayuda por correo",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "29",
    period: "por mes",
    description: "Ideal para administrar varios edificios",
    features: [
      "Hasta 5 propiedades",
      "Hasta 20 pisos por propiedad",
      "Hasta 15 habitaciones por piso",
      "Todo lo del plan Starter",
      "Mensajes automáticos por WhatsApp",
      "Reportes de ingresos",
      "Vista de ocupación",
      "Atención prioritaria",
      "Exportar datos a Excel",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Contactar",
    period: "Precio personalizado",
    description: "Para empresas con muchas propiedades",
    features: [
      "Todo lo del plan Professional",
      "Propiedades ilimitadas",
      "Varios usuarios en la cuenta",
      "Personalización completa",
      "Atención 24/7",
      "Entrenamiento incluido",
      "Respuesta garantizada",
    ],
    popular: false,
  },
];

export function PricingSection() {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Planes que se adaptan a ti
          </h2>
          <p data-aos="fade-up" data-aos-delay="100" className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comienza gratis y escala cuando lo necesites. Sin compromisos, cancela cuando quieras.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 150}
              className={`relative rounded-2xl border p-8 flex flex-col ${
                plan.popular
                  ? "border-primary shadow-2xl scale-105"
                  : "border-border bg-card"
              }`}
            >
              {/* Badge de popular */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  Más popular
                </div>
              )}

              {/* Header del plan */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-2 mb-2">
                  {plan.price === "Contactar" ? (
                    <span className="text-3xl font-bold text-foreground">
                      {plan.price}
                    </span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold text-foreground">
                        S/ {plan.price}
                      </span>
                      <span className="text-muted-foreground">
                        {plan.period}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              {/* Features list */}
              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => navigate("/auth", { state: { mode: "register" } })}
                className={`w-full py-3 px-6 rounded-full font-semibold transition ${
                  plan.popular
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {plan.price === "Contactar" ? "Contactar ventas" : "Comenzar ahora"}
              </button>
            </div>
          ))}
        </div>

        {/* Nota adicional */}
        <div data-aos="fade-up" className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Todos los planes incluyen actualizaciones gratuitas y seguridad de nivel empresarial.
            <br />
            ¿Necesitas más información?{" "}
            <a href="mailto:contacto@habitora.com" className="text-primary hover:underline">
              Contáctanos
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

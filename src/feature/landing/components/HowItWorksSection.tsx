// src/feature/landing/components/HowItWorksSection.tsx
import { UserPlus, Building2, FileCheck, Sparkles } from "lucide-react";

const steps = [
  {
    icon: <UserPlus className="w-10 h-10" />,
    number: "01",
    title: "Crea tu cuenta",
    description: "Regístrate gratis en menos de 2 minutos. No necesitas tarjeta de crédito.",
  },
  {
    icon: <Building2 className="w-10 h-10" />,
    number: "02",
    title: "Agrega tus propiedades",
    description: "Configura tus edificios, pisos y habitaciones de forma rápida y sencilla.",
  },
  {
    icon: <FileCheck className="w-10 h-10" />,
    number: "03",
    title: "Gestiona contratos",
    description: "Registra inquilinos, crea contratos y administra pagos en un solo lugar.",
  },
  {
    icon: <Sparkles className="w-10 h-10" />,
    number: "04",
    title: "Automatiza y crece",
    description: "Deja que Habitora se encargue de los recordatorios y reportes automáticamente.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            ¿Cómo funciona Habitora?
          </h2>
          <p data-aos="fade-up" data-aos-delay="100" className="text-muted-foreground text-lg max-w-2xl mx-auto">
            En solo 4 pasos estarás gestionando tus propiedades como un profesional
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 150}
              className="relative flex flex-col items-center text-center space-y-4 p-6 rounded-2xl border border-border bg-card hover:bg-muted/50 transition-colors"
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center shadow-lg">
                {step.number}
              </div>

              {/* Ícono */}
              <div className="mt-4 text-primary">{step.icon}</div>

              {/* Título */}
              <h3 className="text-xl font-semibold text-foreground">
                {step.title}
              </h3>

              {/* Descripción */}
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// src/feature/landing/components/FeaturesSection.tsx
import {
  Building2,
  Users2,
  FileText,
  CreditCard,
  Bell,
  BarChart3,
} from "lucide-react";

import { FeatureCard } from "./FeatureCard";

const features = [
  {
    title: "Gestión de Habitaciones",
    description: "Organiza todas tus habitaciones, precios y disponibilidad en tiempo real.",
    icon: <Building2 className="w-7 h-7 text-foreground" />,
  },
  {
    title: "Control de Inquilinos",
    description: "Mantén toda la información de tus inquilinos organizada y accesible.",
    icon: <Users2 className="w-7 h-7 text-foreground" />,
  },
  {
    title: "Contratos Digitales",
    description: "Crea y gestiona contratos de arrendamiento de forma simple y segura.",
    icon: <FileText className="w-7 h-7 text-foreground" />,
  },
  {
    title: "Registro de Pagos",
    description: "Lleva un control detallado de todos los pagos y genera reportes.",
    icon: <CreditCard className="w-7 h-7 text-foreground" />,
  },
  {
    title: "Recordatorios Automáticos",
    description: "Envía recordatorios de pago por WhatsApp de forma automática.",
    icon: <Bell className="w-7 h-7 text-foreground" />,
  },
  {
    title: "Reportes y Estadísticas",
    description: "Visualiza tus ingresos, ocupación y métricas importantes.",
    icon: <BarChart3 className="w-7 h-7 text-foreground" />,
  },
];

export function FeaturesSection() {
  return (
    <section className="py-10">
      <div className="text-center mb-8">
        <h2 data-aos="fade-up" className="text-2xl md:text-3xl font-bold text-foreground">
          Todo lo que necesitas en un solo lugar
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <div key={feature.title} data-aos="fade-up" data-aos-delay={index * 100}>
            <FeatureCard
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
          />
          </div>
        ))}
      </div>
    </section>
  );
}

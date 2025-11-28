// src/feature/landing/components/StatsSection.tsx
import { TrendingUp, Users, Building, Clock } from "lucide-react";

const stats = [
  {
    icon: <Building className="w-8 h-8" />,
    value: "500+",
    label: "Propiedades Gestionadas",
    description: "En todo Perú",
  },
  {
    icon: <Users className="w-8 h-8" />,
    value: "2,000+",
    label: "Inquilinos Activos",
    description: "Satisfechos con el servicio",
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    value: "99.8%",
    label: "Tasa de Cobro",
    description: "Pagos puntuales",
  },
  {
    icon: <Clock className="w-8 h-8" />,
    value: "5 min",
    label: "Tiempo de Setup",
    description: "Empieza rápidamente",
  },
];

export function StatsSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Números que hablan por sí solos
          </h2>
          <p data-aos="fade-up" data-aos-delay="100" className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Miles de arrendadores confían en Habitora para gestionar sus propiedades
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              data-aos="zoom-in"
              data-aos-delay={index * 100}
              className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl bg-background border border-border hover:shadow-lg transition-shadow"
            >
              <div className="text-primary">{stat.icon}</div>
              <div className="text-4xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-foreground">
                {stat.label}
              </div>
              <div className="text-xs text-muted-foreground">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

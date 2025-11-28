// src/feature/landing/components/TestimonialsSection.tsx
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "María González",
    role: "Propietaria de 3 edificios",
    location: "Lima",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    rating: 5,
    text: "Habitora transformó completamente cómo gestiono mis propiedades. Antes pasaba horas haciendo seguimiento de pagos, ahora todo está automatizado.",
  },
  {
    name: "Carlos Mendoza",
    role: "Arrendador independiente",
    location: "Arequipa",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
    rating: 5,
    text: "La mejor inversión que he hecho. Los mensajes automáticos por WhatsApp han mejorado mis cobros. Mis inquilinos pagan a tiempo. Súper recomendado.",
  },
  {
    name: "Ana Torres",
    role: "Gestora de propiedades",
    location: "Cusco",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
    rating: 5,
    text: "Administro más de 50 habitaciones y Habitora me ahorra más de 20 horas cada semana. Es muy fácil de usar y la atención es excelente.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Lo que dicen nuestros usuarios
          </h2>
          <p data-aos="fade-up" data-aos-delay="100" className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Miles de arrendadores ya confían en Habitora para gestionar sus propiedades
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              data-aos="flip-left"
              data-aos-delay={index * 100}
              className="relative bg-background border border-border rounded-2xl p-8 hover:shadow-xl transition-shadow"
            >
             
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <Quote className="w-6 h-6 text-primary-foreground" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Testimonial text */}
              <p className="text-muted-foreground mb-6 italic">
                "{testimonial.text}"
              </p>

              {/* Author info */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full border-2 border-border"
                />
                <div>
                  <div className="font-semibold text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {testimonial.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// src/feature/landing/components/FAQSection.tsx
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "¿Es realmente gratis el plan Starter?",
    answer: "Sí, completamente gratis por siempre. Puedes gestionar hasta 1 propiedad con 10 habitaciones sin ningún costo. Solo pagas cuando necesitas más funcionalidades o propiedades.",
  },
  {
    question: "¿Puedo cancelar mi suscripción en cualquier momento?",
    answer: "Por supuesto. No hay contratos a largo plazo ni penalizaciones. Puedes cancelar tu suscripción en cualquier momento desde tu panel de configuración.",
  },
  {
    question: "¿Cómo funcionan los recordatorios de WhatsApp?",
    answer: "Habitora envía automáticamente mensajes de recordatorio a tus inquilinos cuando se acerca la fecha de pago. Tú configuras los días de anticipación y nosotros nos encargamos del resto.",
  },
  {
    question: "¿Mis datos están seguros?",
    answer: "Absolutamente. Usamos encriptación de nivel bancario (SSL/TLS) para proteger tus datos. Además, realizamos backups diarios automáticos y cumplimos con todas las normativas de protección de datos.",
  },
  {
    question: "¿Necesito conocimientos técnicos para usar Habitora?",
    answer: "No, para nada. Habitora está diseñado para ser extremadamente fácil de usar. Si puedes usar WhatsApp o Facebook, puedes usar Habitora. Además, ofrecemos tutoriales y soporte.",
  },
  {
    question: "¿Puedo probar el plan Professional antes de comprar?",
    answer: "Sí, ofrecemos una prueba gratuita de 14 días del plan Professional sin necesidad de tarjeta de crédito. Así puedes experimentar todas las funcionalidades avanzadas.",
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer: "Aceptamos tarjetas de crédito/débito (Visa, Mastercard), transferencias bancarias y pagos a través de Yape o Plin para clientes en Perú.",
  },
  {
    question: "¿Ofrecen soporte en español?",
    answer: "Sí, todo nuestro equipo de soporte habla español y está disponible para ayudarte. El plan Professional y Enterprise incluyen soporte prioritario.",
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/50 transition-colors"
      >
        <span className="font-semibold text-foreground pr-4">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-6 text-muted-foreground">
          {answer}
        </div>
      )}
    </div>
  );
}

export function FAQSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 data-aos="fade-up" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Preguntas Frecuentes
          </h2>
          <p data-aos="fade-up" data-aos-delay="100" className="text-muted-foreground text-lg">
            Encuentra respuestas a las preguntas más comunes sobre Habitora
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} data-aos="fade-up" data-aos-delay={index * 50}>
              <FAQItem question={faq.question} answer={faq.answer} />
            </div>
          ))}
        </div>

        <div data-aos="zoom-in" className="mt-12 text-center p-8 bg-background border border-border rounded-2xl">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            ¿No encuentras lo que buscas?
          </h3>
          <p className="text-muted-foreground mb-4">
            Nuestro equipo está listo para ayudarte con cualquier pregunta
          </p>
          <a
            href="mailto:soporte@habitora.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition"
          >
            Contactar Soporte
          </a>
        </div>
      </div>
    </section>
  );
}

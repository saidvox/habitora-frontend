// src/feature/landing/components/HeroSection.tsx
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useCurrentPropertyStore } from "@/store/useCurrentPropertyStore";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

export function HeroSection() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentPropertyId = useCurrentPropertyStore(
    (state) => state.currentPropertyId
  );

  const goToAppOrStart = () => {
    if (!isAuthenticated) return navigate("/auth");
    if (currentPropertyId) navigate(`/app/${currentPropertyId}`);
    else navigate("/start");
  };

  return (
    <section className="pt-20 pb-16 text-center relative overflow-hidden">
      {/* Decoración de fondo */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        {/* Badge superior */}
        <div data-aos="fade-down" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-pulse">
          <Sparkles className="w-4 h-4" />
          <span>Más de 500 propiedades gestionadas en todo Perú</span>
        </div>

        {/* Título principal */}
        <h1 data-aos="fade-up" data-aos-delay="100" className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
          Administra tus propiedades
          <br />
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            de manera profesional
          </span>
        </h1>

        {/* Subtítulo */}
        <p data-aos="fade-up" data-aos-delay="200" className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          La plataforma todo-en-uno para arrendadores modernos. Gestiona inquilinos, contratos, 
          pagos y recordatorios automáticos desde un solo lugar.
        </p>

        {/* Botones de acción */}
        <div data-aos="fade-up" data-aos-delay="300" className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          {isAuthenticated ? (
            <button
              onClick={goToAppOrStart}
              className="group px-8 py-4 rounded-full text-base font-semibold 
                         bg-primary text-primary-foreground hover:opacity-90 
                         transition-all hover:scale-105 shadow-lg hover:shadow-xl
                         flex items-center justify-center gap-2"
            >
              Ir al panel
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/auth", { state: { mode: "register" } })}
                className="group px-8 py-4 rounded-full text-base font-semibold 
                           bg-primary text-primary-foreground hover:opacity-90 
                           transition-all hover:scale-105 shadow-lg hover:shadow-xl
                           flex items-center justify-center gap-2"
              >
                Comenzar gratis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate("/auth", { state: { mode: "login" } })}
                className="px-8 py-4 rounded-full text-base font-semibold 
                           border-2 border-border bg-background text-foreground 
                           hover:bg-muted transition-all hover:scale-105"
              >
                Iniciar sesión
              </button>
            </>
          )}
        </div>

        {/* Features rápidos */}
        <div data-aos="fade-up" data-aos-delay="400" className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <span>Sin tarjeta de crédito</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <span>Setup en 5 minutos</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <span>Soporte en español</span>
          </div>
        </div>
      </div>
    </section>
  );
}

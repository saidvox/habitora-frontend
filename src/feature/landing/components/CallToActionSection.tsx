import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useCurrentPropertyStore } from "@/store/useCurrentPropertyStore";

export function CallToActionSection() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentPropertyId = useCurrentPropertyStore(
    (state) => state.currentPropertyId
  );

  const goToAppOrStart = () => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    if (currentPropertyId) navigate(`/app/${currentPropertyId}`);
    else navigate("/start");
  };

  return (
    <section className="mt-16 text-center">
      <h2 data-aos="fade-up" className="text-2xl md:text-3xl font-bold text-foreground mb-2">
        Comienza a gestionar tus propiedades hoy
      </h2>

      <p data-aos="fade-up" data-aos-delay="100" className="text-muted-foreground mb-6">
        Únete a cientos de arrendadores que ya confían en Habitora.
      </p>

      <div data-aos="zoom-in" data-aos-delay="200">
        {isAuthenticated ? (
          <button
            onClick={goToAppOrStart}
            className="px-6 py-3 rounded-full text-sm font-medium 
                       bg-primary text-primary-foreground 
                       hover:opacity-90 transition"
          >
            Ir al panel
          </button>
        ) : (
          <button
            onClick={() => navigate("/auth", { state: { mode: "register" } })}
            className="px-6 py-3 rounded-full text-sm font-medium 
                       bg-primary text-primary-foreground 
                       hover:opacity-90 transition"
          >
            Crear cuenta gratis
          </button>
        )}
      </div>
    </section>
  );
}
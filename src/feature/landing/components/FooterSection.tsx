// src/feature/landing/components/FooterSection.tsx
import { Building2, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function FooterSection() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Habitora</span>
            </div>
            <p className="text-muted-foreground text-sm mb-4 max-w-sm">
              La plataforma completa para gestionar tus propiedades y arrendamientos de manera profesional y eficiente.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Producto</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => navigate("/auth")} className="text-muted-foreground hover:text-foreground transition">
                  Características
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/auth")} className="text-muted-foreground hover:text-foreground transition">
                  Precios
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/auth")} className="text-muted-foreground hover:text-foreground transition">
                  Casos de uso
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/auth")} className="text-muted-foreground hover:text-foreground transition">
                  Testimonios
                </button>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contacto</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
                <a href="mailto:contacto@habitora.com" className="text-muted-foreground hover:text-foreground transition">
                  contacto@habitora.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
                <a href="tel:+51987654321" className="text-muted-foreground hover:text-foreground transition">
                  +51 987 654 321
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
                <span className="text-muted-foreground">
                  Lima, Perú
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Habitora. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-foreground transition">
                Términos de Servicio
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition">
                Política de Privacidad
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

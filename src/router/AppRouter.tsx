// src/router/AppRouter.tsx

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import AuthPage from "@/feature/auth/pages/AuthPage";
import LandingPage from "@/feature/landing/pages/LandingPage";
import Layout from "@/router/layout";

import { PropertiesPage } from "@/feature/properties/pages/PropertiesPage";
import { TenantsPage } from "@/feature/tenants/pages/TenantsPage";
import { ContractsPage } from "@/feature/contracts/pages/ContractsPage";
import { PaymentsPage } from "@/feature/payments/pages/PaymentsPage";
import { RemindersPage } from "@/feature/reminders/pages/RemindersPage";

import StartPage from "@/feature/start/pages/StartPage";
import OnboardingForm from "@/feature/start/components/OnboardingForm";
import WelcomeNewUser from "@/feature/start/components/WelcomeNewUser";

import ProtectedRoute from "@/router/ProtectedRoute";
import StartLayout from "@/feature/start/layout/StartLayout";

function AppRouterInner() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* PÚBLICAS */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* PROTEGIDAS */}
        <Route element={<ProtectedRoute />}>
          {/* Layout con HaloBackground compartido */}
          <Route element={<StartLayout />}>
            <Route path="start" element={<StartPage />} />
            <Route path="onboarding" element={<OnboardingForm />} />
            <Route path="welcome" element={<WelcomeNewUser />} />
          </Route>

          {/* PANEL PRINCIPAL */}
          <Route path="/app/:propertyId" element={<Layout />}>
            <Route index element={<AppHome />} />
            <Route path="habitaciones" element={<PropertiesPage />} />
            <Route path="inquilinos" element={<TenantsPage />} />
            <Route path="contratos" element={<ContractsPage />} />
            <Route path="pagos" element={<PaymentsPage />} />
            <Route path="recordatorios" element={<RemindersPage />} />
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AppRouterInner />
    </BrowserRouter>
  );
}

function AppHome() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Bienvenido a Habitora</h2>
      <p className="text-sm text-muted-foreground">
        Esto es solo contenido de prueba dentro del layout con sidebar.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border p-4 shadow-sm">
          <h3 className="font-semibold mb-1">Módulo Propiedades</h3>
          <p className="text-xs text-muted-foreground">
            Aquí iría la gestión de habitaciones, mini-depas, etc.
          </p>
        </div>

        <div className="rounded-xl border p-4 shadow-sm">
          <h3 className="font-semibold mb-1">Módulo Inquilinos</h3>
          <p className="text-xs text-muted-foreground">
            Información de inquilinos, contratos y pagos.
          </p>
        </div>

        <div className="rounded-xl border p-4 shadow-sm">
          <h3 className="font-semibold mb-1">Reportes</h3>
          <p className="text-xs text-muted-foreground">
            Resumen de ingresos, ocupación y métricas clave.
          </p>
        </div>
      </div>
    </div>
  );
}

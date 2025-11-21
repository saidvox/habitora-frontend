// src/feature/start/layout/StartLayout.tsx
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import HaloBackground from "../components/HaloBackground";

export default function StartLayout() {
  const location = useLocation();
  const isOnboarding = location.pathname === "/onboarding";

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden text-white bg-black">
      <HaloBackground />

      <div className="relative z-10 w-full px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={
              isOnboarding ? { opacity: 0, x: 60 } : { opacity: 1, x: 0 }
            }
            animate={{ opacity: 1, x: 0 }}
            exit={
              isOnboarding ? { opacity: 0, x: -60 } : { opacity: 0, x: -20 }
            }
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}

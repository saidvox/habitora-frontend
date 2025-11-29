// src/feature/start/layout/StartLayout.tsx
import { Outlet } from "react-router-dom";
import HaloBackground from "../components/HaloBackground";

export default function StartLayout() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden text-white bg-black">
      <HaloBackground />
      <div className="relative z-10 w-full px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
        <Outlet />
      </div>
    </main>
  );
}

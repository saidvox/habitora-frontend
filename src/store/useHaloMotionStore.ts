// src/store/useHaloMotionStore.ts
import { create } from "zustand";

type HaloMotionState = {
  speedFactor: number; // 1 = normal
  setSpeedFactor: (f: number) => void;
  accelerate: (target: number, totalMs?: number, rampMs?: number) => void;
  _animId?: number;
};

export const useHaloMotionStore = create<HaloMotionState>((set, get) => ({
  speedFactor: 1,
  setSpeedFactor: (f) => set({ speedFactor: f }),
  accelerate: (target, totalMs = 1000, rampMs = 220) => {
    const start = performance.now();
    const peak = target;
    const holdStart = start + rampMs;
    const holdEnd = start + totalMs - rampMs;
    // Cancel anim previa
    const prev = get()._animId;
    if (prev) cancelAnimationFrame(prev);
    const animate = () => {
      const now = performance.now();
      let f: number;
      if (now < holdStart) {
        // rampa subida
        const t = (now - start) / rampMs; // 0..1
        f = 1 + (peak - 1) * t;
      } else if (now <= holdEnd) {
        // mantener pico
        f = peak;
      } else if (now <= start + totalMs) {
        // rampa bajada
        const t = (now - holdEnd) / rampMs; // 0..1
        f = peak - (peak - 1) * t;
      } else {
        f = 1; // finalizar
        set({ speedFactor: f, _animId: undefined });
        return;
      }
      set({ speedFactor: f });
      const id = requestAnimationFrame(animate);
      set({ _animId: id });
    };
    animate();
  },
}));

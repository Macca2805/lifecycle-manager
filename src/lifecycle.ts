let running = true;
const closeListeners: Array<() => void> = [];

export const lifecycle = {
  isOpen: () => running,
  on: (_: 'close', listener: () => void) => closeListeners.push(listener),
  close: async () => {
    if (running) {
      running = false;
      await Promise.all(closeListeners.map((listener) => listener()));
    }
  },
  delay: async (ms: number, timer: (step: number) => Promise<void>) => {
    let remaining = ms;
    while (running && remaining > 0) {
      const step = Math.min(remaining, 200);
      await timer(step);
      remaining -= step;
    }
  },
};
import { vi } from 'vitest';

export const freezeTime = (instant: Date | string | number) => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'setInterval', 'Date'] });
  vi.setSystemTime(new Date(instant));
};

export const advance = async (ms: number) => {
  await vi.advanceTimersByTimeAsync(ms);
};

export const restoreTime = () => {
  vi.useRealTimers();
};

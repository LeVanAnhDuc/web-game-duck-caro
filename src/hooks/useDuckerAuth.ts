'use client';

import { useSyncExternalStore } from 'react';
import { DUCKER_CONFIG } from '@/lib/ducker/config';
import {
  getServerSnapshot,
  getSnapshot,
  signIn,
  signOut,
  subscribe,
} from '@/lib/ducker/session';
import type { AuthSnapshot } from '@/lib/ducker/types';

export type UseDuckerAuth = AuthSnapshot & {
  /** `false` khi cờ tắt hoặc thiếu biến — khi đó không hiển thị gì. */
  readonly enabled: boolean;
  readonly profileUrl: string | null;
  signIn(): void;
  signOut(): void;
};

/**
 * Cầu nối React ↔ kho phiên Ducker ID (ADR-0029). `getServerSnapshot` luôn là `idle`,
 * nên lần render đầu ở client khớp HTML tĩnh — không cảnh báo hydration.
 */
export function useDuckerAuth(): UseDuckerAuth {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    ...snapshot,
    enabled: DUCKER_CONFIG !== null,
    profileUrl: DUCKER_CONFIG ? DUCKER_CONFIG.profileUrl : null,
    signIn,
    signOut,
  };
}

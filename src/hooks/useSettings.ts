'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createSettingsStore,
  DEFAULT_SETTINGS,
  type Settings,
  type SettingsStore,
} from '@/game/settings/settingsStore';

export type UseSettings = {
  readonly settings: Settings;
  /** `false` cho tới khi đọc xong. Trước đó `settings` là mặc định, không phải thật. */
  readonly loaded: boolean;
  update(next: Settings): void;
};

/**
 * Cài đặt của máy — ADR-0019.
 *
 * Đọc trong `useEffect`, KHÔNG trong lần render đầu: bản build là static export
 * (ADR-0001), nên lần render đầu chạy lúc build, nơi không có `localStorage`. Đọc ở đó
 * sẽ ném lúc build, hoặc tệ hơn là nướng giá trị mặc định vào HTML tĩnh và làm mọi
 * người chơi thấy cài đặt của cái máy đã build.
 */
export function useSettings(store?: SettingsStore): UseSettings {
  const resolved = useMemo(() => store ?? createSettingsStore(), [store]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSettings(resolved.load());
    setLoaded(true);
  }, [resolved]);

  const update = useCallback(
    (next: Settings) => {
      setSettings(next);
      // Ghi không được thì mất một lựa chọn nhỏ, không phải một lỗi (NFR-REL-04).
      resolved.save(next);
    },
    [resolved],
  );

  return { settings, loaded, update };
}

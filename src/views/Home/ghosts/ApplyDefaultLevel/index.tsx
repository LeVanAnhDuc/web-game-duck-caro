'use client';

// libs
import { useEffect, useRef } from 'react';
// types
import type { Level } from '@/game/core/types';

/**
 * Áp mức khó mặc định từ cài đặt, đúng MỘT lần và chỉ khi CHƯA vào ván nào.
 *
 * Áp giữa ván sẽ đổi mức của ván đang chơi mà không hỏi gì, và `journeys.md` §US-04
 * chỉ đúng tên lỗi đó.
 */
export function ApplyDefaultLevel({
  loaded,
  started,
  defaultLevel,
  onApply,
}: {
  /** `false` cho tới khi đọc xong cài đặt — trước đó `defaultLevel` chưa phải giá trị thật. */
  loaded: boolean;
  started: boolean;
  defaultLevel: Level;
  onApply(level: Level): void;
}) {
  const applied = useRef(false);

  useEffect(() => {
    if (applied.current || !loaded || started) return;
    applied.current = true;
    onApply(defaultLevel);
    // `onApply` đổi mỗi render; ba giá trị kia mới là tín hiệu thật.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, started, defaultLevel]);

  return null;
}

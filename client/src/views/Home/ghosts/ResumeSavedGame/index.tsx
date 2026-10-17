'use client';

// libs
import { useEffect, useRef } from 'react';
// types
import type { SavedGame } from '@/game/storage/types';

/**
 * Tiếp tục ván dở, đúng MỘT lần khi đọc xong.
 *
 * Ván lưu hỏng thì `onResume` trả `false`, và ván đó bị xoá — nếu để lại, mỗi lần mở
 * app là một lần thử dựng lại rồi thất bại.
 */
export function ResumeSavedGame({
  restored,
  onResume,
  onCorrupt,
}: {
  /** `undefined` = chưa đọc xong. `null` = đọc xong và không có ván nào. */
  restored: SavedGame | null | undefined;
  /** Trả `false` khi ván lưu không dựng lại được. */
  onResume(saved: SavedGame): boolean;
  onCorrupt(): void;
}) {
  const tried = useRef(false);

  useEffect(() => {
    if (tried.current || restored === undefined) return;
    tried.current = true;
    if (restored === null) return;
    if (!onResume(restored)) onCorrupt();
    // Hai callback đổi mỗi render; chỉ `restored` mới là tín hiệu thật.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restored]);

  return null;
}

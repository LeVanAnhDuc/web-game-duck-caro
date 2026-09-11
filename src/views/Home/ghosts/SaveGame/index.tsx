'use client';

// libs
import { useEffect } from 'react';
// types
import type { GameState, Level, Side } from '@/game/core/types';

/**
 * Lưu sau mỗi nước.
 *
 * Ván kết thúc thì `onSave` tự xoá — không có gì để tiếp tục nữa, và quyết định đó
 * thuộc về repository chứ không thuộc về chỗ này (xem `usePersistence`).
 */
export function SaveGame({
  started,
  state,
  first,
  level,
  onSave,
}: {
  started: boolean;
  state: GameState;
  first: Side;
  level: Level;
  onSave(state: GameState, first: Side, level: Level): void;
}) {
  useEffect(() => {
    if (!started) return;
    onSave(state, first, level);
    // `onSave` đổi mỗi render; bốn giá trị kia mới là tín hiệu thật.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, started, first, level]);

  return null;
}

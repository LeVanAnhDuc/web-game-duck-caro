'use client';

// libs
import { useEffect } from 'react';
// types
import type { GameState, Level, Mode, Side } from '@/game/core/types';

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
  mode,
  onSave,
}: {
  started: boolean;
  state: GameState;
  first: Side;
  level: Level;
  mode: Mode;
  onSave(state: GameState, first: Side, level: Level, mode: Mode): void;
}) {
  useEffect(() => {
    if (!started) return;
    onSave(state, first, level, mode);
    // `onSave` đổi mỗi render; năm giá trị kia mới là tín hiệu thật.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, started, first, level, mode]);

  return null;
}

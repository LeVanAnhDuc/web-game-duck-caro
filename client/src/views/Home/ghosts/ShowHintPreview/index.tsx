'use client';

// libs
import { useEffect } from 'react';
// types
import type { Point } from '@/game/core/types';

/**
 * Gợi ý về thì đẩy vào quân xem trước của bàn.
 *
 * `useGame` không biết gì về canvas, và `useBoardCanvas` không biết gì về engine — chỗ
 * nối hai bên là đúng ở đây, không phải trong hook nào cả.
 */
export function ShowHintPreview({
  hint,
  onShow,
}: {
  hint: Point | null;
  onShow(at: Point): void;
}) {
  useEffect(() => {
    if (hint !== null) onShow(hint);
    // `onShow` đổi mỗi render; chỉ `hint` mới là tín hiệu thật.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hint]);

  return null;
}

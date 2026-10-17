'use client';

// libs
import { useEffect, useRef } from 'react';
// types
import { hasEngine, type GameStatus, type Level, type Mode } from '@/game/core/types';
import type { GameResult } from '@/game/storage/types';

/**
 * Ghi kết quả vào thống kê, đúng MỘT lần mỗi ván.
 *
 * `useEffect` theo `status` chạy lại ở mỗi render có `status` mới, và một ván có thể
 * render nhiều lần sau khi kết thúc (đổi kích thước cửa sổ, kéo bàn, và từ mốc 5 là cả
 * tua qua tua lại trong chế độ xem lại). Không có cái khoá `recordedFor` này thì một
 * ván thắng đếm thành ba, và bảng thống kê sai âm thầm — vẫn là số, chỉ là số sai.
 *
 * Khoá phải nằm TRONG ghost cùng với effect của nó. Tách hai thứ ra hai chỗ là mở lại
 * đúng cái lỗi mà nó sinh ra để chặn.
 *
 * Ván HOT-SEAT không được ghi: thống kê chia theo mức khó (FR-12), và không mức nào
 * đúng cho một ván không có máy tham gia. `overview.md` §4 ghi rõ đây là Non-Goal,
 * không phải một ô còn thiếu. Điều kiện hỏi `hasEngine(mode)`, không hỏi tên ghế —
 * bất biến 15.
 */
export function RecordResult({
  status,
  moveCount,
  level,
  mode,
  onRecord,
}: {
  status: GameStatus;
  moveCount: number;
  level: Level;
  mode: Mode;
  onRecord(level: Level, result: GameResult): void;
}) {
  const recordedFor = useRef<number | null>(null);

  useEffect(() => {
    if (status.kind === 'playing') {
      recordedFor.current = null;
      return;
    }
    if (recordedFor.current === moveCount) return;
    recordedFor.current = moveCount;
    if (!hasEngine(mode)) return;

    const result: GameResult =
      status.kind === 'resigned' ? 'resign' : status.by === 'one' ? 'win' : 'loss';
    onRecord(level, result);
    // Chỉ `status` và `level` là tín hiệu thật: `moveCount` được đọc làm khoá, đưa nó
    // vào deps sẽ khiến ván kết thúc rồi mà tua lại vẫn kích hoạt một lần ghi nữa.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, level, mode]);

  return null;
}

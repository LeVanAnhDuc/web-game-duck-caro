'use client';

// types
import type { Move } from '@/game/core/types';
// components
import { MoveList } from '../MoveList';
import { ReviewBar } from '../ReviewBar';
// others
import { strings } from '@/lib/strings';

/**
 * Chế độ xem lại, cả hai khổ màn.
 *
 * Trước đây khối này nằm thẳng trong `views/Home/index.tsx` và bị viết HAI lần — một
 * bản cho sheet, một bản cho panel — nên sửa một bên mà quên bên kia là lỗi chờ sẵn.
 * Gộp lại theo đúng lối `variant` mà `MoveList` · `ReviewBar` · `WinSheet` đã dùng.
 *
 * Đầu khối thay chỗ dòng lượt, vì lúc này không có lượt của ai cả.
 *
 * `at` là SỐ NƯỚC đang xem (0 = bàn trống), không phải chỉ số mảng — cùng quy ước với
 * `ReviewBar`, nên không có phép ±1 nào nằm rải rác giữa các component.
 */
export function ReviewPane({
  moves,
  at,
  variant,
  onGoto,
  onRecenter,
  onExit,
}: {
  moves: readonly Move[];
  at: number;
  variant: 'panel' | 'sheet';
  onGoto(n: number): void;
  onRecenter(): void;
  onExit(): void;
}) {
  const total = moves.length;
  const panel = variant === 'panel';

  const body = (
    <>
      <div
        className={`flex flex-none items-center justify-between gap-2 ${
          panel ? 'border-b border-edge p-4' : 'px-4 pb-2 pt-4'
        }`}
      >
        <p className="text-sm font-semibold text-ink-strong">{strings.reviewing}</p>
        <p className="font-mono text-sm text-ink-muted">
          {strings.reviewPosition(at, total)}
        </p>
      </div>
      <MoveList moves={moves} currentAt={at} variant={variant} onPick={onGoto} />
      <ReviewBar
        at={at}
        total={total}
        variant={variant}
        onGoto={onGoto}
        onRecenter={onRecenter}
        onExit={onExit}
      />
    </>
  );

  // Panel đã nằm sẵn trong cột phải, nên nó không tự dựng khung. Sheet thì neo ĐÁY và
  // phủ lên bàn — bàn vẫn thấy được nửa trên (MASTER.md §9: không che chuỗi thắng).
  if (panel) return body;

  return (
    <div className="absolute inset-x-0 bottom-0 flex max-h-[52%] flex-col rounded-t-[10px] border-t border-edge bg-raised shadow-sheet lg:hidden">
      {body}
    </div>
  );
}

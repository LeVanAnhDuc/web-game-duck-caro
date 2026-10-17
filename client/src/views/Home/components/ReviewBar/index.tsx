'use client';

// libs
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Crosshair,
  X,
} from 'lucide-react';
// others
import { strings } from '@/lib/strings';

const NAV =
  'flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-md border border-edge bg-raised text-ink hover:bg-paper disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-raised';

/**
 * Thanh tua của chế độ xem lại.
 *
 * `at` là SỐ NƯỚC đang xem (0 = bàn trống), không phải chỉ số mảng. Dùng số nước ở đây
 * vì đó là thứ người chơi đọc trên màn hình, và vì `moves.slice(0, at)` nhận đúng con
 * số đó — không có phép ±1 nào nằm rải rác giữa các component.
 */
export function ReviewBar({
  at,
  total,
  variant,
  onGoto,
  onRecenter,
  onExit,
}: {
  at: number;
  total: number;
  variant: 'panel' | 'sheet';
  onGoto(n: number): void;
  onRecenter(): void;
  onExit(): void;
}) {
  const atStart = at <= 0;
  const atEnd = at >= total;

  return (
    <div
      className={`flex flex-none flex-col gap-2 border-t border-edge ${
        variant === 'panel' ? 'p-3' : 'px-4 pb-3 pt-3'
      }`}
    >
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onGoto(0)}
          disabled={atStart}
          aria-label={strings.firstMove}
          className={NAV}
        >
          <ChevronsLeft size={20} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onGoto(at - 1)}
          disabled={atStart}
          aria-label={strings.prevMove}
          className={NAV}
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onGoto(at + 1)}
          disabled={atEnd}
          aria-label={strings.nextMove}
          className={NAV}
        >
          <ChevronRight size={20} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onGoto(total)}
          disabled={atEnd}
          aria-label={strings.lastMove}
          className={NAV}
        >
          <ChevronsRight size={20} aria-hidden="true" />
        </button>
      </div>
      {/*
        "Giữa" phải có Ở ĐÂY, không chỉ ở `Controls`.
        `backlog.md` ghi nhận một món nợ có ý: đổi kích thước cửa sổ có thể đẩy thế trận ra
        ngoài khung nhìn, và cách thoát là bấm "Giữa". Chế độ xem lại ẩn `Controls`, nên
        nếu không đặt lại nút này thì người chơi mắc kẹt với bàn trống, không có đường ra.
        Tìm ra bằng cách đổi khung nhìn 1440 -> 375 trên app đang chạy.
      */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onRecenter}
          className="flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border border-edge bg-raised text-sm font-semibold text-ink hover:bg-paper"
        >
          <Crosshair size={18} aria-hidden="true" />
          {strings.recenter}
        </button>
        <button
          type="button"
          onClick={onExit}
          className="flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border border-edge bg-raised text-sm font-semibold text-ink hover:bg-paper"
        >
          <X size={18} aria-hidden="true" />
          {strings.exitReview}
        </button>
      </div>
    </div>
  );
}

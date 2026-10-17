// libs
import { History } from 'lucide-react';
// types
import type { GameStatus, Mode } from '@/game/core/types';
// others
import { strings } from '@/lib/strings';

/**
 * Tên ghế đọc từ `Mode` (bất biến 15). Ở hot-seat, "Bạn thắng" là một câu sai với
 * một trong hai người đang ngồi trước máy.
 */
function titleFor(status: GameStatus, mode: Mode): string {
  if (status.kind === 'playing') return '';
  const who = strings.seatName(status.by, mode);
  return status.kind === 'won' ? strings.seatWins(who) : strings.seatResigned(who);
}

/**
 * Kết ván. Trên mobile/tablet là sheet neo ĐÁY, không phải modal giữa màn — MASTER.md
 * §9: không lớp phủ nào được che chuỗi thắng. Trên desktop nó nằm trong cột phải,
 * nên nó không che gì cả.
 */
export function WinSheet({
  status,
  mode,
  moveCount,
  variant,
  onPlayAgain,
  onReview,
}: {
  status: GameStatus;
  mode: Mode;
  moveCount: number;
  variant: 'sheet' | 'panel';
  onPlayAgain(): void;
  onReview(): void;
}) {
  if (status.kind === 'playing') return null;

  const panel = variant === 'panel';

  return (
    <div
      className={
        panel
          ? 'border-t border-edge p-4'
          : 'flex-none rounded-t-[10px] border-t border-edge bg-raised p-6 shadow-sheet'
      }
    >
      <p
        className={
          panel
            ? 'text-xl font-bold leading-7 text-ink-strong'
            : 'text-2xl font-bold leading-8 text-ink-strong'
        }
      >
        {titleFor(status, mode)}
      </p>
      <p className="mb-4 mt-1.5 font-mono text-sm text-ink-muted">
        {strings.moveCount(moveCount)}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onPlayAgain}
          className="min-h-11 flex-1 cursor-pointer rounded-md bg-ink-strong text-sm font-semibold text-paper"
        >
          {strings.playAgain}
        </button>
        {/* Xem lại chỉ vào được từ đây — US-03, và ván đã kết thúc thì không còn nhánh nào để tạo. */}
        <button
          type="button"
          onClick={onReview}
          className="flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border border-edge bg-raised text-sm font-semibold text-ink hover:bg-paper"
        >
          <History size={18} aria-hidden="true" />
          {strings.review}
        </button>
      </div>
    </div>
  );
}

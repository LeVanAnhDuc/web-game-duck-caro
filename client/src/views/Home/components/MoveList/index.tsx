'use client';

// libs
import { useEffect, useRef } from 'react';
// types
import type { PieceSet } from '@/game/appearance/types';
import type { Move } from '@/game/core/types';
// components
import { PieceGlyph } from '../PieceGlyph';
// others
import { strings } from '@/lib/strings';

/*
 * Lưới `2.5rem 1.25rem 1fr` là spec `.move-row` của MASTER.md §8.
 *
 * `text-left` KHÔNG phải thứ thừa: `<button>` mặc định `text-align: center`, còn
 * `<div>` thì không — nên khi hàng đổi từ chỉ-đọc sang bấm-được, cả cột toạ độ
 * nhảy sang phải ~70px. Thấy được bằng mắt khi bấm thật, không thấy được bằng test.
 */
const ROW =
  'grid grid-cols-[2.5rem_1.25rem_1fr] items-center gap-2 rounded-md px-2 text-left font-mono text-sm';

export function MoveList({
  moves,
  currentAt,
  variant,
  pieceSet,
  onPick,
}: {
  moves: readonly Move[];
  /** Nước đang xem trong chế độ xem lại; `null` khi đang chơi. */
  currentAt: number | null;
  variant: 'panel' | 'sheet';
  /** Bộ quân đang chọn — cột glyph phải khớp bàn cờ, không phải khớp một bản vẽ riêng. */
  pieceSet: PieceSet;
  /**
   * Có `onPick` = hàng BẤM ĐƯỢC. Đây cũng là thứ quyết định chiều cao hàng:
   * 44px khi bấm được, 32px khi chỉ để đọc (ADR-0018). Chiều cao đi theo VAI TRÒ
   * chứ không theo khổ màn — vai trò là tiêu chí ổn định hơn.
   */
  onPick?: (n: number) => void;
}) {
  const clickable = onPick !== undefined;
  const scrollTo = useRef<HTMLLIElement | null>(null);

  // Cuộn tới nước đáng nhìn: nước đang xem khi xem lại, nước mới nhất khi đang chơi.
  useEffect(() => {
    scrollTo.current?.scrollIntoView?.({ block: 'nearest' });
  }, [currentAt, moves.length]);

  const focusIndex = currentAt === null ? moves.length - 1 : currentAt - 1;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {variant === 'panel' && (
        <p className="flex-none px-2.5 pb-1.5 pt-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          {strings.moveListTitle}
        </p>
      )}
      <ol className="min-h-0 flex-1 list-none overflow-y-auto px-1.5 pb-2">
        {moves.map((move, i) => {
          const current = clickable && i === focusIndex;
          const future = clickable && currentAt !== null && i >= currentAt;
          const body = (
            <>
              <span className="whitespace-pre text-right">
                {String(i + 1).padStart(2, ' ')}
              </span>
              <PieceGlyph side={move.side} set={pieceSet} size={13} />
              <span className="whitespace-pre">
                {strings.moveCoord(move.at.x, move.at.y)}
              </span>
            </>
          );

          return (
            <li key={i} ref={i === focusIndex ? scrollTo : null}>
              {onPick === undefined ? (
                <div className={`${ROW} min-h-8 text-ink-muted`}>{body}</div>
              ) : (
                <button
                  type="button"
                  onClick={() => onPick(i + 1)}
                  aria-current={current ? 'true' : undefined}
                  className={`${ROW} min-h-11 w-full cursor-pointer ${
                    current
                      ? 'bg-paper text-ink-strong outline outline-1 -outline-offset-1 outline-focus'
                      : 'text-ink-muted hover:bg-paper'
                  } ${future ? 'opacity-40' : ''}`}
                >
                  {body}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

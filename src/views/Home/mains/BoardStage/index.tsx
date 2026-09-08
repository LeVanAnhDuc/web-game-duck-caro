'use client';

import { placeConfirmButton } from '@/game/render/layers/overlay';
import type { BoardCanvas } from '@/hooks/useBoardCanvas';
import type { Move } from '@/game/core/types';
import { strings } from '@/lib/strings';

/** Khớp `min-h-11` + `px-4` của chính nút bên dưới. Đổi lớp thì đổi cả đây. */
const CONFIRM_BUTTON = { w: 72, h: 44 };

export function BoardStage({
  board,
  moves,
}: {
  board: BoardCanvas;
  moves: readonly Move[];
}) {
  /*
   * Vị trí nút đi qua `placeConfirmButton` chứ không tính tại chỗ — ADR-0017. Kích
   * thước khung đọc từ chính canvas: đó là hộp mà nút phải nằm lọt, và nó đổi theo
   * mỗi lần resize.
   */
  const canvas = board.canvasRef.current;
  const spot =
    board.preview === null
      ? null
      : placeConfirmButton(
          board.cam,
          board.preview,
          moves,
          { w: canvas?.clientWidth ?? 0, h: canvas?.clientHeight ?? 0 },
          CONFIRM_BUTTON,
        );

  return (
    <div className="relative min-h-0 flex-1">
      <canvas
        ref={board.canvasRef}
        aria-label={strings.boardLabel}
        className="block h-full w-full cursor-grab touch-none active:cursor-grabbing"
        onPointerDown={board.onPointerDown}
        onPointerMove={board.onPointerMove}
        onPointerUp={board.onPointerUp}
        onWheel={board.onWheel}
      />
      {spot !== null && (
        <button
          type="button"
          onClick={board.confirmPreview}
          style={{ left: spot.x, top: spot.y }}
          className="absolute flex min-h-11 w-[72px] cursor-pointer items-center justify-center rounded-md bg-ink-strong text-sm font-semibold text-paper"
        >
          {strings.place}
        </button>
      )}
    </div>
  );
}

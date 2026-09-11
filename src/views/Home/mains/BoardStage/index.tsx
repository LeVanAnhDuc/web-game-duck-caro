'use client';

// types
import type { Move } from '@/game/core/types';
import type { BoardCanvas } from '@/hooks';
// game
import { placeConfirmButton } from '@/game/render/layers/overlay';
// others
import { strings } from '@/lib/strings';

/** Khớp `min-h-11` + `px-4` của chính nút bên dưới. Đổi lớp thì đổi cả đây. */
const CONFIRM_BUTTON = { w: 72, h: 44 };

export function BoardStage({
  board,
  moves,
  onHint,
  onUndo,
}: {
  board: BoardCanvas;
  moves: readonly Move[];
  onHint(): void;
  onUndo(): void;
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
      {/*
        `tabIndex` là thứ làm cả FR-15 chạy: không có nó, canvas không nhận được focus
        và mọi phím ở ADR-0020 đều đúng mà không bao giờ được gọi.

        `h` và `u` xử lý Ở ĐÂY chứ không trong `useBoardCanvas`: gợi ý và hoàn nước là
        việc của ván, không phải của khung nhìn — hook đó cố ý không biết gì về engine.
      */}
      <canvas
        ref={board.canvasRef}
        tabIndex={0}
        aria-label={strings.boardKeyboardLabel}
        className="block h-full w-full cursor-grab touch-none outline-offset-[-3px] active:cursor-grabbing"
        onPointerDown={board.onPointerDown}
        onPointerMove={board.onPointerMove}
        onPointerUp={board.onPointerUp}
        onWheel={board.onWheel}
        onKeyDown={(e) => {
          if (e.key === 'h') {
            e.preventDefault();
            onHint();
            return;
          }
          if (e.key === 'u') {
            e.preventDefault();
            onUndo();
            return;
          }
          board.onKeyDown(e);
        }}
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

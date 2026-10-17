import { boundsOf } from '@/game/core/board';
import type { Move, Point } from '@/game/core/types';

/** Khung nhìn: cạnh ô tính bằng px, và góc trên-trái của ô (0,0) trên màn hình. */
export type Camera = { readonly cell: number; readonly ox: number; readonly oy: number };

export const CELL_MIN = 16;
export const CELL_MAX = 64;
export const CELL_DEFAULT_MOBILE = 28;
export const CELL_DEFAULT_DESKTOP = 32;
/** Bán kính bắt tâm ô, rộng hơn ô — bù cho việc ô nhỏ hơn 44px (NFR-A11Y-03). */
export const HIT_RADIUS_RATIO = 0.75;
/** Số ô đệm quanh hộp bao khi "Về giữa". */
const FIT_PADDING_CELLS = 2;

export const clampCell = (cell: number): number =>
  Math.min(CELL_MAX, Math.max(CELL_MIN, cell));

/**
 * Điểm trên màn hình -> Ô.
 *
 * `Math.floor`, KHÔNG `Math.round` và KHÔNG `Math.trunc`.
 * - `round` là mô hình giao điểm mà ADR-0009 đã loại. Nó lệch nửa ô: vẫn đánh được
 *   nên thử nhanh không thấy, chỉ là đánh sang ô bên cạnh ở nửa dưới mỗi ô.
 * - `trunc` sai ở toạ độ âm: `trunc(-0.5) === 0`, nên ô -1 và ô 0 cùng trả về 0.
 *   Trên bàn vô hạn, một nửa toạ độ là số âm — đó không phải ca biên.
 */
export function screenToCell(cam: Camera, sx: number, sy: number): Point {
  return {
    x: Math.floor((sx - cam.ox) / cam.cell),
    y: Math.floor((sy - cam.oy) / cam.cell),
  };
}

/** Ô -> góc trên-trái của ô đó trên màn hình. */
export function cellToScreen(cam: Camera, p: Point): { x: number; y: number } {
  return { x: p.x * cam.cell + cam.ox, y: p.y * cam.cell + cam.oy };
}

export function cellCenterToScreen(cam: Camera, p: Point): { x: number; y: number } {
  const corner = cellToScreen(cam, p);
  return { x: corner.x + cam.cell / 2, y: corner.y + cam.cell / 2 };
}

export function panBy(cam: Camera, dx: number, dy: number): Camera {
  return { cell: cam.cell, ox: cam.ox + dx, oy: cam.oy + dy };
}

/** Thu phóng quanh một điểm màn hình: ô dưới điểm đó phải đứng yên. */
export function zoomAt(cam: Camera, sx: number, sy: number, nextCell: number): Camera {
  const cell = clampCell(nextCell);
  const ratio = cell / cam.cell;
  return {
    cell,
    ox: sx - (sx - cam.ox) * ratio,
    oy: sy - (sy - cam.oy) * ratio,
  };
}

/** Khớp khung nhìn vào hộp bao của mọi quân đã đánh. Ván trống -> ô (0,0) ở giữa. */
export function fitToMoves(
  moves: readonly Move[],
  viewW: number,
  viewH: number,
): Camera {
  const bounds = boundsOf(moves);
  if (bounds === null) {
    const cell = CELL_DEFAULT_DESKTOP;
    return { cell, ox: viewW / 2 - cell / 2, oy: viewH / 2 - cell / 2 };
  }

  const cellsWide = bounds.maxX - bounds.minX + 1 + FIT_PADDING_CELLS * 2;
  const cellsTall = bounds.maxY - bounds.minY + 1 + FIT_PADDING_CELLS * 2;
  const cell = clampCell(Math.floor(Math.min(viewW / cellsWide, viewH / cellsTall)));

  const contentW = (bounds.maxX - bounds.minX + 1) * cell;
  const contentH = (bounds.maxY - bounds.minY + 1) * cell;
  return {
    cell,
    ox: (viewW - contentW) / 2 - bounds.minX * cell,
    oy: (viewH - contentH) / 2 - bounds.minY * cell,
  };
}

/** Số ô đệm giữ quanh con trỏ khi kéo khung nhìn theo nó. */
const CURSOR_MARGIN_CELLS = 1;

/**
 * Dịch khung nhìn tối thiểu để một ô nằm trọn trong đó, cộng một ô đệm — ADR-0020.
 *
 * Con trỏ bàn phím đi trên bàn KHÔNG CÓ BIÊN, nên sau chục lần bấm mũi tên nó ra khỏi
 * màn hình. Lúc đó vòng con trỏ vẫn "tồn tại" và mọi phím vẫn chạy đúng — chỉ là không
 * ai thấy gì. Đó là lý do hàm này tồn tại, và là lý do nó nằm ở `camera` chứ không ở
 * hook: bất biến 11 nói mọi phép đổi toạ độ đi qua đúng module này.
 *
 * Trả về CHÍNH `cam` khi không cần dịch. React so sánh tham chiếu, nên trả một bản sao
 * mỗi lần bấm phím sẽ vẽ lại cả bàn dù không có gì đổi.
 */
export function ensureVisible(
  cam: Camera,
  at: Point,
  viewW: number,
  viewH: number,
): Camera {
  const pad = cam.cell * CURSOR_MARGIN_CELLS;
  const corner = cellToScreen(cam, at);

  const shift = (
    near: number,
    far: number,
    limit: number,
  ): number => {
    // Khung hẹp hơn ô cộng đệm thì không có vị trí nào thoả cả hai phía; ưu tiên
    // cạnh gần, vì đó là phía người đọc bắt đầu nhìn.
    if (near - pad < 0) return pad - near;
    if (far + pad > limit) return limit - pad - far;
    return 0;
  };

  const dx = shift(corner.x, corner.x + cam.cell, viewW);
  const dy = shift(corner.y, corner.y + cam.cell, viewH);
  if (dx === 0 && dy === 0) return cam;
  return { cell: cam.cell, ox: cam.ox + dx, oy: cam.oy + dy };
}

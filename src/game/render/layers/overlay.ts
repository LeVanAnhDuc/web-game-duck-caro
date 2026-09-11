import { cellCenterToScreen, cellToScreen, type Camera } from '../camera';
import type { Palette } from '../palette';
import { DEFAULT_PIECE_SET, type PieceSet } from '../pieceSets';
import { drawMark } from './marks';
import type { Move, Point, Side } from '@/game/core/types';

const PREVIEW_ALPHA = 0.45;
const WIN_STROKE_WIDTH = 4;
/** Viền 2px mỗi bên. Không có nó, nét win bắt qua quân đỏ chỉ được 1.09:1 (MASTER §3c). */
const WIN_CASING_EXTRA = 4;
const STROKE_OVERSHOOT_PX = 7;

export function winStrokePath(
  cam: Camera,
  line: readonly Point[],
): { from: { x: number; y: number }; to: { x: number; y: number } } | null {
  const head = line[0];
  const tail = line[line.length - 1];
  if (head === undefined || tail === undefined) return null;
  const a = cellCenterToScreen(cam, head);
  const b = cellCenterToScreen(cam, tail);
  const length = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  const ux = ((b.x - a.x) / length) * STROKE_OVERSHOOT_PX;
  const uy = ((b.y - a.y) / length) * STROKE_OVERSHOOT_PX;
  return { from: { x: a.x - ux, y: a.y - uy }, to: { x: b.x + ux, y: b.y + uy } };
}

export function drawLastMoveRing(
  ctx: CanvasRenderingContext2D,
  cam: Camera,
  at: Point,
  palette: Palette,
): void {
  const { x, y } = cellToScreen(cam, at);
  ctx.save();
  ctx.strokeStyle = palette.inkMuted;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([3, 3]);
  ctx.strokeRect(x + 1, y + 1, cam.cell - 2, cam.cell - 2);
  ctx.restore();
}

export function drawPreview(
  ctx: CanvasRenderingContext2D,
  cam: Camera,
  at: Point,
  side: Side,
  palette: Palette,
  set: PieceSet = DEFAULT_PIECE_SET,
): void {
  drawMark(ctx, cam, at, side, palette, PREVIEW_ALPHA, set);
}

/**
 * Nét gạch qua chuỗi thắng — phần tử đặc trưng của sản phẩm (MASTER.md §7).
 *
 * Vẽ HAI lần: viền màu nền dày hơn trước, rồi nét màu win. Viền là thứ giữ tương
 * phản khi nét bắt qua một quân, không phải trang trí — nét xanh trần trên quân đỏ
 * chỉ được 1.09:1, tức là gần như tàng hình. Bỏ viền là một lỗi a11y trông giống
 * một lựa chọn thẩm mỹ.
 */
export function drawWinStroke(
  ctx: CanvasRenderingContext2D,
  cam: Camera,
  line: readonly Point[],
  palette: Palette,
): void {
  const path = winStrokePath(cam, line);
  if (path === null) return;
  ctx.save();
  ctx.lineCap = 'round';
  for (const layer of ['casing', 'ink'] as const) {
    ctx.strokeStyle = layer === 'casing' ? palette.winCasing : palette.win;
    ctx.lineWidth =
      layer === 'casing' ? WIN_STROKE_WIDTH + WIN_CASING_EXTRA : WIN_STROKE_WIDTH;
    ctx.beginPath();
    ctx.moveTo(path.from.x, path.from.y);
    ctx.lineTo(path.to.x, path.to.y);
    ctx.stroke();
  }
  ctx.restore();
}

/** Vòng con trỏ bàn phím. FR-15 (mốc 6) sẽ dùng; vẽ sẵn ở đây để một chỗ lo hình. */
export function drawCursorRing(
  ctx: CanvasRenderingContext2D,
  cam: Camera,
  at: Point,
  palette: Palette,
): void {
  const { x, y } = cellToScreen(cam, at);
  ctx.save();
  ctx.strokeStyle = palette.focus;
  ctx.lineWidth = 2;
  ctx.strokeRect(x - 2, y - 2, cam.cell + 4, cam.cell + 4);
  ctx.restore();
}

/** Khoảng hở giữa nút xác nhận và ô nó đang nói tới. */
const CONFIRM_GAP_PX = 8;
/** Nút nhích lên 2px so với mép trên của ô — giữ nguyên căn chỉnh có từ mốc 1. */
const CONFIRM_RISE_PX = 2;

/**
 * Chỗ đặt nút "Đánh" cho ô đang xem trước — ADR-0017.
 *
 * Đặt cứng bên phải như trước là đặt nút 8px VÀO TRONG ô kế bên, nên ô đó có quân thì
 * nút che mất quân. Trước mốc 5 chuyện này hiếm vì chuột không tạo quân xem trước
 * (ADR-0007); gợi ý (FR-10) làm nó xuất hiện trên mọi thiết bị, và che đúng cái quân
 * mà gợi ý vừa bảo người chơi nhìn.
 *
 * Thử phải -> trái -> dưới -> trên, lấy cạnh đầu tiên vừa TRỐNG vừa LỌT khung nhìn.
 * Không cạnh nào thoả thì về bên phải: một nút đặt chồng vẫn dùng được, còn không trả
 * gì thì người chơi cụt đường xác nhận.
 */
export function placeConfirmButton(
  cam: Camera,
  at: Point,
  moves: readonly Move[],
  view: { readonly w: number; readonly h: number },
  btn: { readonly w: number; readonly h: number },
): { x: number; y: number } {
  const corner = cellToScreen(cam, at);
  const top = corner.y - CONFIRM_RISE_PX;

  // Ô đang xem trước tự nó không bao giờ chặn — nó là ô sắp được đánh vào.
  const taken = new Set(
    moves
      .filter((m) => m.at.x !== at.x || m.at.y !== at.y)
      .map((m) => `${m.at.x},${m.at.y}`),
  );
  const free = (dx: number, dy: number) => !taken.has(`${at.x + dx},${at.y + dy}`);
  const inside = (x: number, y: number) =>
    x >= 0 && y >= 0 && x + btn.w <= view.w && y + btn.h <= view.h;

  const right = { x: corner.x + cam.cell + CONFIRM_GAP_PX, y: top };
  const candidates = [
    { spot: right, open: free(1, 0) },
    { spot: { x: corner.x - CONFIRM_GAP_PX - btn.w, y: top }, open: free(-1, 0) },
    { spot: { x: corner.x, y: corner.y + cam.cell + CONFIRM_GAP_PX }, open: free(0, 1) },
    { spot: { x: corner.x, y: corner.y - CONFIRM_GAP_PX - btn.h }, open: free(0, -1) },
  ];

  const pick = candidates.find((c) => c.open && inside(c.spot.x, c.spot.y));
  return pick?.spot ?? right;
}

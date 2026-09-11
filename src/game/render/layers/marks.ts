import { cellToScreen, type Camera } from '../camera';
import type { Palette } from '../palette';
import { DEFAULT_PIECE_SET, drawPiece, type PieceSet } from '../pieceSets';
import type { Move, Point, Side } from '@/game/core/types';

/** Từ MASTER.md §6: nét dày 12% cạnh ô, quân thụt vào 22% để không chạm kẻ ô. */
const STROKE_RATIO = 0.12;
const INSET_RATIO = 0.22;
const MIN_STROKE_PX = 2;

/**
 * Lệch góc nhỏ cho ra nét tay. Tính TỪ TOẠ ĐỘ Ô nên không ngẫu nhiên: cùng một ô
 * luôn cùng một góc, ở mọi khung. Dùng `Math.random` ở đây làm quân giật liên tục.
 */
const jitterDeg = (p: Point): number =>
  (((((p.x * 7 + p.y * 13) % 5) + 5) % 5) - 2) * 0.7;

/**
 * Màu theo GHẾ, không theo bộ quân (bất biến 16 · ADR-0027).
 *
 * Đây là hàm duy nhất trong tầng render nói màu nào thuộc ghế nào. Một bộ quân không
 * có đường nào để đặt màu riêng, nên không bộ nào lọt được một hex mới vào sản phẩm.
 */
const colourOf = (side: Side, palette: Palette): string =>
  side === 'one' ? palette.markOne : palette.markTwo;

export function drawMark(
  ctx: CanvasRenderingContext2D,
  cam: Camera,
  at: Point,
  side: Side,
  palette: Palette,
  alpha = 1,
  set: PieceSet = DEFAULT_PIECE_SET,
): void {
  const { x, y } = cellToScreen(cam, at);
  const size = cam.cell;
  const inset = size * INSET_RATIO;
  const half = size / 2 - inset;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x + size / 2, y + size / 2);
  ctx.rotate((jitterDeg(at) * Math.PI) / 180);
  ctx.lineWidth = Math.max(MIN_STROKE_PX, size * STROKE_RATIO);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  // HÌNH mang thông tin quân của ai; màu chỉ là lớp dư thừa (ADR-0008).
  ctx.strokeStyle = colourOf(side, palette);
  drawPiece(ctx, set, side, half);
  ctx.restore();
}

export function drawMarks(
  ctx: CanvasRenderingContext2D,
  cam: Camera,
  moves: readonly Move[],
  palette: Palette,
  set: PieceSet = DEFAULT_PIECE_SET,
): void {
  for (const move of moves) drawMark(ctx, cam, move.at, move.side, palette, 1, set);
}

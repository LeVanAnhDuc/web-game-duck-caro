import { PIECE_SHAPES, type PieceShape, type Prim } from '@/game/appearance/shapes';
import type { PieceSet } from '@/game/appearance/types';
import type { Side } from '@/game/core/types';

/**
 * Bộ vẽ hình quân lên CANVAS — FR-20 · ADR-0027.
 *
 * Hình nằm ở `game/appearance/shapes.ts`, tả một lần cho cả canvas và SVG. File này
 * chỉ biết cách biến một `Prim` thành lệnh `ctx`.
 *
 * Màu KHÔNG thuộc về bộ quân: `ctx.strokeStyle` do người gọi (`layers/marks`) đặt
 * trước, và hàm ở đây chỉ đọc nó (bất biến 16).
 */
export type { PieceSet, PieceShape };
export {
  DEFAULT_PIECE_SET,
  isPieceSet,
  PIECE_SETS,
} from '@/game/appearance/types';
export { PIECE_SHAPES } from '@/game/appearance/shapes';

function drawPrim(ctx: CanvasRenderingContext2D, prim: Prim, half: number): void {
  const s = (v: number) => v * half;

  if (prim.kind === 'segments') {
    ctx.beginPath();
    for (let i = 0; i + 1 < prim.pts.length; i += 2) {
      const a = prim.pts[i];
      const b = prim.pts[i + 1];
      if (a === undefined || b === undefined) continue;
      ctx.moveTo(s(a[0]), s(a[1]));
      ctx.lineTo(s(b[0]), s(b[1]));
    }
    ctx.stroke();
    return;
  }

  if (prim.kind === 'poly') {
    const [first, ...rest] = prim.pts;
    if (first === undefined) return;
    ctx.beginPath();
    ctx.moveTo(s(first[0]), s(first[1]));
    for (const p of rest) ctx.lineTo(s(p[0]), s(p[1]));
    ctx.closePath();
    ctx.stroke();
    return;
  }

  if (prim.kind === 'circle') {
    ctx.beginPath();
    ctx.arc(s(prim.c[0]), s(prim.c[1]), s(prim.r), 0, Math.PI * 2);
    if (prim.fill === true) {
      // Tô bằng CHÍNH màu nét. Không có đường nào cho một màu thứ hai vào đây.
      ctx.fillStyle = ctx.strokeStyle;
      ctx.fill();
    } else {
      ctx.stroke();
    }
    return;
  }

  ctx.beginPath();
  ctx.moveTo(s(prim.from[0]), s(prim.from[1]));
  for (const [c1, c2, to] of prim.segs) {
    ctx.bezierCurveTo(s(c1[0]), s(c1[1]), s(c2[0]), s(c2[1]), s(to[0]), s(to[1]));
  }
  if (prim.close === true) ctx.closePath();
  ctx.stroke();
}

/**
 * Vẽ một quân, tại gốc toạ độ đã dịch vào TÂM ô và đã xoay.
 *
 * `half` là nửa cạnh ô đã trừ phần thụt vào (`MASTER.md` §6), nên mọi bộ dùng chung
 * một hộp và không bộ nào tự quyết kích thước riêng.
 */
export function drawPiece(
  ctx: CanvasRenderingContext2D,
  set: PieceSet,
  side: Side,
  half: number,
): void {
  for (const prim of PIECE_SHAPES[set][side]) drawPrim(ctx, prim, half);
}

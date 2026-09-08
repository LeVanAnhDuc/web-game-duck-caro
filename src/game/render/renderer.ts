import type { Camera } from './camera';
import { drawGrid } from './layers/grid';
import { drawMarks } from './layers/marks';
import {
  drawCursorRing,
  drawLastMoveRing,
  drawPreview,
  drawWinStroke,
} from './layers/overlay';
import type { Palette } from './palette';
import type { GameStatus, Move, Point, Side } from '@/game/core/types';

export type FrameInput = {
  readonly cam: Camera;
  readonly moves: readonly Move[];
  readonly status: GameStatus;
  readonly preview: Point | null;
  readonly previewSide: Side;
  /** Ô con trỏ bàn phím, `null` khi chưa ai dùng bàn phím (FR-15 · ADR-0020). */
  readonly cursor: Point | null;
  readonly w: number;
  readonly h: number;
  readonly palette: Palette;
};

/** Thứ tự lớp: giấy -> quân -> lớp phủ. Nét gạch thắng vẽ sau cùng để không bị che. */
export function drawFrame(ctx: CanvasRenderingContext2D, input: FrameInput): void {
  const { cam, moves, status, preview, previewSide, cursor, w, h, palette } = input;

  drawGrid(ctx, cam, w, h, palette);
  drawMarks(ctx, cam, moves, palette);

  const last = moves[moves.length - 1];
  if (last !== undefined) drawLastMoveRing(ctx, cam, last.at, palette);
  if (preview !== null) drawPreview(ctx, cam, preview, previewSide, palette);
  // Vòng con trỏ vẽ SAU quân xem trước: hai thứ có thể trùng ô (bấm Gợi ý rồi dùng
  // bàn phím), và lúc đó cái mang thông tin vị trí là vòng con trỏ.
  if (cursor !== null) drawCursorRing(ctx, cam, cursor, palette);
  if (status.kind === 'won') drawWinStroke(ctx, cam, status.line, palette);
}

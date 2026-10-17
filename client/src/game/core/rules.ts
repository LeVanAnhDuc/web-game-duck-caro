import { markAt, type Board } from './board';
import { DIRECTIONS, WIN_LENGTH, type Point, type Rule } from './types';

export type Run = {
  /** Các ô của đoạn, theo thứ tự dọc theo trục. */
  readonly cells: readonly Point[];
  /** Số đầu mà ô ngay ngoài đang TRỐNG. `0` nghĩa là bị chặn cả hai đầu. */
  readonly openEnds: number;
};

const EMPTY_RUN: Run = { cells: [], openEnds: 0 };

/**
 * ĐOẠN CỰC ĐẠI các quân cùng bên liền nhau chứa `at`, theo trục `dir`.
 *
 * Vì đoạn là CỰC ĐẠI, ô ngay ngoài mỗi đầu chỉ có thể trống hoặc là quân địch —
 * không thể là quân cùng bên, vì thế thì đoạn đã dài hơn. Nên `openEnds === 0`
 * tương đương "bị địch chặn cả hai đầu", và đó là toàn bộ luật chặn (ADR-0003).
 */
export function maximalRun(board: Board, at: Point, dir: Point): Run {
  const side = markAt(board, at);
  if (side === undefined) return EMPTY_RUN;

  const cells: Point[] = [at];

  let back: Point = { x: at.x - dir.x, y: at.y - dir.y };
  while (markAt(board, back) === side) {
    cells.unshift(back);
    back = { x: back.x - dir.x, y: back.y - dir.y };
  }

  let forward: Point = { x: at.x + dir.x, y: at.y + dir.y };
  while (markAt(board, forward) === side) {
    cells.push(forward);
    forward = { x: forward.x + dir.x, y: forward.y + dir.y };
  }

  const openEnds =
    (markAt(board, back) === undefined ? 1 : 0) +
    (markAt(board, forward) === undefined ? 1 : 0);

  return { cells, openEnds };
}

/**
 * Chuỗi thắng đi qua `at` theo luật `rule`, hoặc `null`.
 *
 * KHÔNG quét cửa sổ 5 ô trượt, ở CẢ HAI luật. Cửa sổ 5 ô cho kết quả SAI ở chuỗi 6
 * bị chặn hai đầu: mỗi cửa sổ con có một đầu là quân CỦA MÌNH, mà quân mình không
 * phải quân địch nên không tính chặn — nên nó báo thắng (bất biến 3).
 *
 * Luật chỉ quyết `openEnds` có được xét hay không (ADR-0025). Nó KHÔNG đổi cách quét,
 * và nó không nới `WIN_LENGTH`: bốn quân bị chặn hai đầu vẫn không thắng ở luật `free`.
 *
 * `rule` đến từ ván (`GameState.rule`), không từ cài đặt — bất biến 14.
 */
export function winningLine(
  board: Board,
  at: Point,
  rule: Rule,
): readonly Point[] | null {
  for (const dir of DIRECTIONS) {
    const run = maximalRun(board, at, dir);
    if (run.cells.length < WIN_LENGTH) continue;
    if (rule === 'free' || run.openEnds > 0) return run.cells;
  }
  return null;
}

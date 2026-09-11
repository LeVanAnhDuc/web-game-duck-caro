import { describe, expect, it } from 'vitest';
import { buildBoard } from './board';
import { maximalRun, winningLine } from './rules';
import type { Move, Point } from './types';

/**
 * Dựng bàn từ một bức tranh chữ. `x` = ghế một, `o` = ghế hai, `.` = trống.
 * Ký tự thứ `i` của dòng `j` là ô `(i, j)`.
 */
function boardFrom(rows: readonly string[]) {
  const moves: Move[] = [];
  rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (ch === 'x') moves.push({ at: { x, y }, side: 'one' });
      if (ch === 'o') moves.push({ at: { x, y }, side: 'two' });
    });
  });
  return buildBoard(moves);
}

const at = (x: number, y: number): Point => ({ x, y });
const RIGHT = { x: 1, y: 0 };

describe('maximalRun', () => {
  it('đếm đoạn cực đại qua điểm, cả hai chiều', () => {
    const run = maximalRun(boardFrom(['.xxxx.']), at(2, 0), RIGHT);
    expect(run.cells).toHaveLength(4);
    expect(run.cells[0]).toEqual(at(1, 0));
    expect(run.openEnds).toBe(2);
  });

  it('đầu bị quân địch chiếm thì không phải đầu mở', () => {
    const run = maximalRun(boardFrom(['oxxx.']), at(2, 0), RIGHT);
    expect(run.cells).toHaveLength(3);
    expect(run.openEnds).toBe(1);
  });

  it('bị chặn cả hai đầu thì không còn đầu mở nào', () => {
    const run = maximalRun(boardFrom(['oxxxo']), at(2, 0), RIGHT);
    expect(run.cells).toHaveLength(3);
    expect(run.openEnds).toBe(0);
  });

  it('ô trống thì không có đoạn nào', () => {
    expect(maximalRun(boardFrom(['.....']), at(2, 0), RIGHT).cells).toHaveLength(0);
  });
});

describe("winningLine — luật 'blocked', caro Việt (ADR-0003)", () => {
  it('năm quân hở một đầu là THẮNG', () => {
    expect(winningLine(boardFrom(['oxxxxx.']), at(3, 0), 'blocked')).toHaveLength(5);
  });

  it('năm quân hở hai đầu là THẮNG', () => {
    expect(winningLine(boardFrom(['.xxxxx.']), at(3, 0), 'blocked')).toHaveLength(5);
  });

  it('năm quân bị chặn CẢ HAI đầu là KHÔNG thắng', () => {
    expect(winningLine(boardFrom(['oxxxxxo']), at(3, 0), 'blocked')).toBeNull();
  });

  it('sáu quân không bị chặn là THẮNG — overline vẫn thắng', () => {
    expect(winningLine(boardFrom(['.xxxxxx.']), at(3, 0), 'blocked')).toHaveLength(6);
  });

  it('sáu quân bị chặn cả hai đầu là KHÔNG thắng — ca mà cửa sổ 5 ô làm SAI', () => {
    expect(winningLine(boardFrom(['oxxxxxxo']), at(3, 0), 'blocked')).toBeNull();
  });

  it('bốn quân hở hai đầu thì chưa thắng', () => {
    expect(winningLine(boardFrom(['.xxxx.']), at(2, 0), 'blocked')).toBeNull();
  });

  it('thắng theo trục dọc', () => {
    const board = boardFrom(['.x....', '.x....', '.x....', '.x....', '.x....', '......']);
    expect(winningLine(board, at(1, 2), 'blocked')).toHaveLength(5);
  });

  it('thắng theo trục chéo xuống', () => {
    const board = boardFrom(['x.....', '.x....', '..x...', '...x..', '....x.', '......']);
    expect(winningLine(board, at(2, 2), 'blocked')).toHaveLength(5);
  });

  it('thắng theo trục chéo lên', () => {
    const board = boardFrom(['....x.', '...x..', '..x...', '.x....', 'x.....', '......']);
    expect(winningLine(board, at(2, 2), 'blocked')).toHaveLength(5);
  });

  it('thắng ở toạ độ âm cũng thắng', () => {
    const moves: Move[] = [-5, -4, -3, -2, -1].map((x) => ({
      at: { x, y: -7 },
      side: 'one' as const,
    }));
    expect(winningLine(buildBoard(moves), at(-3, -7), 'blocked')).toHaveLength(5);
  });

  it('quân hai bên xen kẽ không tạo thành chuỗi', () => {
    expect(winningLine(boardFrom(['xoxox']), at(2, 0), 'blocked')).toBeNull();
  });

  it('chuỗi bốn có khoảng trống ở giữa không phải là năm', () => {
    expect(winningLine(boardFrom(['.xx.xx.']), at(4, 0), 'blocked')).toBeNull();
  });
});

/**
 * Luật 'free' (ADR-0025). Điểm của cả khối này: cùng một bàn, cùng một ô, HAI kết quả —
 * nên nếu ở đâu đó luật bị lấy từ cài đặt thay vì từ ván (bất biến 14), thì chính những
 * ca dưới đây là chỗ nó hiện ra.
 */
describe("winningLine — luật 'free', tự do", () => {
  it('năm quân bị chặn CẢ HAI đầu VẪN thắng — đây là toàn bộ khác biệt', () => {
    expect(winningLine(boardFrom(['oxxxxxo']), at(3, 0), 'free')).toHaveLength(5);
  });

  it('sáu quân bị chặn cả hai đầu cũng thắng, và trả về cả sáu ô', () => {
    expect(winningLine(boardFrom(['oxxxxxxo']), at(3, 0), 'free')).toHaveLength(6);
  });

  it('năm quân hở đầu vẫn thắng như luật kia', () => {
    expect(winningLine(boardFrom(['.xxxxx.']), at(3, 0), 'free')).toHaveLength(5);
  });

  it('BỐN quân bị chặn hai đầu vẫn KHÔNG thắng — luật nới đầu chặn, không nới độ dài', () => {
    expect(winningLine(boardFrom(['oxxxxo']), at(2, 0), 'free')).toBeNull();
  });

  it('chuỗi bốn có khoảng trống ở giữa vẫn không phải là năm', () => {
    expect(winningLine(boardFrom(['.xx.xx.']), at(4, 0), 'free')).toBeNull();
  });

  it('vẫn xét trên đoạn cực đại, nên quân xen kẽ không thành chuỗi', () => {
    expect(winningLine(boardFrom(['xoxox']), at(2, 0), 'free')).toBeNull();
  });
});

describe('hai luật trên CÙNG một bàn', () => {
  /* Bảng này là hợp đồng của FR-18: mỗi dòng là một thế bàn và hai kết quả. */
  const cases: readonly [string, number, number | null, number | null][] = [
    ['oxxxxxo', 3, null, 5],
    ['oxxxxxxo', 3, null, 6],
    ['.xxxxx.', 3, 5, 5],
    ['oxxxxx.', 3, 5, 5],
    ['oxxxxo', 2, null, null],
  ];

  for (const [picture, x, blocked, free] of cases) {
    it(picture + ' tai x=' + x, () => {
      const board = boardFrom([picture]);
      const asBlocked = winningLine(board, at(x, 0), 'blocked');
      const asFree = winningLine(board, at(x, 0), 'free');
      expect(asBlocked === null ? null : asBlocked.length).toBe(blocked);
      expect(asFree === null ? null : asFree.length).toBe(free);
    });
  }
});

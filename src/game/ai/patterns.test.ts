import { describe, expect, it } from 'vitest';
import { buildBoard } from '@/game/core/board';
import type { Move } from '@/game/core/types';
import { LINE_RADIUS, SCORE, lineAround, liveSegment, scoreLine, scoreSegment } from './patterns';

/** Dựng một dải 13 ô: `pad` là ký tự lấp hai bên cho đủ độ dài. */
const line = (core: string, pad = '.'): string => {
  const total = LINE_RADIUS * 2 + 1;
  const left = Math.floor((total - core.length) / 2);
  return pad.repeat(left) + core + pad.repeat(total - core.length - left);
};

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

describe("liveSegment — luật 'blocked': chặn hai đầu rơi ra từ việc cắt đoạn", () => {
  it('cắt dải tại quân địch và giữ đoạn chứa ô giữa', () => {
    expect(liveSegment(line('O..MMM..O'), 'blocked')).toBe('..MMM..');
  });

  it('đoạn chặn hai đầu rộng đúng 5 là CHẾT, dù chưa có quân nào lấp đầy', () => {
    // Lấp hết 5 ô đó thành OMMMMMO — năm quân chặn cả hai đầu, không thắng.
    expect(liveSegment(line('O.MMM.O'), 'blocked')).toBeNull();
  });

  it('đoạn bị chặn hai đầu mà chỉ dài 5 là CHẾT — năm quân ở đó không thắng được', () => {
    expect(liveSegment(line('OMMMMMO'), 'blocked')).toBeNull();
    expect(liveSegment(line('OM.MMMO'), 'blocked')).toBeNull();
  });

  it('đoạn bị chặn hai đầu dài 6 thì còn sống', () => {
    expect(liveSegment(line('O.MMMM.O'), 'blocked')).toBe('.MMMM.');
  });

  it('đoạn chỉ bị chặn một đầu thì 5 ô là đủ', () => {
    // '...OMMMM.....' — chặn trái bởi O, bên phải chạy tới mép cửa sổ nên còn mở.
    const oneSideBlocked = '...OMMMM.....';
    expect(oneSideBlocked).toHaveLength(LINE_RADIUS * 2 + 1);
    expect(liveSegment(oneSideBlocked, 'blocked')).toBe('MMMM.....');
  });

  it('ô giữa là quân địch thì không có đoạn nào', () => {
    expect(liveSegment(line('OOO'), 'blocked')).toBeNull();
  });

  it('dải trống hoàn toàn vẫn là một đoạn sống', () => {
    expect(liveSegment(line('.'), 'blocked')).toHaveLength(LINE_RADIUS * 2 + 1);
  });
});

describe('scoreSegment — bảng mẫu', () => {
  it('bốn hở cao hơn bốn thường', () => {
    expect(scoreSegment('.MMMM.')).toBe(SCORE.OPEN_FOUR);
    expect(scoreSegment('MMMM..')).toBe(SCORE.FOUR);
    expect(scoreSegment('.MMMM.')).toBeGreaterThan(scoreSegment('MMMM..'));
  });

  it('bốn GÃY vẫn là bốn — đây là chỗ cách đếm đoạn liền làm sai', () => {
    expect(scoreSegment('MM.MM.')).toBe(SCORE.FOUR);
    expect(scoreSegment('MMM.M.')).toBe(SCORE.FOUR);
    expect(scoreSegment('M.MMM.')).toBe(SCORE.FOUR);
  });

  it('ba hở cao hơn ba bị chặn', () => {
    expect(scoreSegment('.MMM.')).toBe(SCORE.OPEN_THREE);
    expect(scoreSegment('MMM..')).toBe(SCORE.CLOSED_THREE);
  });

  it('ba gãy được nhận ra, và xếp dưới ba hở', () => {
    expect(scoreSegment('.M.MM.')).toBe(SCORE.BROKEN_THREE);
    expect(scoreSegment('.MM.M.')).toBe(SCORE.BROKEN_THREE);
    expect(SCORE.BROKEN_THREE).toBeLessThan(SCORE.OPEN_THREE);
  });

  it('hai hở, hai gãy, hai thường xếp đúng thứ tự', () => {
    expect(scoreSegment('.MM.')).toBe(SCORE.OPEN_TWO);
    expect(scoreSegment('.M.M.')).toBe(SCORE.BROKEN_TWO);
    expect(scoreSegment('MM...')).toBe(SCORE.CLOSED_TWO);
  });

  it('đoạn không có quân nào thì không có điểm', () => {
    expect(scoreSegment('.....')).toBe(0);
  });
});

describe('lineAround', () => {
  it('nhìn từ phía mình: quân mình là M, quân địch là O', () => {
    const board = boardFrom(['.xxo.']);
    const text = lineAround(board, { x: 1, y: 0 }, { x: 1, y: 0 }, 'one');
    expect(text[LINE_RADIUS]).toBe('M');
    expect(text.slice(LINE_RADIUS, LINE_RADIUS + 3)).toBe('MMO');
  });

  it('cùng một dải nhìn từ phía kia thì M và O đổi chỗ', () => {
    const board = boardFrom(['.xxo.']);
    const text = lineAround(board, { x: 1, y: 0 }, { x: 1, y: 0 }, 'two');
    expect(text.slice(LINE_RADIUS, LINE_RADIUS + 3)).toBe('OOM');
  });
});

describe('scoreLine trên bàn thật', () => {
  it('bốn quân hở hai đầu được chấm là bốn hở', () => {
    const board = boardFrom(['..xxxx..']);
    expect(scoreLine(board, { x: 3, y: 0 }, { x: 1, y: 0 }, 'one', 'blocked')).toBe(SCORE.OPEN_FOUR);
  });

  it('năm quân bị chặn hai đầu được chấm BẰNG 0 — không phải điểm cao', () => {
    const board = boardFrom(['oxxxxxo']);
    expect(scoreLine(board, { x: 3, y: 0 }, { x: 1, y: 0 }, 'one', 'blocked')).toBe(0);
  });

  it('hướng không có quân nào của mình thì bằng điểm một quân lẻ', () => {
    const board = boardFrom(['..x..']);
    expect(scoreLine(board, { x: 2, y: 0 }, { x: 0, y: 1 }, 'one', 'blocked')).toBe(SCORE.ONE);
  });
});

/**
 * Luật 'free' trong engine (ADR-0025). Cả khối này canh đúng một thứ: engine phải
 * THẤY đoạn năm bị chặn hai đầu là một đe doạ thật, vì ở luật này nó thắng ngay.
 *
 * Nếu `rule` không xuống tới đây, mọi test ở trên vẫn xanh — bảng mẫu vẫn đúng cho
 * luật `blocked`. Đây là bộ duy nhất đỏ, và đó là lý do nó tồn tại.
 */
describe("liveSegment — luật 'free': chặn hai đầu KHÔNG còn giết đoạn", () => {
  it('đoạn chặn hai đầu dài đúng 5 vẫn SỐNG', () => {
    expect(liveSegment(line('O.MMM.O'), 'free')).toBe('.MMM.');
  });

  it('năm quân chặn hai đầu là đoạn sống — ở luật kia nó là null', () => {
    expect(liveSegment(line('OMMMMMO'), 'free')).toBe('MMMMM');
    expect(liveSegment(line('OMMMMMO'), 'blocked')).toBeNull();
  });

  it('đoạn chặn hai đầu chỉ dài 4 thì CHẾT ở cả hai luật — độ dài không được nới', () => {
    expect(liveSegment(line('O.MM.O'), 'free')).toBeNull();
    expect(liveSegment(line('O.MM.O'), 'blocked')).toBeNull();
  });

  it('ô giữa là quân địch thì vẫn không có đoạn nào', () => {
    expect(liveSegment(line('OOO'), 'free')).toBeNull();
  });
});

describe("scoreLine — luật 'free' chấm đoạn năm bị chặn là đe doạ thật", () => {
  it('năm quân chặn hai đầu: 0 điểm ở blocked, điểm bốn-hở-trở-lên ở free', () => {
    const board = boardFrom(['oxxxxxo']);
    const at = { x: 3, y: 0 };
    const right = { x: 1, y: 0 };
    expect(scoreLine(board, at, right, 'one', 'blocked')).toBe(0);
    expect(scoreLine(board, at, right, 'one', 'free')).toBeGreaterThanOrEqual(
      SCORE.FOUR,
    );
  });

  it('bốn quân hở hai đầu chấm giống nhau ở cả hai luật', () => {
    const board = boardFrom(['..xxxx..']);
    const at = { x: 3, y: 0 };
    const right = { x: 1, y: 0 };
    expect(scoreLine(board, at, right, 'one', 'free')).toBe(
      scoreLine(board, at, right, 'one', 'blocked'),
    );
  });
});

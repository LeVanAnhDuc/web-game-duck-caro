import { describe, expect, it } from 'vitest';
import type { Side } from '@/game/core/types';
import { drawMark } from './layers/marks';
import type { Palette } from './palette';
import { PIECE_SHAPES as SHARED_SHAPES } from '@/game/appearance/shapes';
import { PIECE_SETS, PIECE_SHAPES, isPieceSet } from './pieceSets';

const cam = { cell: 32, ox: 0, oy: 0 };

/** Hai giá trị canh được: bất kỳ màu nào KHÁC hai màu này là một vi phạm bất biến 16. */
const MARK_ONE = '#111111';
const MARK_TWO = '#b4453c';

const palette: Palette = {
  paper: '#f7f3e8',
  ruleMinor: '#dcd3be',
  ruleMajor: '#c7bca3',
  markOne: MARK_ONE,
  markTwo: MARK_TWO,
  win: '#15803d',
  winCasing: '#f7f3e8',
  focus: '#1d4ed8',
  inkMuted: '#6b6459',
};

/**
 * `ctx` giả ghi lại MỌI màu được gán và mọi lệnh vẽ.
 *
 * Không dùng canvas thật: ở đây không cần biết hình trông thế nào — việc đó thuộc
 * `NFR-A11Y-07` và chỉ mắt người trả lời được. Cái test này canh một thứ máy kiểm
 * được: không bộ nào đặt một màu ngoài palette.
 */
function spyCtx() {
  const colours: string[] = [];
  const ops: string[] = [];
  const ctx = {
    set strokeStyle(v: string) {
      colours.push(v);
    },
    get strokeStyle() {
      return colours[colours.length - 1] ?? '';
    },
    set fillStyle(v: string) {
      colours.push(v);
    },
    get fillStyle() {
      return colours[colours.length - 1] ?? '';
    },
    lineWidth: 0,
    lineCap: '' as CanvasLineCap,
    lineJoin: '' as CanvasLineJoin,
    globalAlpha: 1,
    save: () => ops.push('save'),
    restore: () => ops.push('restore'),
    translate: () => ops.push('translate'),
    rotate: () => ops.push('rotate'),
    beginPath: () => ops.push('beginPath'),
    moveTo: () => ops.push('moveTo'),
    lineTo: () => ops.push('lineTo'),
    closePath: () => ops.push('closePath'),
    arc: () => ops.push('arc'),
    rect: () => ops.push('rect'),
    bezierCurveTo: () => ops.push('bezierCurveTo'),
    stroke: () => ops.push('stroke'),
    fill: () => ops.push('fill'),
  };
  return { ctx: ctx as unknown as CanvasRenderingContext2D, colours, ops };
}

describe('PIECE_SHAPES — bảng tra bốn bộ (FR-20 · ADR-0027)', () => {
  it('mỗi bộ có đúng hai hình, một cho mỗi ghế, và hình nào cũng có nét', () => {
    for (const set of PIECE_SETS) {
      for (const side of ['one', 'two'] as const) {
        const shape = PIECE_SHAPES[set][side];
        expect(Array.isArray(shape), `${set}/${side}`).toBe(true);
        expect(shape.length, `${set}/${side}`).toBeGreaterThan(0);
      }
    }
  });

  /*
   * Điểm của việc tả hình MỘT LẦN (`game/appearance/shapes.ts`): canvas và SVG đọc
   * chung. Test này canh rằng không ai lặng lẽ dựng một bảng hình thứ hai — hình
   * trong bảng chọn khác hình trên bàn là làm người chơi chọn một thứ, nhận một thứ
   * khác, và cả hai bản đều "đúng" theo bản thân chúng nên không gì đỏ.
   */
  it('bảng hình mà canvas dùng CHÍNH LÀ bảng trong game/appearance', () => {
    expect(PIECE_SHAPES).toBe(SHARED_SHAPES);
  });

  it('không có bộ nào ngoài bốn bộ đã khai báo', () => {
    expect(Object.keys(PIECE_SHAPES).sort()).toEqual([...PIECE_SETS].sort());
  });

  it('tên bộ lạ bị từ chối — nó sẽ thành khoá tra bảng không tồn tại', () => {
    expect(isPieceSet('pencil')).toBe(true);
    expect(isPieceSet('duck')).toBe(true);
    expect(isPieceSet('skin-vip')).toBe(false);
    expect(isPieceSet(undefined)).toBe(false);
    expect(isPieceSet(null)).toBe(false);
  });
});

/**
 * BẤT BIẾN 16. Một bộ quân chỉ đổi HÌNH; màu luôn là `--mark-one` / `--mark-two`
 * đã có số đo trong `MASTER.md` §1 và §2.
 *
 * Không có test này thì một bộ mới lén được một hex vào sản phẩm, và hex đó nằm ngoài
 * mọi phép đo tương phản — `NFR-A11Y-01` vẫn "đạt" trên giấy vì không ai đo lại.
 */
describe('bất biến 16 — bộ quân không được đặt màu riêng', () => {
  for (const set of PIECE_SETS) {
    for (const side of ['one', 'two'] as const satisfies readonly Side[]) {
      it(`${set}/${side} chỉ dùng màu của ghế, không màu nào khác`, () => {
        const { ctx, colours, ops } = spyCtx();
        drawMark(ctx, cam, { x: 0, y: 0 }, side, palette, 1, set);

        const expected = side === 'one' ? MARK_ONE : MARK_TWO;
        expect(colours.length).toBeGreaterThan(0);
        for (const colour of colours) expect(colour, `${set}/${side}`).toBe(expected);
        // Và nó phải vẽ thật, chứ không phải im lặng không làm gì.
        expect(ops.some((op) => op === 'stroke' || op === 'fill')).toBe(true);
      });
    }
  }

  it('hai ghế của cùng một bộ cho ra hai chuỗi lệnh KHÁC nhau', () => {
    for (const set of PIECE_SETS) {
      const a = spyCtx();
      const b = spyCtx();
      drawMark(a.ctx, cam, { x: 0, y: 0 }, 'one', palette, 1, set);
      drawMark(b.ctx, cam, { x: 0, y: 0 }, 'two', palette, 1, set);
      // Cùng hình cho hai ghế là mất khả năng đọc bàn — ADR-0008.
      expect(a.ops.join(','), set).not.toBe(b.ops.join(','));
    }
  });
});

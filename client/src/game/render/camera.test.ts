import { describe, expect, it } from 'vitest';
import {
  CELL_MAX,
  CELL_MIN,
  cellCenterToScreen,
  cellToScreen,
  clampCell,
  ensureVisible,
  fitToMoves,
  panBy,
  screenToCell,
  zoomAt,
  type Camera,
} from './camera';
import type { Move } from '@/game/core/types';

const cam = (cell: number, ox = 0, oy = 0): Camera => ({ cell, ox, oy });

describe('screenToCell — hàm SÀN, không phải làm tròn', () => {
  it('mọi điểm trong một ô đều cho ra ô đó', () => {
    const c = cam(32);
    expect(screenToCell(c, 0, 0)).toEqual({ x: 0, y: 0 });
    expect(screenToCell(c, 31.9, 31.9)).toEqual({ x: 0, y: 0 });
    expect(screenToCell(c, 32, 32)).toEqual({ x: 1, y: 1 });
  });

  it('toạ độ âm: -1px thuộc ô -1, không thuộc ô 0 — đây là chỗ Math.trunc sai', () => {
    const c = cam(32);
    expect(screenToCell(c, -1, -1)).toEqual({ x: -1, y: -1 });
    expect(screenToCell(c, -32, -32)).toEqual({ x: -1, y: -1 });
    expect(screenToCell(c, -33, -33)).toEqual({ x: -2, y: -2 });
  });

  it('gốc lệch vẫn đúng', () => {
    expect(screenToCell(cam(28, -22, 34), 90, 286)).toEqual({ x: 4, y: 9 });
  });
});

describe('đi qua lại giữa ô và màn hình', () => {
  it('tâm ô đổi ra màn hình rồi đổi về đúng ô đó, ở mọi mức phóng', () => {
    for (const cell of [CELL_MIN, 28, 32, CELL_MAX]) {
      for (const c of [cam(cell), cam(cell, -22, 34), cam(cell, 312, 84)]) {
        for (const p of [
          { x: 0, y: 0 },
          { x: 7, y: 11 },
          { x: -3, y: -9 },
          { x: -120, y: 240 },
        ]) {
          const screen = cellCenterToScreen(c, p);
          expect(
            screenToCell(c, screen.x, screen.y),
            `cell=${cell} ox=${c.ox} p=${p.x},${p.y}`,
          ).toEqual(p);
        }
      }
    }
  });

  it('cellToScreen cho góc trên-trái của ô', () => {
    expect(cellToScreen(cam(32, 10, 20), { x: 2, y: 3 })).toEqual({ x: 74, y: 116 });
  });
});

describe('clampCell', () => {
  it('kẹp vào biên thu phóng', () => {
    expect(clampCell(4)).toBe(CELL_MIN);
    expect(clampCell(999)).toBe(CELL_MAX);
    expect(clampCell(28)).toBe(28);
  });
});

describe('panBy', () => {
  it('dịch gốc, không đổi mức phóng', () => {
    expect(panBy(cam(32, 10, 20), -5, 7)).toEqual({ cell: 32, ox: 5, oy: 27 });
  });
});

describe('zoomAt', () => {
  it('giữ ô dưới con trỏ đứng yên', () => {
    const before = cam(32, 0, 0);
    const cellBefore = screenToCell(before, 100, 60);
    const after = zoomAt(before, 100, 60, 48);
    expect(after.cell).toBe(48);
    expect(screenToCell(after, 100, 60)).toEqual(cellBefore);
  });

  it('kẹp mức phóng ở biên trên', () => {
    expect(zoomAt(cam(32, 0, 0), 50, 50, 9999).cell).toBe(CELL_MAX);
  });

  it('kẹp mức phóng ở biên dưới', () => {
    expect(zoomAt(cam(32, 0, 0), 50, 50, 1).cell).toBe(CELL_MIN);
  });
});

describe('fitToMoves', () => {
  it('ván trống thì đưa ô (0,0) vào giữa khung nhìn', () => {
    const c = fitToMoves([], 375, 656);
    expect(screenToCell(c, 375 / 2, 656 / 2)).toEqual({ x: 0, y: 0 });
  });

  it('mọi quân đã đánh đều nằm trong khung nhìn', () => {
    const moves: Move[] = [
      { at: { x: -8, y: -3 }, side: 'one' },
      { at: { x: 11, y: 9 }, side: 'two' },
    ];
    const c = fitToMoves(moves, 375, 656);
    for (const move of moves) {
      const s = cellToScreen(c, move.at);
      expect(s.x).toBeGreaterThanOrEqual(0);
      expect(s.y).toBeGreaterThanOrEqual(0);
      expect(s.x + c.cell).toBeLessThanOrEqual(375);
      expect(s.y + c.cell).toBeLessThanOrEqual(656);
    }
  });

  it('không phóng nhỏ hơn CELL_MIN dù thế trận rất rộng', () => {
    const moves: Move[] = [
      { at: { x: -500, y: -500 }, side: 'one' },
      { at: { x: 500, y: 500 }, side: 'two' },
    ];
    expect(fitToMoves(moves, 375, 656).cell).toBe(CELL_MIN);
  });
});

describe('ensureVisible (ADR-0020)', () => {
  const cam = { cell: 32, ox: 100, oy: 100 };
  const view = { w: 320, h: 320 };

  it('ô đã nằm trọn trong khung thì trả về CHÍNH camera đó, không phải bản sao', () => {
    // `toBe` chứ không `toEqual`: React so sánh tham chiếu, nên trả bản sao mỗi lần
    // bấm phím sẽ vẽ lại cả bàn dù không có gì đổi.
    expect(ensureVisible(cam, { x: 0, y: 0 }, view.w, view.h)).toBe(cam);
    expect(ensureVisible(cam, { x: 2, y: 2 }, view.w, view.h)).toBe(cam);
  });

  it('ô lệch sang phải ngoài khung thì bàn dịch sang trái, mức phóng không đổi', () => {
    const next = ensureVisible(cam, { x: 10, y: 0 }, view.w, view.h);
    expect(next.cell).toBe(cam.cell);
    expect(next.oy).toBe(cam.oy);
    expect(next.ox).toBeLessThan(cam.ox);
    // Ô 10 có mép phải ở 100 + 11*32 = 452; cần <= 320 trừ một ô đệm.
    expect(10 * next.cell + next.ox + next.cell).toBeLessThanOrEqual(view.w);
  });

  it('ô lệch sang trái ngoài khung thì bàn dịch sang phải', () => {
    const next = ensureVisible(cam, { x: -6, y: 0 }, view.w, view.h);
    expect(next.ox).toBeGreaterThan(cam.ox);
    expect(-6 * next.cell + next.ox).toBeGreaterThanOrEqual(0);
  });

  it('lệch lên trên và xuống dưới, mỗi chiều một ca', () => {
    const up = ensureVisible(cam, { x: 0, y: -6 }, view.w, view.h);
    expect(up.oy).toBeGreaterThan(cam.oy);
    expect(up.ox).toBe(cam.ox);

    const down = ensureVisible(cam, { x: 0, y: 12 }, view.w, view.h);
    expect(down.oy).toBeLessThan(cam.oy);
    expect(down.ox).toBe(cam.ox);
  });

  it('lệch cả hai chiều thì dịch cả hai', () => {
    const next = ensureVisible(cam, { x: 20, y: -9 }, view.w, view.h);
    expect(next.ox).not.toBe(cam.ox);
    expect(next.oy).not.toBe(cam.oy);
  });

  it('khung nhỏ hơn một ô vẫn ra số hữu hạn, không NaN và không treo', () => {
    const next = ensureVisible(cam, { x: 5, y: 5 }, 10, 10);
    expect(Number.isFinite(next.ox)).toBe(true);
    expect(Number.isFinite(next.oy)).toBe(true);
  });

  it('toạ độ rất âm vẫn được đưa vào khung', () => {
    const next = ensureVisible(cam, { x: -400, y: -400 }, view.w, view.h);
    const left = -400 * next.cell + next.ox;
    const top = -400 * next.cell + next.oy;
    expect(left).toBeGreaterThanOrEqual(0);
    expect(top).toBeGreaterThanOrEqual(0);
    expect(left + next.cell).toBeLessThanOrEqual(view.w);
  });
});

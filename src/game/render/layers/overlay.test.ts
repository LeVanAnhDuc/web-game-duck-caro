import { describe, expect, it } from 'vitest';
import { placeConfirmButton, winStrokePath } from './overlay';
import type { Move, Point } from '@/game/core/types';

const cam = { cell: 32, ox: 0, oy: 0 };

describe('winStrokePath', () => {
  it('đi từ tâm ô đầu tới tâm ô cuối, có nhô ra hai đầu', () => {
    const line: Point[] = [0, 1, 2, 3, 4].map((x) => ({ x, y: 0 }));
    const path = winStrokePath(cam, line);
    expect(path).not.toBeNull();
    // Tâm ô 0 là (16,16); nét nhô ra 7px về bên trái.
    expect(path?.from).toEqual({ x: 16 - 7, y: 16 });
    expect(path?.to).toEqual({ x: 4 * 32 + 16 + 7, y: 16 });
  });

  it('chuỗi rỗng thì không có nét nào', () => {
    expect(winStrokePath(cam, [])).toBeNull();
  });

  it('chuỗi ở toạ độ âm vẫn ra nét đúng', () => {
    const line: Point[] = [-4, -3, -2, -1, 0].map((x) => ({ x, y: -2 }));
    const path = winStrokePath(cam, line);
    expect(path?.from).toEqual({ x: -4 * 32 + 16 - 7, y: -2 * 32 + 16 });
  });

  it('chuỗi chéo cho nét chéo, nhô ra theo đúng hướng', () => {
    const line: Point[] = [0, 1, 2, 3, 4].map((i) => ({ x: i, y: i }));
    const path = winStrokePath(cam, line);
    expect(path).not.toBeNull();
    if (path === null) return;
    expect(path.to.x - path.from.x).toBeCloseTo(path.to.y - path.from.y, 5);
    expect(path.from.x).toBeLessThan(16);
    expect(path.from.y).toBeLessThan(16);
  });

  it('chuỗi một ô không làm chia cho 0', () => {
    const path = winStrokePath(cam, [{ x: 3, y: 3 }]);
    expect(path).not.toBeNull();
    expect(Number.isFinite(path?.from.x)).toBe(true);
  });
});

describe('placeConfirmButton (ADR-0017)', () => {
  const view = { w: 400, h: 400 };
  const btn = { w: 72, h: 44 };
  const at: Point = { x: 2, y: 2 };
  /*
   * Ô (2,2) có góc trên-trái ở (64,64) với cam.cell = 32. Nút rộng 72px nên bên trái
   * ô đó KHÔNG đủ chỗ (64 < 72 + 8) — dùng ô này cho mọi ca "sang trái" thì test xanh
   * kể cả khi hàm bỏ qua việc kiểm ô trái có quân hay không. Vì thế các ca đó dùng
   * `far`, đứng đủ xa mép để cạnh trái là một lựa chọn thật.
   */
  const far: Point = { x: 4, y: 2 };
  const mv = (x: number, y: number): Move => ({ at: { x, y }, side: 'ai' });

  it('ô bên phải trống thì nút nằm bên phải', () => {
    expect(placeConfirmButton(cam, at, [], view, btn)).toEqual({ x: 64 + 32 + 8, y: 62 });
  });

  it('ô bên phải có quân thì nút sang trái', () => {
    // Góc ô (4,2) là (128,64); bên trái còn 128px, thừa chỗ cho nút 72px.
    const spot = placeConfirmButton(cam, far, [mv(5, 2)], view, btn);
    expect(spot).toEqual({ x: 128 - 8 - 72, y: 62 });
  });

  it('phải và trái đều có quân thì nút xuống dưới', () => {
    const spot = placeConfirmButton(cam, far, [mv(5, 2), mv(3, 2)], view, btn);
    expect(spot).toEqual({ x: 128, y: 64 + 32 + 8 });
  });

  it('ba cạnh kín thì nút lên trên', () => {
    const moves = [mv(5, 2), mv(3, 2), mv(4, 3)];
    expect(placeConfirmButton(cam, far, moves, view, btn)).toEqual({ x: 128, y: 64 - 8 - 44 });
  });

  it('cạnh phải trống nhưng tràn khung nhìn thì bỏ qua, sang trái', () => {
    const narrow = { w: 200, h: 400 };
    // Bên phải cần tới x = 168 + 72 = 240 > 200, nên không dùng được dù ô đó trống.
    expect(placeConfirmButton(cam, far, [], narrow, btn)).toEqual({ x: 128 - 8 - 72, y: 62 });
  });

  it('bốn cạnh đều không dùng được thì về mặc định bên phải, không ném', () => {
    const moves = [mv(3, 2), mv(1, 2), mv(2, 3), mv(2, 1)];
    const tiny = { w: 10, h: 10 };
    expect(placeConfirmButton(cam, at, moves, tiny, btn)).toEqual({ x: 64 + 32 + 8, y: 62 });
  });

  it('quân của CHÍNH ô đang xem trước không chặn cạnh nào', () => {
    // Ô đang xem trước trống theo định nghĩa; một quân ở đó là dữ liệu vô lý,
    // nhưng nó không được làm hàm này đổi kết quả.
    expect(placeConfirmButton(cam, at, [mv(2, 2)], view, btn)).toEqual({ x: 104, y: 62 });
  });

  it('toạ độ âm vẫn ra vị trí đúng', () => {
    const camShifted = { cell: 32, ox: 200, oy: 200 };
    const negative: Point = { x: -2, y: -1 };
    // Góc ô (-2,-1) = (200-64, 200-32) = (136, 168).
    const spot = placeConfirmButton(camShifted, negative, [], view, btn);
    expect(spot).toEqual({ x: 136 + 32 + 8, y: 166 });
  });
});

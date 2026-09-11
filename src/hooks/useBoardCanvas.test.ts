import { act, createElement, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it, vi } from 'vitest';
import { useBoardCanvas, type BoardCanvas } from './useBoardCanvas';
import { CELL_MAX, CELL_MIN } from '@/game/render/camera';
import type { GameStatus, Move, Point } from '@/game/core/types';

/**
 * Gắn hook vào một cây React thật, và cho canvas một kích thước — happy-dom trả 0 cho
 * mọi phép đo, nên không đặt tay thì `ensureVisible` luôn làm việc trên khung 0×0 và
 * mọi bài test về khung nhìn trở thành vô nghĩa mà vẫn xanh.
 */
/**
 * `readPalette` CỐ Ý ném khi thiếu biến palette (`palette.ts`), và happy-dom không nạp
 * `globals.css`. Nên test phải tự bơm token vào — không phải để né lỗi, mà vì cái lỗi
 * đó đang làm đúng việc của nó.
 */
function givePalette(el: HTMLElement) {
  for (const [name, value] of Object.entries({
    '--paper': '#f7f3e8',
    '--rule-minor': '#dcd3be',
    '--rule-major': '#c7bca3',
    '--mark-human': '#12100e',
    '--mark-ai': '#b4453c',
    '--win': '#15803d',
    '--win-casing': '#f7f3e8',
    '--focus': '#1d4ed8',
    '--ink-muted': '#6b6459',
  })) {
    el.style.setProperty(name, value);
  }
}

function mountBoard(
  opts: { moves?: Move[]; status?: GameStatus; onPlace?: (at: Point) => void } = {},
) {
  const onPlace = opts.onPlace ?? vi.fn();
  const ref: { current: BoardCanvas | null } = { current: null };

  const Probe = () => {
    const board = useBoardCanvas({
      moves: opts.moves ?? [],
      status: opts.status ?? { kind: 'playing' },
      onPlace,
    });
    ref.current = board;
    const attached = useRef(false);
    if (!attached.current && board.canvasRef.current === null) {
      const canvas = document.createElement('canvas');
      // Token phải nằm TRÊN canvas: `readPalette` đọc computed style của chính nó, và
      // happy-dom không kế thừa custom property từ `:root` xuống con.
      givePalette(canvas);
      canvas.width = 320;
      canvas.height = 320;
      Object.defineProperty(canvas, 'clientWidth', { value: 320 });
      Object.defineProperty(canvas, 'clientHeight', { value: 320 });
      const parent = document.createElement('div');
      Object.defineProperty(parent, 'clientWidth', { value: 320 });
      Object.defineProperty(parent, 'clientHeight', { value: 320 });
      parent.appendChild(canvas);
      document.body.appendChild(parent);
      board.canvasRef.current = canvas;
      attached.current = true;
    }
    return null;
  };

  const host = document.createElement('div');
  document.body.appendChild(host);
  act(() => {
    createRoot(host).render(createElement(Probe));
  });
  return { ref, onPlace };
}

/** Sự kiện bàn phím giả, đủ hình dạng cho `onKeyDown` của React. */
function key(k: string, mods: { shift?: boolean } = {}) {
  const prevented = { count: 0 };
  const event = {
    key: k,
    shiftKey: mods.shift ?? false,
    preventDefault: () => {
      prevented.count += 1;
    },
  } as unknown as React.KeyboardEvent<HTMLCanvasElement>;
  return { event, prevented };
}

const press = (
  ref: { current: BoardCanvas | null },
  k: string,
  mods: { shift?: boolean } = {},
) => {
  const { event, prevented } = key(k, mods);
  act(() => {
    ref.current?.onKeyDown(event);
  });
  return prevented;
};

const moveAt = (x: number, y: number): Move => ({ at: { x, y }, side: 'one' });

describe('useBoardCanvas — con trỏ bàn phím (ADR-0020)', () => {
  it('lần bấm mũi tên ĐẦU TIÊN chỉ đặt con trỏ, không dịch nó', () => {
    // Dịch luôn ở lần đầu nghĩa là ô đầu tiên người dùng thấy đã lệch một ô so với
    // nước cuối, và không ai hiểu tại sao.
    const { ref } = mountBoard({ moves: [moveAt(3, 4)] });
    expect(ref.current?.cursor).toBeNull();
    press(ref, 'ArrowRight');
    expect(ref.current?.cursor).toEqual({ x: 3, y: 4 });
  });

  it('ván trống thì con trỏ bắt đầu ở (0,0)', () => {
    const { ref } = mountBoard();
    press(ref, 'ArrowUp');
    expect(ref.current?.cursor).toEqual({ x: 0, y: 0 });
  });

  it('bốn mũi tên dịch con trỏ đúng một ô mỗi chiều', () => {
    const { ref } = mountBoard({ moves: [moveAt(0, 0)] });
    press(ref, 'ArrowRight');
    press(ref, 'ArrowRight');
    expect(ref.current?.cursor).toEqual({ x: 1, y: 0 });
    press(ref, 'ArrowDown');
    expect(ref.current?.cursor).toEqual({ x: 1, y: 1 });
    press(ref, 'ArrowLeft');
    expect(ref.current?.cursor).toEqual({ x: 0, y: 1 });
    press(ref, 'ArrowUp');
    expect(ref.current?.cursor).toEqual({ x: 0, y: 0 });
  });

  it('mũi tên có preventDefault, nên trang không cuộn theo', () => {
    const { ref } = mountBoard();
    expect(press(ref, 'ArrowDown').count).toBe(1);
  });

  it('Shift + mũi tên kéo bàn đúng một ô, mức phóng không đổi', () => {
    const { ref } = mountBoard({ moves: [moveAt(0, 0)] });
    press(ref, 'ArrowRight');
    const before = ref.current?.cam;
    press(ref, 'ArrowRight', { shift: true });
    const after = ref.current?.cam;
    expect(after?.cell).toBe(before?.cell);
    expect(after?.ox).toBe((before?.ox ?? 0) - (before?.cell ?? 0));
    expect(after?.oy).toBe(before?.oy);
  });

  it('Shift + mũi tên giữ con trỏ ĐỨNG YÊN TRÊN MÀN HÌNH', () => {
    const { ref } = mountBoard({ moves: [moveAt(0, 0)] });
    press(ref, 'ArrowRight');
    const camBefore = ref.current?.cam;
    const cursorBefore = ref.current?.cursor;
    const screenBefore = (cursorBefore?.x ?? 0) * (camBefore?.cell ?? 0) + (camBefore?.ox ?? 0);

    press(ref, 'ArrowRight', { shift: true });
    const camAfter = ref.current?.cam;
    const cursorAfter = ref.current?.cursor;
    const screenAfter = (cursorAfter?.x ?? 0) * (camAfter?.cell ?? 0) + (camAfter?.ox ?? 0);

    // Toạ độ BÀN của con trỏ đổi, toạ độ MÀN HÌNH thì không.
    expect(cursorAfter?.x).toBe((cursorBefore?.x ?? 0) + 1);
    expect(screenAfter).toBe(screenBefore);
  });

  it('con trỏ đi xa thì khung nhìn đi theo, không bỏ nó ở ngoài màn hình', () => {
    const { ref } = mountBoard();
    press(ref, 'ArrowRight');
    const first = ref.current?.cam.ox;
    for (let i = 0; i < 40; i += 1) press(ref, 'ArrowRight');
    expect(ref.current?.cursor?.x).toBe(40);
    expect(ref.current?.cam.ox).toBeLessThan(first ?? 0);
    // Ô con trỏ phải nằm trong khung 320px.
    const cam = ref.current?.cam;
    const left = 40 * (cam?.cell ?? 0) + (cam?.ox ?? 0);
    expect(left).toBeGreaterThanOrEqual(0);
    expect(left + (cam?.cell ?? 0)).toBeLessThanOrEqual(320);
  });
});

describe('useBoardCanvas — đánh quân bằng bàn phím', () => {
  it('Enter đánh vào đúng ô con trỏ', () => {
    const onPlace = vi.fn();
    const { ref } = mountBoard({ moves: [moveAt(2, 2)], onPlace });
    press(ref, 'ArrowRight');
    press(ref, 'ArrowRight');
    press(ref, 'Enter');
    expect(onPlace).toHaveBeenCalledWith({ x: 3, y: 2 });
  });

  it('Space cũng đánh, và có preventDefault để trang không cuộn', () => {
    const onPlace = vi.fn();
    const { ref } = mountBoard({ onPlace });
    const prevented = press(ref, ' ');
    expect(onPlace).toHaveBeenCalledWith({ x: 0, y: 0 });
    expect(prevented.count).toBe(1);
  });

  it('ván đã kết thúc thì Enter KHÔNG đánh', () => {
    const onPlace = vi.fn();
    const { ref } = mountBoard({
      moves: [moveAt(0, 0)],
      status: { kind: 'resigned', by: 'one' },
      onPlace,
    });
    press(ref, 'Enter');
    expect(onPlace).not.toHaveBeenCalled();
  });
});

describe('useBoardCanvas — thu phóng và về giữa bằng bàn phím', () => {
  it('+ và - đổi mức phóng, và bị kẹp trong biên', () => {
    const { ref } = mountBoard();
    const start = ref.current?.cam.cell ?? 0;
    press(ref, '+');
    expect(ref.current?.cam.cell).toBeGreaterThan(start);
    press(ref, '-');
    press(ref, '-');
    expect(ref.current?.cam.cell).toBeLessThan(start);

    for (let i = 0; i < 60; i += 1) press(ref, '-');
    expect(ref.current?.cam.cell).toBe(CELL_MIN);
    for (let i = 0; i < 120; i += 1) press(ref, '+');
    expect(ref.current?.cam.cell).toBe(CELL_MAX);
  });

  it('= cũng là phóng to, vì + nằm cùng phím với = trên nhiều bố cục', () => {
    const { ref } = mountBoard();
    const start = ref.current?.cam.cell ?? 0;
    press(ref, '=');
    expect(ref.current?.cam.cell).toBeGreaterThan(start);
  });

  it('Home đưa khung nhìn về bao trọn mọi quân đã đánh', () => {
    const { ref } = mountBoard({ moves: [moveAt(0, 0), moveAt(9, 9)] });
    press(ref, 'Home');
    const cam = ref.current?.cam;
    expect(cam).toBeDefined();
    if (cam === undefined) return;
    for (const p of [
      { x: 0, y: 0 },
      { x: 9, y: 9 },
    ]) {
      const left = p.x * cam.cell + cam.ox;
      const top = p.y * cam.cell + cam.oy;
      expect(left).toBeGreaterThanOrEqual(0);
      expect(top).toBeGreaterThanOrEqual(0);
      expect(left + cam.cell).toBeLessThanOrEqual(320);
      expect(top + cam.cell).toBeLessThanOrEqual(320);
    }
  });
});

describe('useBoardCanvas — phím lạ và dọn trạng thái', () => {
  it('phím không thuộc bàn cờ thì không đổi gì và KHÔNG preventDefault', () => {
    // Chặn tất cả sẽ giết Tab, và người dùng bàn phím mắc kẹt trong canvas — đúng
    // cái mà FR-15 định sửa.
    const { ref } = mountBoard({ moves: [moveAt(1, 1)] });
    press(ref, 'ArrowRight');
    const before = ref.current?.cursor;
    const prevented = press(ref, 'q');
    expect(ref.current?.cursor).toEqual(before);
    expect(prevented.count).toBe(0);
    expect(press(ref, 'Tab').count).toBe(0);
  });

  it('không phím nào làm hook ném', () => {
    const { ref } = mountBoard();
    for (const k of ['Escape', 'F5', 'PageDown', 'a', 'Shift', 'Control', 'Dead']) {
      expect(() => press(ref, k)).not.toThrow();
    }
  });
});

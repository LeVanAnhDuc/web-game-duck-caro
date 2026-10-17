import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it, vi } from 'vitest';
import { MoveList } from './index';
import type { Move } from '@/game/core/types';

const moves: Move[] = [
  { at: { x: 0, y: 0 }, side: 'one' },
  { at: { x: 1, y: 0 }, side: 'two' },
  { at: { x: -12, y: 7 }, side: 'one' },
  { at: { x: 2, y: 2 }, side: 'two' },
];

// Props viết inline trong signature (R-16), nên test lấy kiểu từ chính component —
// cùng lối `Parameters<typeof X>[0]` mà test của ReviewBar đã dùng.
/*
 * `pieceSet` có mặc định ở đây chứ không ở component: bộ test này đo VAI TRÒ của
 * hàng (chỉ đọc 32px so với bấm được 44px — ADR-0018), không đo hình quân. Hình quân
 * có bộ test riêng ở `game/render/pieceSets.test.ts`.
 */
function render(props: Omit<Parameters<typeof MoveList>[0], 'pieceSet'>) {
  const full: Parameters<typeof MoveList>[0] = { pieceSet: 'pencil', ...props };
  const host = document.createElement('div');
  document.body.appendChild(host);
  act(() => {
    createRoot(host).render(createElement(MoveList, full));
  });
  return host;
}

describe('MoveList', () => {
  it('khi chỉ để đọc thì trong cây không có nút nào', () => {
    const host = render({ moves, currentAt: null, variant: 'panel' });
    expect(host.querySelectorAll('button')).toHaveLength(0);
    expect(host.querySelectorAll('li')).toHaveLength(4);
  });

  it('hàng chỉ đọc cao 32px, hàng bấm được cao 44px (ADR-0018)', () => {
    const readOnly = render({ moves, currentAt: null, variant: 'panel' });
    expect(readOnly.querySelector('li > div')?.className).toContain('min-h-8');

    const clickable = render({ moves, currentAt: 2, variant: 'panel', onPick: () => {} });
    expect(clickable.querySelector('button')?.className).toContain('min-h-11');
  });

  it('bấm hàng thứ ba báo về NƯỚC thứ 3, không phải chỉ số 2', () => {
    const onPick = vi.fn();
    const host = render({ moves, currentAt: 4, variant: 'panel', onPick });
    act(() => {
      host
        .querySelectorAll('button')[2]
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(onPick).toHaveBeenCalledWith(3);
  });

  it('đúng MỘT hàng mang aria-current', () => {
    const host = render({ moves, currentAt: 2, variant: 'panel', onPick: () => {} });
    expect(host.querySelectorAll('[aria-current="true"]')).toHaveLength(1);
    expect(host.querySelectorAll('button')[1]?.getAttribute('aria-current')).toBe('true');
  });

  it('toạ độ âm dùng dấu trừ thật U+2212, không phải dấu gạch bàn phím', () => {
    const host = render({ moves, currentAt: null, variant: 'panel' });
    const text = host.textContent ?? '';
    expect(text).toContain('−12');
    expect(text).not.toContain('-12');
  });

  it('biến thể sheet không hiện tiêu đề, vì sheet đã có tiêu đề riêng', () => {
    const panel = render({ moves, currentAt: null, variant: 'panel' });
    const sheet = render({ moves, currentAt: null, variant: 'sheet' });
    expect(panel.textContent).toContain('Nước đi');
    expect(sheet.textContent).not.toContain('Nước đi');
  });

  it('ván trống không nổ', () => {
    const host = render({ moves: [], currentAt: null, variant: 'panel' });
    expect(host.querySelectorAll('li')).toHaveLength(0);
  });
});

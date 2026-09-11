import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it } from 'vitest';
import { CursorLive } from './index';
import type { Move, Point } from '@/game/core/types';

const moves: Move[] = [
  { at: { x: 0, y: 0 }, side: 'one' },
  { at: { x: -3, y: 2 }, side: 'two' },
];

function render(cursor: Point | null) {
  const host = document.createElement('div');
  document.body.appendChild(host);
  act(() => {
    createRoot(host).render(createElement(CursorLive, { cursor, moves }));
  });
  return host;
}

describe('CursorLive (NFR-A11Y-06)', () => {
  it('là một vùng aria-live riêng, KHÔNG dùng chung với dòng trạng thái', () => {
    // Dùng chung nghĩa là mỗi lần bấm mũi tên sẽ ghi đè lên "Máy đánh ở 3, −2" —
    // tức bàn phím làm mất đúng thông báo mà người dùng bàn phím cần nhất.
    const host = render({ x: 1, y: 1 });
    const live = host.querySelector('[aria-live="polite"]');
    expect(live).not.toBeNull();
    expect(live?.getAttribute('role')).toBe('status');
  });

  it('chưa có con trỏ thì vùng rỗng, nhưng vẫn tồn tại để đọc được về sau', () => {
    const host = render(null);
    expect(host.querySelector('[aria-live="polite"]')).not.toBeNull();
    expect(host.textContent).toBe('');
  });

  it('ô trống thì nói là ô trống', () => {
    expect(render({ x: 5, y: 5 }).textContent).toBe('Con trỏ ở 5, 5. Ô trống.');
  });

  it('ô có quân người chơi và ô có quân máy là hai câu KHÁC nhau', () => {
    const you = render({ x: 0, y: 0 }).textContent;
    const ai = render({ x: -3, y: 2 }).textContent;
    expect(you).toContain('quân của bạn');
    expect(ai).toContain('quân của máy');
    expect(you).not.toBe(ai);
  });

  it('toạ độ âm dùng dấu trừ thật U+2212, không phải dấu gạch bàn phím', () => {
    // Trình đọc màn hình đọc U+2212 là "trừ"; `-` thường bị đọc là "gạch ngang"
    // hoặc bị bỏ hẳn, và lúc đó "−3" với "3" nghe y như nhau.
    const text = render({ x: -3, y: 2 }).textContent ?? '';
    expect(text).toContain('−3');
    expect(text).not.toContain('-3');
  });
});

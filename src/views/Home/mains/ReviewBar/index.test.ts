import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it, vi } from 'vitest';
import { ReviewBar } from './index';

type Props = Parameters<typeof ReviewBar>[0];

function render(props: Partial<Props> = {}) {
  const onGoto = vi.fn();
  const onRecenter = vi.fn();
  const onExit = vi.fn();
  const host = document.createElement('div');
  document.body.appendChild(host);
  act(() => {
    createRoot(host).render(
      createElement(ReviewBar, {
        at: 5,
        total: 10,
        variant: 'panel',
        onGoto,
        onRecenter,
        onExit,
        ...props,
      }),
    );
  });
  const click = (label: string) => {
    act(() => {
      host
        .querySelector<HTMLButtonElement>(`[aria-label="${label}"]`)
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
  };
  return { host, onGoto, onRecenter, onExit, click };
}

const disabled = (host: HTMLElement, label: string) =>
  host.querySelector<HTMLButtonElement>(`[aria-label="${label}"]`)?.disabled;

describe('ReviewBar', () => {
  it('ở nước 0 thì hai nút lùi tắt, hai nút tiến còn bật', () => {
    const { host } = render({ at: 0 });
    expect(disabled(host, 'Về nước đầu')).toBe(true);
    expect(disabled(host, 'Nước trước')).toBe(true);
    expect(disabled(host, 'Nước sau')).toBe(false);
    expect(disabled(host, 'Tới nước cuối')).toBe(false);
  });

  it('ở nước cuối thì hai nút tiến tắt', () => {
    const { host } = render({ at: 10, total: 10 });
    expect(disabled(host, 'Nước sau')).toBe(true);
    expect(disabled(host, 'Tới nước cuối')).toBe(true);
    expect(disabled(host, 'Nước trước')).toBe(false);
  });

  it('bấm tiến một nước báo về at + 1', () => {
    const { onGoto, click } = render({ at: 5 });
    click('Nước sau');
    expect(onGoto).toHaveBeenCalledWith(6);
  });

  it('bấm lùi một nước báo về at − 1', () => {
    const { onGoto, click } = render({ at: 5 });
    click('Nước trước');
    expect(onGoto).toHaveBeenCalledWith(4);
  });

  it('hai nút nhảy biên đi thẳng tới 0 và tới total', () => {
    const { onGoto, click } = render({ at: 5, total: 10 });
    click('Về nước đầu');
    expect(onGoto).toHaveBeenCalledWith(0);
    click('Tới nước cuối');
    expect(onGoto).toHaveBeenCalledWith(10);
  });

  it('nút thoát gọi onExit', () => {
    const { host, onExit } = render();
    act(() => {
      const buttons = host.querySelectorAll('button');
      buttons[buttons.length - 1]?.dispatchEvent(
        new MouseEvent('click', { bubbles: true }),
      );
    });
    expect(onExit).toHaveBeenCalledTimes(1);
  });

  it('mọi nút đều có nhãn cho trình đọc màn hình (NFR-A11Y-02)', () => {
    const { host } = render();
    for (const button of Array.from(host.querySelectorAll('button'))) {
      const named =
        button.getAttribute('aria-label') !== null ||
        (button.textContent ?? '').trim().length > 0;
      expect(named).toBe(true);
    }
  });
});

describe('ReviewBar — nút Giữa', () => {
  /*
   * Chế độ xem lại ẩn `Controls`, nên nếu thanh này không có "Giữa" thì người chơi
   * bị đẩy thế trận ra ngoài khung nhìn (nợ đã ghi trong backlog) sẽ mắc kẹt với một
   * bàn trống, không có đường ra.
   */
  it('có nút Giữa, và nó gọi onRecenter', () => {
    const { host, onRecenter } = render();
    const recenter = Array.from(host.querySelectorAll('button')).find(
      (b) => (b.textContent ?? '').includes('Giữa'),
    );
    expect(recenter).toBeDefined();
    act(() => {
      recenter?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(onRecenter).toHaveBeenCalledTimes(1);
  });
});

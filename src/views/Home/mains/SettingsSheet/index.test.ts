import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it, vi } from 'vitest';
import { SettingsSheet } from './index';
import { DEFAULT_SETTINGS } from '@/game/settings/settingsStore';

function render(settings = DEFAULT_SETTINGS) {
  const onChange = vi.fn();
  const onClearAll = vi.fn();
  const onClose = vi.fn();
  const host = document.createElement('div');
  document.body.appendChild(host);
  act(() => {
    createRoot(host).render(
      createElement(SettingsSheet, { settings, onChange, onClearAll, onClose }),
    );
  });
  const click = (el: Element | null | undefined) => {
    act(() => {
      el?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
  };
  const byText = (t: string) =>
    Array.from(host.querySelectorAll('button')).find((b) =>
      (b.textContent ?? '').includes(t),
    );
  return { host, onChange, onClearAll, onClose, click, byText };
}

describe('SettingsSheet — nhãn và vùng bấm', () => {
  it('mỗi input có nhãn LIÊN KẾT bằng htmlFor/id (NFR-A11Y-04)', () => {
    const { host } = render();
    const inputs = Array.from(host.querySelectorAll('input'));
    expect(inputs.length).toBeGreaterThan(0);
    for (const input of inputs) {
      expect(input.id).not.toBe('');
      const label = host.querySelector(`label[for="${input.id}"]`);
      expect(label).not.toBeNull();
    }
  });

  /*
   * jsdom không có layout nên không đo được chiều cao thật; lớp là thứ thay thế duy
   * nhất. Nhưng nó phải đo NGƯỠNG, không đo một lớp cụ thể: ô chọn bộ quân cao 60px
   * và vẫn đạt NFR-A11Y-03. Bản trước chỉ khớp `min-h-11` nên nó đỏ với một nút CAO
   * HƠN yêu cầu — tức nó canh cách viết, không canh yêu cầu.
   */
  it('mọi nút cao ít nhất 44px theo lớp, và có tên đọc được', () => {
    const { host } = render();
    const MIN_PX = 44;
    for (const button of Array.from(host.querySelectorAll('button'))) {
      const arbitrary = /(?:min-)?h-\[(\d+)px\]/.exec(button.className);
      const tall =
        /min-h-11|(?:^|\s)h-11(?:\s|$)/.test(button.className) ||
        (arbitrary !== null && Number(arbitrary[1]) >= MIN_PX);
      expect(tall, button.className).toBe(true);
      const named =
        button.getAttribute('aria-label') !== null ||
        (button.textContent ?? '').trim().length > 0;
      expect(named).toBe(true);
    }
  });

  it('là một dialog có nhãn', () => {
    const { host } = render();
    const dialog = host.querySelector('[role="dialog"]');
    expect(dialog?.getAttribute('aria-label')).toBe('Cài đặt');
    expect(dialog?.getAttribute('aria-modal')).toBe('true');
  });
});

describe('SettingsSheet — đổi cài đặt', () => {
  it('bấm ô âm thanh gọi onChange với giá trị ĐẢO lại', () => {
    const { host, onChange } = render({ ...DEFAULT_SETTINGS, sound: true, defaultLevel: 'normal' });
    const input = host.querySelector<HTMLInputElement>('#setting-sound');
    expect(input?.checked).toBe(true);
    // React map `onChange` cua checkbox vao su kien click, khong vao 'input'.
    act(() => {
      input?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(onChange).toHaveBeenCalledWith({ ...DEFAULT_SETTINGS, sound: false, defaultLevel: 'normal' });
  });

  it('chọn mức khó gọi onChange với mức mới, giữ nguyên âm thanh', () => {
    const { byText, click, onChange } = render({ ...DEFAULT_SETTINGS, sound: false, defaultLevel: 'normal' });
    click(byText('Khó'));
    expect(onChange).toHaveBeenCalledWith({ ...DEFAULT_SETTINGS, sound: false, defaultLevel: 'hard' });
  });

  /*
   * Khẳng định theo TỪNG NHÓM, không theo cả sheet. Từ mốc 8 có bốn nhóm chọn một
   * (giao diện, bộ quân, mức khó, luật), nên "đúng một nút được nhấn trong cả màn"
   * đã thành một câu sai. Mỗi nhóm vẫn phải có đúng một.
   */
  it('mỗi nhóm chọn-một có ĐÚNG một nút mang aria-pressed', () => {
    const { host } = render({ ...DEFAULT_SETTINGS, sound: true, defaultLevel: 'hard' });
    const groups = Array.from(host.querySelectorAll('[role="group"]'));
    expect(groups.length).toBeGreaterThanOrEqual(4);
    for (const group of groups) {
      const pressed = Array.from(group.querySelectorAll('[aria-pressed="true"]'));
      expect(pressed, group.getAttribute('aria-label') ?? '').toHaveLength(1);
    }
  });

  it('mức đang chọn là mức được nhấn trong nhóm mức khó', () => {
    const { host } = render({ ...DEFAULT_SETTINGS, sound: true, defaultLevel: 'hard' });
    const group = host.querySelector('[role="group"][aria-label="Mức khó mặc định"]');
    expect(group?.querySelector('[aria-pressed="true"]')?.textContent).toContain('Khó');
  });
});

describe('SettingsSheet — xoá dữ liệu', () => {
  it('bấm xoá KHÔNG xoá ngay, mà hỏi xác nhận trước', () => {
    const { byText, click, onClearAll } = render();
    click(byText('Xoá toàn bộ dữ liệu'));
    expect(onClearAll).not.toHaveBeenCalled();
  });

  it('câu xác nhận nói rõ không có bản sao nào (NFR-DATA-03)', () => {
    const { host, byText, click } = render();
    click(byText('Xoá toàn bộ dữ liệu'));
    expect(host.textContent).toContain('không có bản sao nào');
  });

  it('xác nhận rồi mới gọi onClearAll', () => {
    const { byText, click, onClearAll } = render();
    click(byText('Xoá toàn bộ dữ liệu'));
    click(byText('Xoá hẳn'));
    expect(onClearAll).toHaveBeenCalledTimes(1);
  });

  it('bấm Thôi thì quay về, không xoá gì', () => {
    const { host, byText, click, onClearAll } = render();
    click(byText('Xoá toàn bộ dữ liệu'));
    click(byText('Thôi'));
    expect(onClearAll).not.toHaveBeenCalled();
    expect(host.textContent).toContain('Xoá toàn bộ dữ liệu');
  });
});

describe('SettingsSheet — dạy bàn phím', () => {
  it('có nói về Shift + mũi tên, vì đây là chỗ duy nhất dạy nó (ADR-0020)', () => {
    const { host } = render();
    expect(host.textContent).toContain('Shift');
    expect(host.textContent).toContain('Home');
  });
});

describe('SettingsSheet — đóng', () => {
  it('nút đóng gọi onClose', () => {
    const { host, click, onClose } = render();
    click(host.querySelector('[aria-label="Đóng"]'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

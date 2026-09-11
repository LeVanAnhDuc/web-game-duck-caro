import { describe, expect, it } from 'vitest';
import {
  applyTheme,
  DEFAULT_THEME,
  isTheme,
  THEME_ATTR,
  themeBootScript,
} from './theme';

describe('applyTheme (FR-19 · ADR-0026)', () => {
  it("'system' XOÁ thuộc tính, không đặt data-theme=\"system\"", () => {
    const root = document.createElement('html');
    root.setAttribute(THEME_ATTR, 'dark');
    applyTheme(root, 'system');
    // Tầng `@media` trong globals.css viết là `:not([data-theme='light'])`, nên nó chỉ
    // đúng khi KHÔNG có thuộc tính. Đặt `data-theme="system"` làm nó im lặng sai.
    expect(root.hasAttribute(THEME_ATTR)).toBe(false);
  });

  it("'light' và 'dark' đặt đúng giá trị", () => {
    const root = document.createElement('html');
    applyTheme(root, 'dark');
    expect(root.getAttribute(THEME_ATTR)).toBe('dark');
    applyTheme(root, 'light');
    expect(root.getAttribute(THEME_ATTR)).toBe('light');
  });

  it('mặc định là theo máy', () => {
    expect(DEFAULT_THEME).toBe('system');
  });

  it('giá trị lạ bị từ chối', () => {
    expect(isTheme('light')).toBe(true);
    expect(isTheme('system')).toBe(true);
    expect(isTheme('sepia')).toBe(false);
    expect(isTheme(undefined)).toBe(false);
  });
});

/**
 * Script chống nháy chạy trong `<head>`, ngoài bundler, nên không có test đơn vị nào
 * chạm được nó theo cách thường. Ở đây nó được `eval` với một `localStorage` giả —
 * đủ để canh cái thật sự quan trọng: **nó không bao giờ ném**.
 *
 * `NFR-PERF-10` là phép kiểm thật, trên bản build tĩnh.
 */
describe('themeBootScript — không bao giờ ném', () => {
  const KEY = 'gomoku:v2:settings';

  const runWith = (storage: unknown): string | null => {
    const root = document.createElement('html');
    const fn = new Function(
      'localStorage',
      'document',
      themeBootScript(KEY) + ';return null;',
    );
    fn(storage, { documentElement: root });
    return root.getAttribute(THEME_ATTR);
  };

  const backing = (raw: string | null) => ({ getItem: () => raw });

  it("đọc 'dark' từ cài đặt và đặt thuộc tính ngay", () => {
    expect(runWith(backing(JSON.stringify({ theme: 'dark' })))).toBe('dark');
  });

  it("đọc 'light' cũng đặt — lựa chọn tay phải thắng cả hai chiều", () => {
    expect(runWith(backing(JSON.stringify({ theme: 'light' })))).toBe('light');
  });

  it("'system' thì KHÔNG đặt gì", () => {
    expect(runWith(backing(JSON.stringify({ theme: 'system' })))).toBeNull();
  });

  it('chưa có cài đặt nào thì không đặt gì', () => {
    expect(runWith(backing(null))).toBeNull();
  });

  it('JSON hỏng thì im lặng, không ném', () => {
    expect(() => runWith(backing('{khong-phai-json'))).not.toThrow();
    expect(runWith(backing('{khong-phai-json'))).toBeNull();
  });

  it('giá trị theme lạ thì không đặt gì', () => {
    expect(runWith(backing(JSON.stringify({ theme: 'sepia' })))).toBeNull();
  });

  it('localStorage bị CHẶN (ném ngay khi đọc) vẫn không làm vỡ trang', () => {
    const blocked = {
      getItem: () => {
        throw new Error('site data bi chan');
      },
    };
    // Đây là ca thật: cửa sổ ẩn danh, hoặc người dùng chặn site data. Một ngoại lệ
    // thoát ra khỏi script trong `<head>` làm trắng cả trang.
    expect(() => runWith(blocked)).not.toThrow();
    expect(runWith(blocked)).toBeNull();
  });

  it('mang đúng khoá mà settingsStore ghi ra', () => {
    expect(themeBootScript(KEY)).toContain(JSON.stringify(KEY));
  });
});

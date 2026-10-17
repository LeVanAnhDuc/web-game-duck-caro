/**
 * Phần CHẠM DOM của giao diện sáng/tối — FR-19 · ADR-0026.
 *
 * Kiểu và hàm kiểm hình dạng nằm ở `game/appearance/types.ts`: `game/settings`
 * cũng cần chúng, và nó không được import `game/render` (bất biến 4).
 */
export type { Theme } from '@/game/appearance/types';
export {
  DEFAULT_THEME,
  isTheme,
  THEMES,
} from '@/game/appearance/types';

import type { Theme } from '@/game/appearance/types';

/**
 * Thuộc tính trên `<html>` mà `globals.css` đọc. Đặt trên `<html>` chứ không trên
 * `<body>`: script chống nháy chạy trong `<head>`, lúc đó `<body>` chưa tồn tại.
 */
export const THEME_ATTR = 'data-theme';

/**
 * Đặt (hoặc xoá) `data-theme`. `'system'` là **xoá** thuộc tính, không phải đặt
 * `data-theme="system"` — vì khối `@media (prefers-color-scheme: dark)` trong
 * `globals.css` được viết là `:root:not([data-theme='light'])`, tức nó hoạt động
 * đúng khi KHÔNG có thuộc tính nào.
 */
export function applyTheme(root: HTMLElement, theme: Theme): void {
  if (theme === 'system') root.removeAttribute(THEME_ATTR);
  else root.setAttribute(THEME_ATTR, theme);
}

/**
 * Script chạy trong `<head>` TRƯỚC lần vẽ đầu tiên (ADR-0026).
 *
 * Đây là chỗ DUY NHẤT trong dự án được chạm `localStorage` ngoài hai seam của bất
 * biến 5, và nó là ngoại lệ có tên: nó chạy trước cả React, nên không có seam nào để
 * đi qua. Ghi rõ ở đây để lần sau không ai coi đó là seam thứ ba.
 *
 * Chuỗi này được nhúng thẳng vào HTML, nên nó phải:
 * - **không bao giờ ném** — `localStorage` bị chặn (cửa sổ ẩn danh, chặn site data)
 *   là chuyện thường, và một ngoại lệ ở đây làm trắng cả trang;
 * - đọc đúng khoá và đúng hình dạng mà `settingsStore` ghi ra;
 * - im lặng về `'system'` khi có bất cứ gì không như mong đợi.
 */
export function themeBootScript(storageKey: string): string {
  return (
    '(function(){try{' +
    'var raw=localStorage.getItem(' +
    JSON.stringify(storageKey) +
    ');if(!raw)return;' +
    'var t=JSON.parse(raw).theme;' +
    "if(t==='light'||t==='dark')document.documentElement.setAttribute('" +
    THEME_ATTR +
    "',t);" +
    '}catch(e){}})()'
  );
}

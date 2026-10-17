'use client';

// libs
import { useEffect } from 'react';
// game
import { applyTheme } from '@/game/render/theme';
// types
import type { Theme } from '@/game/appearance/types';

/**
 * Áp lựa chọn giao diện lên `<html>` — FR-19 · ADR-0026.
 *
 * Script trong `<head>` chỉ lo LẦN TẢI ĐẦU: nó đọc `localStorage` trước lần vẽ đầu để
 * không có cú nháy màu. Nó không biết gì về những lần người chơi bấm sau đó, và
 * `settingsStore` thì chỉ LƯU chứ không chạm DOM.
 *
 * Thiếu ghost này thì bấm Sáng/Tối trong cài đặt lưu đúng, hiện đúng `aria-pressed`,
 * sống qua reload — và **không đổi gì trên màn hình cho tới lần tải lại kế tiếp**. Đó
 * là lỗi E2E `NFR-PERF-10` bắt được; không có nó thì tính năng trông như đã xong.
 *
 * **`loaded` là bắt buộc, không phải để cho chắc.** `useSettings` khởi đầu bằng
 * `DEFAULT_SETTINGS`, tức `theme: 'system'`, và chỉ đọc `localStorage` trong một effect
 * (ADR-0001: bản build tĩnh không có storage lúc build). Không có cái chặn này thì
 * chuỗi sự kiện là: script trong `<head>` đặt `data-theme="dark"` → React mount →
 * ghost này thấy `'system'` và **XOÁ** thuộc tính → trang vẽ một khung bằng bảng SÁNG →
 * cài đặt đọc xong → đặt lại `"dark"`. Tức đúng cú nháy mà ADR-0026 dựng script kia để
 * chặn, chỉ là nháy muộn hơn vài chục ms.
 *
 * Lỗi này đỏ khoảng một lần trong hai lần chạy E2E, nên nó là loại lỗi mà một lần chạy
 * xanh KHÔNG chứng minh được là không có. Cùng lối `ApplyDefaultLevel` đã dùng `loaded`.
 */
export function ApplyTheme({ theme, loaded }: { theme: Theme; loaded: boolean }) {
  useEffect(() => {
    if (!loaded) return;
    applyTheme(document.documentElement, theme);
  }, [theme, loaded]);

  return null;
}

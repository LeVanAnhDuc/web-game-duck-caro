'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Hành vi của menu tài khoản, không có style: mở khi bấm, đóng khi Esc / bấm ra ngoài /
 * chọn một mục, và trả focus về nút mở trừ khi người dùng chủ động bấm sang chỗ khác.
 */
export function useAccountMenu() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const close = useCallback((refocus: boolean) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: Event) => {
      const target = event.target as Node;
      if (!menuRef.current?.contains(target) && !triggerRef.current?.contains(target)) {
        close(false);
      }
    };
    const items = () =>
      Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
    // Pha capture trên window + stopPropagation: phím của menu không được lọt tới
    // handler phím toàn cục của game. Chỉ đăng ký khi menu đang mở (effect này).
    const onKey = (event: KeyboardEvent) => {
      const list = items();
      const index = list.indexOf(document.activeElement as HTMLElement);
      let next: number | null = null;
      switch (event.key) {
        case 'Escape':
          close(true);
          break;
        case 'Tab':
          close(false); // Tab đi tiếp, không kéo focus lại
          break;
        case 'ArrowDown':
          next = list.length ? (index + 1) % list.length : null;
          break;
        case 'ArrowUp':
          next = list.length ? (index - 1 + list.length) % list.length : null;
          break;
        case 'Home':
          next = list.length ? 0 : null;
          break;
        case 'End':
          next = list.length ? list.length - 1 : null;
          break;
        default:
          return;
      }
      event.stopPropagation();
      if (event.key !== 'Escape' && event.key !== 'Tab') event.preventDefault();
      if (next !== null) list[next]?.focus();
    };
    const onFocusOut = (event: FocusEvent) => {
      const to = event.relatedTarget as Node | null;
      // Safari không focus nút khi bấm, nên relatedTarget có thể null ngay khi bấm nút mở:
      // chỉ đóng khi focus đã sang một phần tử CÓ THẬT nằm ngoài. Bấm ra ngoài do onPointer lo.
      if (!to) return;
      if (!menuRef.current?.contains(to) && !triggerRef.current?.contains(to)) close(false);
    };
    const menu = menuRef.current;
    window.addEventListener('keydown', onKey, true);
    document.addEventListener('pointerdown', onPointer);
    menu?.addEventListener('focusout', onFocusOut);
    menu?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
    return () => {
      window.removeEventListener('keydown', onKey, true);
      document.removeEventListener('pointerdown', onPointer);
      menu?.removeEventListener('focusout', onFocusOut);
    };
  }, [open, close]);

  return { open, toggle: () => setOpen((value) => !value), close, triggerRef, menuRef };
}

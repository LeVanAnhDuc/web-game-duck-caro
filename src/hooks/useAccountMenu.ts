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
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close(true);
    };
    const onPointer = (event: Event) => {
      const target = event.target as Node;
      if (!menuRef.current?.contains(target) && !triggerRef.current?.contains(target)) {
        close(false);
      }
    };
    const items = () =>
      Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []);
    const onMenuKey = (event: KeyboardEvent) => {
      const list = items();
      if (list.length === 0) return;
      const index = list.indexOf(document.activeElement as HTMLElement);
      let next: number | null = null;
      if (event.key === 'ArrowDown') next = (index + 1) % list.length;
      else if (event.key === 'ArrowUp') next = (index - 1 + list.length) % list.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = list.length - 1;
      else if (event.key === 'Tab') close(false); // Tab đi tiếp, không kéo focus lại
      if (next !== null) {
        event.preventDefault();
        list[next]?.focus();
      }
    };
    const onFocusOut = (event: FocusEvent) => {
      const to = event.relatedTarget as Node | null;
      // Safari không focus nút khi bấm, nên relatedTarget có thể null ngay khi bấm nút mở:
      // chỉ đóng khi focus đã sang một phần tử CÓ THẬT nằm ngoài. Bấm ra ngoài do onPointer lo.
      if (!to) return;
      if (!menuRef.current?.contains(to) && !triggerRef.current?.contains(to)) close(false);
    };
    const menu = menuRef.current;
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    menu?.addEventListener('keydown', onMenuKey);
    menu?.addEventListener('focusout', onFocusOut);
    menu?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
      menu?.removeEventListener('keydown', onMenuKey);
      menu?.removeEventListener('focusout', onFocusOut);
    };
  }, [open, close]);

  return { open, toggle: () => setOpen((value) => !value), close, triggerRef, menuRef };
}

import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const auth = vi.hoisted(() => ({ value: {} as Record<string, unknown> }));
vi.mock('@/hooks/useDuckerAuth', () => ({ useDuckerAuth: () => auth.value }));

import { AccountButton } from './index';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const base = {
  enabled: true,
  profileUrl: 'http://localhost:3000/profile',
  signIn: vi.fn(),
  signOut: vi.fn(),
};

let container: HTMLDivElement;
let root: Root;

const mount = () => act(() => root.render(<AccountButton />));
const byName = (selector: string, name: string) =>
  Array.from(container.querySelectorAll<HTMLElement>(selector)).find(
    (el) => el.textContent === name || el.getAttribute('aria-label') === name,
  );

describe('AccountButton', () => {
  beforeEach(() => {
    base.signIn.mockClear();
    base.signOut.mockClear();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });
  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it('renders nothing when the feature is disabled', () => {
    auth.value = { ...base, enabled: false, status: 'idle', profile: null };
    mount();
    expect(container.innerHTML).toBe('');
  });

  it('renders nothing while idle (server snapshot) so hydration matches', () => {
    auth.value = { ...base, status: 'idle', profile: null };
    mount();
    expect(container.innerHTML).toBe('');
  });

  it('shows the sign-in button when signed out and starts login on click', () => {
    auth.value = { ...base, status: 'signed-out', profile: null };
    mount();
    const button = byName('button', 'Đăng nhập')!;
    act(() => button.click());
    expect(base.signIn).toHaveBeenCalledOnce();
  });

  it('disables the button while signing in', () => {
    auth.value = { ...base, status: 'loading', profile: null };
    mount();
    const button = byName('button', 'Đang đăng nhập…') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('opens the account menu with profile link and sign out; Esc closes and refocuses', () => {
    auth.value = {
      ...base,
      status: 'signed-in',
      profile: { sub: 'u1', name: 'Lê Văn Anh Đức', email: 'duc@ducker.id' },
    };
    mount();
    const trigger = byName('button', 'Tài khoản Ducker ID')!;
    act(() => trigger.click());
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(container.textContent).toContain('Lê Văn Anh Đức');
    expect(container.textContent).toContain('duc@ducker.id');
    const link = byName('a', 'Mở hồ sơ Ducker ID')!;
    expect(link.getAttribute('href')).toBe('http://localhost:3000/profile');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(trigger);
    act(() => trigger.click());
    act(() => byName('button', 'Đăng xuất')!.click());
    expect(base.signOut).toHaveBeenCalledOnce();
  });

  it('after sign out, focus lands on the sign-in button, not on body', () => {
    const profile = { sub: 'u1', name: 'An' };
    auth.value = { ...base, status: 'signed-in', profile };
    base.signOut.mockImplementation(() => {
      auth.value = { ...base, status: 'signed-out', profile: null };
    });
    mount();
    act(() => byName('button', 'Tài khoản Ducker ID')!.click());
    act(() => {
      byName('button', 'Đăng xuất')!.click();
    });
    mount();
    const signIn = byName('button', 'Đăng nhập')!;
    expect(document.activeElement).toBe(signIn);
    base.signOut.mockReset();
  });

  it('arrow keys, Home and End move focus between items, wrapping', () => {
    auth.value = { ...base, status: 'signed-in', profile: { sub: 'u1', name: 'An' } };
    mount();
    act(() => byName('button', 'Tài khoản Ducker ID')!.click());
    const link = byName('a', 'Mở hồ sơ Ducker ID')!;
    const out = byName('button', 'Đăng xuất')!;
    const press = (key: string) =>
      act(() => {
        (document.activeElement as HTMLElement).dispatchEvent(
          new KeyboardEvent('keydown', { key, bubbles: true }),
        );
      });
    expect(document.activeElement).toBe(link);
    press('ArrowDown');
    expect(document.activeElement).toBe(out);
    press('ArrowDown');
    expect(document.activeElement).toBe(link);
    press('ArrowUp');
    expect(document.activeElement).toBe(out);
    press('Home');
    expect(document.activeElement).toBe(link);
    press('End');
    expect(document.activeElement).toBe(out);
  });

  it('Tab closes the menu without stealing focus back', () => {
    auth.value = { ...base, status: 'signed-in', profile: { sub: 'u1', name: 'An' } };
    mount();
    const trigger = byName('button', 'Tài khoản Ducker ID')!;
    act(() => trigger.click());
    act(() => {
      (document.activeElement as HTMLElement).dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }),
      );
    });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).not.toBe(trigger);
  });

  it('shows the email as the main line without a name, and no email line when missing', () => {
    auth.value = { ...base, status: 'signed-in', profile: { sub: 'u1', email: 'a@x.vn' } };
    mount();
    act(() => byName('button', 'Tài khoản Ducker ID')!.click());
    expect(container.querySelectorAll('[role="menu"] p')).toHaveLength(1);
    expect(container.querySelector('[role="menu"] p')!.textContent).toBe('a@x.vn');
    auth.value = { ...base, status: 'signed-in', profile: { sub: 'u1', name: 'An' } };
    mount();
    expect(container.querySelectorAll('[role="menu"] p')).toHaveLength(1);
  });

  it('closes on an outside pointer press', () => {
    auth.value = { ...base, status: 'signed-in', profile: { sub: 'u1', name: 'An' } };
    mount();
    const trigger = byName('button', 'Tài khoản Ducker ID')!;
    act(() => trigger.click());
    act(() => {
      document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('shows the initial when there is no picture and the picture when there is', () => {
    auth.value = { ...base, status: 'signed-in', profile: { sub: 'u1', name: 'đức' } };
    mount();
    expect(container.querySelector('button')!.textContent).toBe('Đ');
    auth.value = {
      ...base,
      status: 'signed-in',
      profile: { sub: 'u1', name: 'đức', picture: 'http://localhost:3000/a.png' },
    };
    mount();
    expect(container.querySelector('img')!.getAttribute('src')).toBe('http://localhost:3000/a.png');
  });
});

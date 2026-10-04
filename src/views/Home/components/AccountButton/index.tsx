'use client';

// libs
import { useEffect, useRef } from 'react';
import { LogIn, LogOut, UserRound } from 'lucide-react';
// hooks
import { useAccountMenu, useDuckerAuth } from '@/hooks';
// others
import { initialOf } from '@/lib/ducker/initials';
import { strings } from '@/lib/strings';

/** Dáng `.btn-secondary` của MASTER.md §Component: nền nổi, viền, 44px, bo 6px. */
const SECONDARY =
  'inline-flex h-11 min-w-11 flex-none cursor-pointer items-center justify-center gap-1.5 rounded-md border border-edge bg-raised px-3 text-sm text-ink hover:bg-paper disabled:cursor-not-allowed disabled:opacity-45';

const MENU_ITEM =
  'flex min-h-11 w-full cursor-pointer items-center gap-2 rounded-md px-3 text-left text-sm text-ink hover:bg-paper';

/**
 * Nút đăng nhập Ducker ID (tuỳ chọn, bật bằng cờ — ADR-0029). Chỉ định danh: tên và
 * email, không đồng bộ ván. Cờ tắt hoặc chưa khởi động xong (`idle`) thì không vẽ gì,
 * nên HTML tĩnh và lần render đầu ở client luôn khớp nhau.
 */
export function AccountButton() {
  const auth = useDuckerAuth();
  const menu = useAccountMenu();
  const signInRef = useRef<HTMLButtonElement>(null);
  const refocusSignIn = useRef(false);

  // Menu đã biến mất cùng nút mở, nên focus sẽ rơi về <body> nếu không đặt lại.
  useEffect(() => {
    if (refocusSignIn.current && auth.status === 'signed-out') {
      refocusSignIn.current = false;
      signInRef.current?.focus();
    }
  }, [auth.status]);

  if (!auth.enabled || auth.status === 'idle') return null;

  if (auth.status !== 'signed-in' || !auth.profile) {
    const loading = auth.status === 'loading';
    return (
      <button
        ref={signInRef}
        type="button"
        onClick={auth.signIn}
        disabled={loading}
        aria-busy={loading}
        className={SECONDARY}
      >
        <LogIn size={16} aria-hidden="true" className="max-[420px]:hidden" />
        <span>{loading ? strings.accountSigningIn : strings.accountSignIn}</span>
      </button>
    );
  }

  const { profile } = auth;
  return (
    <div className="relative">
      <button
        ref={menu.triggerRef}
        type="button"
        onClick={menu.toggle}
        aria-haspopup="menu"
        aria-expanded={menu.open}
        aria-label={strings.accountMenuLabel}
        className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-md hover:bg-paper"
      >
        {profile.picture ? (
          // Ảnh từ Ducker ID, kích thước cố định — `next/image` không tối ưu được trên static export.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.picture}
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 rounded-full border border-edge object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-strong text-sm font-semibold text-paper"
          >
            {initialOf(profile)}
          </span>
        )}
      </button>
      {menu.open && (
        <div
          ref={menu.menuRef}
          role="menu"
          className="fixed inset-x-0 bottom-0 z-30 rounded-t-[10px] border-t border-edge bg-raised px-4 py-6 shadow-sheet md:absolute md:inset-x-auto md:bottom-auto md:right-0 md:top-full md:mt-1 md:w-72 md:rounded-[10px] md:border md:p-3 md:shadow-panel"
        >
          <div className="mb-2 flex items-center gap-3 px-3">
            <UserRound size={20} aria-hidden="true" className="flex-none text-ink-muted" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink-strong">
                {profile.name || profile.email}
              </p>
              {profile.name && profile.email && (
                <p className="truncate text-xs text-ink-muted">{profile.email}</p>
              )}
            </div>
          </div>
          <a
            role="menuitem"
            href={auth.profileUrl ?? undefined}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => menu.close(false)}
            className={MENU_ITEM}
          >
            {strings.accountOpenProfile}
          </a>
          <button
            role="menuitem"
            type="button"
            onClick={() => {
              menu.close(false);
              refocusSignIn.current = true;
              auth.signOut();
            }}
            className={MENU_ITEM}
          >
            <LogOut size={16} aria-hidden="true" />
            {strings.accountSignOut}
          </button>
        </div>
      )}
    </div>
  );
}

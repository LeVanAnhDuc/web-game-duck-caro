// Dựng HAI bản tĩnh cho E2E: `out/` (cờ tắt — bản deploy thật) và `out-auth/` (cờ bật,
// issuer giả `http://ducker.test` không bao giờ phân giải được, mọi request tới nó bị
// `page.route` chặn). Cờ và các biến Ducker được truyền cho đúng tiến trình build này,
// không đọc từ môi trường của người chạy — ADR-0029.
import { spawnSync } from 'node:child_process';
import { renameSync, rmSync } from 'node:fs';

const AUTH_ISSUER = 'http://ducker.test';

function build(extra) {
  rmSync('.next', { recursive: true, force: true });
  const result = spawnSync('pnpm', ['exec', 'next', 'build'], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, ...extra },
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

rmSync('out-auth', { recursive: true, force: true });
build({
  NEXT_PUBLIC_FEATURE_DUCKER_SIGN_IN: 'true',
  NEXT_PUBLIC_DUCKER_ISSUER: AUTH_ISSUER,
  NEXT_PUBLIC_DUCKER_CLIENT_ID: 'e2e-client',
  NEXT_PUBLIC_DUCKER_SCOPE: 'openid profile email',
  NEXT_PUBLIC_DUCKER_PROFILE_PATH: '/profile',
});
renameSync('out', 'out-auth');
build({ NEXT_PUBLIC_FEATURE_DUCKER_SIGN_IN: 'false' });

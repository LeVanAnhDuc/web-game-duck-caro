# DEPLOY — Quyết định

Đi cặp với `docs/requirements/deploy.md`.

## Nguồn

Đọc ngày 2026-10-17 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/decisions/0001-nextjs-static-export-with-canvas-2d.md`, `0010-automated-releases-from-conventional-commits.md`
  và `CLAUDE.md` §Deploy (`NEXT_PUBLIC_BASE_PATH=/<repo>` chỉ đặt ở workflow deploy), `0011-…`, `0012-…` (Pages bật một
  lần), `0022-e2e-runs-against-the-static-build.md`, `README.md` (link chơi `https://levananhduc.github.io/web-game-duck-caro/`).
- **Code:** `client/next.config.ts` (`output: 'export'`, `basePath` từ `NEXT_PUBLIC_BASE_PATH`), `client/src/app/layout.tsx`
  (`title`, `lang="vi"`), `.github/workflows/deploy.yml`.
- **Test đã gom:** không có — bộ cũ chỉ chạy tại chỗ ở gốc `/`.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Hai case chạy nguyên văn trên dev (gốc `/`) và prd (`ENV=prd`, GitHub Pages dưới `/web-game-duck-caro/`): base path
  đọc từ `urls.webUrl` của môi trường, page object đi tới `./`. Đây cũng là bằng chứng lối đi `./` của mọi page object.
- **Q2** "Kể cả khi chơi": sau khi tải, bắt đầu ván và đánh một nước — Worker và chunk của nó chỉ tải lúc đó, và một chunk
  sai base path chỉ lộ ra ở bước này.

## Tài khoản test

Không có.

## Ngoài phạm vi

- Bật Pages, quyền token (ADR-0012): thao tác một lần, không kiểm ở e2e.
- First Load JS (NFR-PERF-08) và tải trên 4G (NFR-PERF-09): đo bằng `next build` và `scripts/measure-load.mjs`, không ở e2e.

## Tech debt liên quan

_(không có)_

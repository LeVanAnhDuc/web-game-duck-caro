# PRIVACY — Quyết định

Đi cặp với `docs/requirements/privacy.md`.

## Nguồn

Đọc ngày 2026-10-17 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/nfr.md` (NFR-SEC-07 "sau khi tải xong, không request nào ra ngoài origin", bảng PII
  của NFR-DATA-01), `docs/01-product/overview.md` (Non-Goals: không server, không tài khoản game, chi phí hạ tầng 0đ),
  `README.md` §"No game accounts, no server, nothing leaves the browser" và §"Sound, synthesised on the spot" ("nothing
  may be fetched after the first load").
- **Code:** `client/src/app/layout.tsx` (font `next/font` tự phục vụ), `client/src/game/ai/workerEngine.ts` (Worker cùng
  origin), `client/src/game/storage/keys.ts`.
- **Test đã gom (gợi ý):** `client/e2e/review-and-network.spec.ts` "sau khi tải xong, không request nào RA NGOÀI origin"
  → TC-PRIVACY-001.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** "Ngoài origin" so theo `origin` của trang đang test (dev `127.0.0.1:3300`, prd `levananhduc.github.io`), không ghim
  host cứng — cùng một case chạy được cả hai môi trường.
- **Q2** "Mất mạng" = `context.setOffline(true)` sau khi trang đạt `networkidle` (đã tải đủ cả chunk của Worker). Cả ván
  sau đó không được cần mạng.
- **Q3** Lỗi console: chỉ `console.error` và `pageerror`. Cảnh báo (`warning`) không tính.

## Tài khoản test

Không có.

## Ngoài phạm vi

- Secret trong repo / bundle (NFR-SEC-04): kiểm bằng grep + review, không phải e2e.
- Dependency có lỗ hổng (NFR-SEC-05): job `dependencies` của CI.
- Bản bật cờ Ducker ID (có request tới issuer — do người chơi chủ động): module `ducker-id`.

## Tech debt liên quan

_(không có)_

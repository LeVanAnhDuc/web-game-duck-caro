# DEPLOY — Test cases

Requirement: `docs/requirements/deploy.md` · quyết định: `docs/decisions/deploy.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề.
Cả hai case chạy được trên dev và prd (`ENV=prd`).

### TC-DEPLOY-001 — bản xuất tĩnh mở với tiêu đề, ngôn ngữ đúng và không tài nguyên nào lỗi

- **Requirement:** REQ-DEPLOY-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** ghi mọi response và request thất bại → mở `./` → bắt đầu ván Dễ → đánh 0, 0 → máy trả lời
- **Mong đợi:** tiêu đề "Duck Caro", `lang="vi"`; không response ≥ 400, không request thất bại
- **Automated:** `tests/e2e/deploy/static-export.e2e.ts`

### TC-DEPLOY-002 — mọi request của trang nằm dưới base path của site

- **Requirement:** REQ-DEPLOY-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 6
- **Bước:** ghi mọi request → mở `./` → bắt đầu ván Dễ → đánh 0, 0 → máy trả lời
- **Mong đợi:** mọi URL bắt đầu bằng URL gốc của môi trường (dev `http://127.0.0.1:3300/`, prd `…/web-game-duck-caro/`)
- **Automated:** `tests/e2e/deploy/static-export.e2e.ts`

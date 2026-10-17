# Test đã gom về lúc scaffold

Bộ e2e Playwright cũ của app (`client/e2e/`, chạy bằng `client/playwright.config.ts` → `pnpm e2e`) được `git mv`
về đây khi dựng `automation-testing/`. Config cũ gộp vào `playwright.config.ts` (webServer build hai bản xuất tĩnh
bằng `../client/scripts/build-e2e.mjs`, phục vụ `out/` ở :3300 và `out-auth/` — cờ Ducker ID bật, issuer giả — ở :3301;
project `app` = Desktop Chrome 1280×900 như config cũ, `app-auth` = bản bật cờ).

| Từ | Về | Trạng thái |
|---|---|---|
| `client/e2e/play.spec.ts` | `src/tests/e2e/board/play.e2e.ts` | chưa chuẩn hóa |
| `client/e2e/keyboard.spec.ts` | `src/tests/e2e/accessibility/keyboard.e2e.ts` | chưa chuẩn hóa |
| `client/e2e/persistence.spec.ts` | `src/tests/e2e/persistence/resume.e2e.ts` | chưa chuẩn hóa |
| `client/e2e/hotseat-and-theme.spec.ts` | `src/tests/e2e/hotseat/hotseat.e2e.ts` | chưa chuẩn hóa |
| `client/e2e/review-and-network.spec.ts` | `src/tests/e2e/history-review/review.e2e.ts` | chưa chuẩn hóa |
| `client/e2e/ducker-id-flag-off.spec.ts` | `src/tests/e2e/ducker-id/flag-off.e2e.ts` | chưa chuẩn hóa |
| `client/e2e/ducker-id-sign-in.spec.ts` | `src/tests/e2e/ducker-id/sign-in.e2e.ts` | chưa chuẩn hóa |
| `client/e2e/helpers.ts` | `src/tests/e2e/helpers.ts` (tạm, chờ tách vào `pages/`) | chưa chuẩn hóa |
| `client/e2e/measure-load.mjs` | `scripts/measure-load.mjs` (đo NFR-PERF-09, chạy tay) | gộp |
| `client/e2e/build-all.mjs`, `client/e2e/serve-out.mjs` | ở lại app: `client/scripts/build-e2e.mjs`, `client/scripts/serve-out.mjs` | gộp |
| `client/playwright.config.ts` (2 project, 2 webServer) | `playwright.config.ts` | gộp |

Unit + component test (vitest, `client/src/**/*.test.ts(x)`) ở lại `client/`: chúng thuộc về code.

## Còn trỏ về nơi cũ

- `CLAUDE.md` (gốc) — mục Commands còn `pnpm e2e`, mục Workflow gates còn job `e2e` cũ. File này đang có thay đổi chưa
  commit ở bản checkout chính nên PR dời test **không** sửa nó; cần sửa tay: lệnh chạy trong `client/`, e2e ở
  `automation-testing/`, và thêm dòng công tắc `Regression tests: automation-testing/ (/write-tests)`.
- `.claude/CLAUDE.md` — sơ đồ còn vẽ `.env.example` ở gốc (giờ là `client/.env.example`); cùng lý do, chưa sửa.
- `docs/specs/*/design.md`, `docs/specs/*/plan.md`, `docs/decisions/00*.md` (ADR-0022…) — tài liệu lịch sử (đã ship), giữ nguyên văn.
- `docs/ux-reviews/` — nhật ký phiên cũ.

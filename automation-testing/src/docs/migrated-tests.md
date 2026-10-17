# Test đã gom về lúc scaffold

Bộ e2e Playwright cũ của app (`client/e2e/`, chạy bằng `client/playwright.config.ts` → `pnpm e2e`) được `git mv`
về đây khi dựng `automation-testing/`. Config cũ gộp vào `playwright.config.ts` (webServer build hai bản xuất tĩnh
bằng `../client/scripts/build-e2e.mjs`, phục vụ `out/` ở :3300 và `out-auth/` — cờ Ducker ID bật, issuer giả — ở :3301;
project `app` = Desktop Chrome 1280×900 như config cũ, `app-auth` = bản bật cờ, thêm `app-touch` = Pixel 5).

| Từ | Về | Trạng thái |
|---|---|---|
| `client/e2e/play.spec.ts` | `src/tests/e2e/board/placement.e2e.ts` (git mv); các case tách theo module: máy trả lời, máy đi trước → `opponent/replies.e2e.ts`; ô đã có quân → `board/placement.e2e.ts`; hoàn nước → `undo-hint/undo.e2e.ts`; gợi ý → `undo-hint/hint.e2e.ts` | đã chuẩn hóa |
| `client/e2e/keyboard.spec.ts` | `src/tests/e2e/accessibility/keyboard.e2e.ts` (git mv) | đã chuẩn hóa |
| `client/e2e/persistence.spec.ts` | `src/tests/e2e/persistence/resume.e2e.ts` (git mv) + `persistence/broken-storage.e2e.ts`; hai case cài đặt / xoá dữ liệu → `settings/defaults.e2e.ts`, `settings/clear-data.e2e.ts` | đã chuẩn hóa |
| `client/e2e/hotseat-and-theme.spec.ts` | tách: hot-seat → `hotseat/turns.e2e.ts`, `hotseat/end.e2e.ts`; luật thắng → `win-rule/blocked-ends.e2e.ts`, `win-rule/rule-choice.e2e.ts`; theme trước lần vẽ đầu → `theme/first-paint.e2e.ts`; bộ quân → `piece-set/piece-set.e2e.ts` | đã chuẩn hóa |
| `client/e2e/review-and-network.spec.ts` | `src/tests/e2e/history-review/review.e2e.ts` (git mv); request ra ngoài → `privacy/no-leaks.e2e.ts`; thống kê → `stats/results.e2e.ts` | đã chuẩn hóa |
| `client/e2e/ducker-id-flag-off.spec.ts` | `src/tests/e2e/ducker-id/flag-off.e2e.ts` | đã chuẩn hóa |
| `client/e2e/ducker-id-sign-in.spec.ts` | `src/tests/e2e/ducker-id/sign-in.e2e.ts` + `sign-in-failures.e2e.ts` + `header.e2e.ts`; issuer giả → `src/fixtures/issuer.fixture.ts` | đã chuẩn hóa |
| `client/e2e/helpers.ts` | `src/pages/game.page.ts` (toạ độ ô, đánh quân, bắt đầu ván, nút cột phải); file cũ xoá | đã chuẩn hóa |
| `client/e2e/measure-load.mjs` | `scripts/measure-load.mjs` (đo NFR-PERF-09, chạy tay) | gộp |
| `client/e2e/build-all.mjs`, `client/e2e/serve-out.mjs` | ở lại app: `client/scripts/build-e2e.mjs`, `client/scripts/serve-out.mjs` | gộp |
| `client/playwright.config.ts` (2 project, 2 webServer) | `playwright.config.ts` | gộp |

Case cũ bị bỏ hoặc đổi khi chuẩn hóa:

- "hot-seat: hai người đánh luân phiên, engine KHÔNG đánh nước nào" chờ 2.5s rồi đếm nước → TC-HOTSEAT-002 đếm thẳng số
  thông điệp gửi Worker (= 0), không chờ mù.
- "giao diện tối được đặt TRƯỚC lần vẽ đầu" đọc `data-theme` sau khi tải xong → TC-THEME-004 đọc ở khung hình đầu tiên.
- Kiểm `font-weight`, toạ độ, chữ đều chuyển vào page object + `src/data/copy.ts`; không case nào khác bị bỏ.

Unit + component test (vitest, `client/src/**/*.test.ts(x)`) ở lại `client/`: chúng thuộc về code.

## Còn trỏ về nơi cũ

- `CLAUDE.md` (gốc) — mục Commands còn `pnpm e2e` và lệnh chạy ở gốc, mục Workflow gates còn job `e2e` cũ. File này đang có
  thay đổi chưa commit ở bản checkout chính nên PR dời test **không** sửa nó; cần sửa tay: lệnh chạy trong `client/`, e2e ở
  `automation-testing/`, và thêm dòng công tắc `Regression tests: automation-testing/ (/write-tests)`.
- `.claude/CLAUDE.md` — sơ đồ còn vẽ `.env.example` ở gốc (giờ là `client/.env.example`); cùng lý do, chưa sửa.
- `docs/specs/*/design.md`, `docs/specs/*/plan.md`, `docs/decisions/00*.md` (ADR-0022…) — tài liệu lịch sử (đã ship), giữ nguyên văn.
- `docs/ux-reviews/` — nhật ký phiên cũ.

# PERSISTENCE — Quyết định

Đi cặp với `docs/requirements/persistence.md`.

## Nguồn

Đọc ngày 2026-10-17 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-11), `docs/01-product/journeys.md` (US-02 và "Điều gì có thể sai":
  chặn lưu trữ, dữ liệu cũ / hỏng, hai tab, rời đi lúc máy nghĩ, lưu trữ đầy), `docs/02-requirements/nfr.md` (NFR-REL-04),
  `docs/decisions/0006-async-repository-seam-without-identity-interface.md`, `docs/03-design/invariants.md` (#1, #5),
  `README.md` §"It remembers where you were".
- **Code:** `client/src/game/storage/localGameRepository.ts` (`parseSavedGame` bỏ dữ liệu sai hình dạng),
  `client/src/game/storage/safeStorage.ts`, `client/src/game/storage/keys.ts` (`gomoku:v2:local:currentGame`),
  `client/src/hooks/usePersistence.ts`, `client/src/views/Home/ghosts/ResumeSavedGame`, `SaveGame`,
  `client/src/views/Home/index.tsx` (`playAgain` → `clearGame`).
- **Test đã gom (gợi ý):** `client/e2e/persistence.spec.ts` "ván dở sống qua một lần TẢI LẠI TRANG thật" →
  TC-PERSISTENCE-001, "ván kết thúc thì không còn gì để tiếp tục sau reload" → TC-PERSISTENCE-003, "localStorage bị chặn
  thì app vẫn chơi được" → TC-PERSISTENCE-005. Hai case cài đặt / xoá dữ liệu của file đó chuyển sang `settings`.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** "Im lặng, không vỡ" đo bằng gì? → Không có sự kiện `pageerror` nào trong suốt ca, không có chữ "lỗi" trong dòng
  thông báo, và màn bắt đầu / ván vẫn dùng được.
- **Q2** "Bộ nhớ đầy" giả bằng `Storage.prototype.setItem` ném `QuotaExceededError` (initScript) — đọc vẫn được, ghi thì
  không, đúng như trình duyệt khi hết quota.
- **Q3** Dữ liệu "phiên bản cũ": một ván ghi theo định dạng v1 (`side: "human"`) đặt dưới khoá v2 — app phải coi là sai hình
  dạng và bỏ. Khoá v1 thật (`gomoku:v1:…`) app không bao giờ đọc nên không cần case riêng.
- **Q4** "Hai tab cùng ghi" (US-02): app không có cơ chế phối hợp, tab ghi sau thắng — đó là hành vi đã biết, không phải
  requirement có kỳ vọng khác → ngoài phạm vi.
- **Q5** Có chuỗi `resumed` ("Đã tiếp tục ván đang dở") trong `strings.ts` nhưng không chỗ nào hiển thị nó; journeys không
  hứa thông báo nào khi tiếp tục → không kiểm.

## Tài khoản test

Không có.

## Ngoài phạm vi

- Hai tab cùng ghi một ván (Q4).
- Cài đặt sống qua tải lại và xoá toàn bộ dữ liệu: module `settings`.
- Thống kê sống qua tải lại: module `stats`.

## Tech debt liên quan

- `docs/04-state/backlog.md` §Nợ kỹ thuật: dữ liệu v1 bị bỏ chứ không migrate (ADR-0006, design v2 §6).

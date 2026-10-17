# OPPONENT — Quyết định

Đi cặp với `docs/requirements/opponent.md`.

## Nguồn

Đọc ngày 2026-10-17 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-04/05/06), `docs/01-product/journeys.md` (US-01 "Máy nghĩ quá lâu,
  hoặc luồng tính toán chết hẳn", "Người chơi đánh nước tiếp theo trước khi máy kịp trả lời"; US-02 "nếu lúc rời đi đang là
  lượt của máy, máy nghĩ và đánh ngay khi vào"), `docs/02-requirements/nfr.md` (NFR-PERF-06, NFR-REL-01, NFR-REL-03),
  `docs/decisions/0004-…`, `0005-…`, `docs/specs/real-ai-engine/design.md`, `README.md` §"An opponent that actually plays".
- **Code:** `client/src/hooks/useGame.ts` (`askEngine`, `ENGINE_TIMEOUT_MS = 5000`, `place` bỏ qua khi chưa tới lượt người),
  `client/src/game/ai/workerEngine.ts`, `client/src/views/Home/index.tsx` (`ENGINE_SEED = 1`, mức mặc định `normal`),
  `client/src/views/Home/components/SeatBar/index.tsx`, `client/src/lib/strings.ts`.
- **Test đã gom (gợi ý):** `client/e2e/play.spec.ts` "máy đáp lại nước của người chơi — Worker chạy thật" → TC-OPPONENT-001,
  "máy đi trước thì nó tự đánh nước đầu" → TC-OPPONENT-002.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Thế cờ cho case chặn / thắng dựng bằng cách nào? → Gieo một ván đang dở vào `localStorage` (đúng định dạng
  `SavedGame` của app) với lượt đang là của máy, hoặc của người ngay trước nước quyết định. US-02 hứa máy nghĩ và đánh ngay
  khi vào. Chơi tay tới thế đó phụ thuộc vào từng nước máy chọn.
- **Q2** "Worker chết" giả bằng gì? → Thay `window.Worker` bằng một lớp nhận thông điệp mà không bao giờ trả lời (initScript),
  đồng hồ giả `page.clock` chạy qua 5s. Đây là đúng tình huống "kill worker" của NFR-REL-03.
- **Q3** Sau khi máy bỏ lượt, kỳ vọng là gì? NFR-REL-01 nói "dùng nước dự phòng … game vẫn đi tiếp"; app hiện thông báo
  "Máy không trả lời kịp — thử đánh lại một nước". Cả hai cùng hứa người chơi đi tiếp được: bấm một ô trống phải tạo ra
  một nước (của người, hoặc máy đánh nước dự phòng). Thực tế không có gì xảy ra — lượt vẫn là của máy nên mọi cú bấm bị bỏ
  qua, chỉ còn đường thoát là Hoàn → **bug** BUG-OPPONENT-01 (TC-OPPONENT-009 `test.fail()`). Không sửa code game ở PR này.
- **Q4** NFR-PERF-06 (ngân sách thời gian từng mức) **không** kiểm ở e2e: thời gian phụ thuộc máy CI, và nfr.md đã ghi mức
  Khó đang KHÔNG ĐẠT. E2E chỉ kiểm "máy trả lời" trong 15s.

## Tài khoản test

Không có.

## Ngoài phạm vi

- Chất lượng nước đi ngoài hai thế chặn / thắng (bộ chiến thuật 25 thế ở unit test `client/src/game/ai/*.test.ts`).
- Mức Dễ "mù có chủ đích" (ADR-0005): ngẫu nhiên có seed, đo ở unit test.
- Đổi tab giữa lúc máy nghĩ: trình duyệt không dừng Worker khi tab ẩn; tải lại giữa lúc nghĩ nằm ở module `persistence`.

## Tech debt liên quan

- `docs/02-requirements/nfr.md` NFR-PERF-06: mức Khó vượt 1500ms, chưa tìm ra nguyên nhân.

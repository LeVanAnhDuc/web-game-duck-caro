# STATS — Quyết định

Đi cặp với `docs/requirements/stats.md`.

## Nguồn

Đọc ngày 2026-10-17 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-12, FR-13), `docs/01-product/journeys.md` (US-01 "kết quả được cộng
  vào thống kê của đúng mức khó vừa chơi", US-04 và "Điều gì có thể sai"), `docs/03-design/invariants.md` (#13 khoá chống
  ghi trùng), `README.md` §"It remembers where you were".
- **Code:** `client/src/views/Home/ghosts/RecordResult`, `client/src/views/Home/mains/StatsPanel`, `StartOverlay`
  (`StatsLine`), `client/src/hooks/useGame.ts` (`giveUp` chọn ghế do người cầm), `client/src/game/storage/types.ts`.
- **Test đã gom (gợi ý):** `client/e2e/review-and-network.spec.ts` "thống kê cộng vào ĐÚNG mức vừa chơi, và chỉ cộng MỘT
  lần" → TC-STATS-001 / TC-STATS-004 / TC-STATS-005.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Thắng và thua dựng bằng ván gieo sẵn (định dạng `SavedGame` của app) một nước trước khi kết thúc — chơi tay tới
  thắng máy phụ thuộc engine. Số đếm vẫn do app ghi qua `RecordResult` thật.
- **Q2** US-04 "Đổi mức **giữa ván** thì phải hỏi xác nhận và tính là bỏ ván": app không có lối đổi mức giữa ván (mức chỉ
  chọn ở màn bắt đầu; comment `views/Home/index.tsx` — muốn đổi thì Bỏ ván rồi bắt đầu lại, đi qua đúng luồng US-04). Không
  có lối nên không có gì để hỏi — rủi ro "đổi mức mà không hỏi gì" bị loại bằng thiết kế. Không có case.
- **Q3** "Bảng làm nổi mức đang chơi" nhận biết bằng nhãn mức in đậm hơn (`font-weight: 500`) so với các mức khác.
- **Q4** Thống kê ván Tự do đổ chung ô với Caro Việt (design v2 §6, nợ kỹ thuật đã ghi) — không kiểm như một requirement.

## Tài khoản test

Không có.

## Ngoài phạm vi

- Ván hai người không vào thống kê: TC-HOTSEAT-007.
- Xoá thống kê bằng "Xoá toàn bộ dữ liệu": module `settings`.
- Thống kê khi lưu trữ bị chặn (US-04 "luôn hiện toàn số 0"): được phép quên (NFR-REL-04); module `persistence` đã kiểm
  game không vỡ.

## Tech debt liên quan

- `docs/04-state/backlog.md` §Nợ kỹ thuật: ván Tự do và Caro Việt chung một ô thống kê.

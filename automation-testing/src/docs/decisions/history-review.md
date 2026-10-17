# HISTORYREVIEW — Quyết định

Đi cặp với `docs/requirements/history-review.md`.

## Nguồn

Đọc ngày 2026-10-17 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-08, FR-09), `docs/01-product/journeys.md` (US-03 và "Điều gì có thể
  sai": xem lại ván đang dở, danh sách dài hơn màn hình, thoát xem lại mà bàn vẫn ở giữa ván),
  `docs/specs/move-history-and-review/design.md`, `docs/decisions/0018-clickable-move-rows-are-44px.md`,
  `docs/design-system/gomoku/MASTER.md` §4 (cột toạ độ chữ số đều), `README.md` §"Every move is listed, and a finished
  game replays".
- **Code:** `client/src/views/Home/components/MoveList`, `ReviewPane`, `ReviewBar`, `WinSheet`,
  `client/src/views/Home/index.tsx` (`startReview`, `shownMoves`), `client/src/lib/strings.ts` (`moveCoord`).
- **Test đã gom (gợi ý):** `client/e2e/review-and-network.spec.ts` "xem lại ván: bàn lùi theo nước, danh sách bấm được"
  → TC-HISTORYREVIEW-004/005/006/008, "chế độ xem lại có nút Giữa" → TC-HISTORYREVIEW-009. Hai case còn lại của file đó
  (request ra ngoài, thống kê) chuyển sang `privacy` và `stats`.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** "Bàn vẽ đúng thế trận" kiểm thế nào trên canvas? → So dấu vân ảnh (hash điểm ảnh) của canvas: nước k và nước k+1
  khác nhau, và tới nước k bằng hai đường (nút lùi, hàng danh sách) cho cùng một hash. Không so với ảnh mẫu (font, DPI).
- **Q2** Ván dùng để xem lại: Hai người, bỏ ván sau vài nước — nhanh và không phụ thuộc nước của máy. Xem lại hành xử như
  nhau ở hai chế độ.
- **Q3** US-03 "nhảy tới một nước rồi bấm hoàn nước": trong xem lại không có nút Hoàn (Controls bị ẩn) — rủi ro bị loại
  bằng thiết kế; TC-HISTORYREVIEW-006 kiểm bàn chỉ đọc là đủ.

## Tài khoản test

Không có.

## Ngoài phạm vi

- Hàng bấm được cao 44px (ADR-0018): module `accessibility` kiểm vùng bấm.
- Bản sheet của xem lại dưới 1024px: module `responsive`.

## Tech debt liên quan

_(không có)_

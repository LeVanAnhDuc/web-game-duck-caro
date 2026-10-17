# TOUCH — Quyết định

Đi cặp với `docs/requirements/touch.md`.

## Nguồn

Đọc ngày 2026-10-17 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/01-product/journeys.md` (US-01 "Kéo bàn bị hiểu thành đánh quân, hoặc ngược lại — ngón tay luôn di
  một chút khi tap", "Tap trượt sang ô bên cạnh"), `docs/decisions/0007-placement-interaction-depends-on-pointer-type.md`,
  `docs/02-requirements/nfr.md` (NFR-A11Y-03), `README.md` §"Built for touch as much as for a mouse".
- **Code:** `client/src/hooks/useBoardCanvas.ts` (`onPointerUp`: chuột đặt thẳng; cảm ứng xem trước rồi chạm lại),
  `client/src/hooks/pointerGesture.ts` (quãng đi cộng dồn > 10px là kéo), `client/src/views/Home/mains/BoardStage`
  (nút Đánh), `client/src/game/render/camera.ts` (`CELL_DEFAULT_MOBILE = 28`).
- **Test đã gom:** không có — bộ cũ không có case cảm ứng.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Chạy ở project `app-touch` (Pixel 5, `hasTouch`): một cú `tap` của Playwright cho `pointerType: "touch"`, đúng
  nhánh ADR-0007. Chuột không bao giờ đi nhánh này.
- **Q2** Kéo bằng ngón tay dùng sự kiện chạm thật qua CDP (`Input.dispatchTouchEvent`) để trình duyệt tự sinh pointer
  event cảm ứng; gán `scrollLeft` hay giả PointerEvent bằng JS không chứng minh gì về cử chỉ.
- **Q3** Màn hẹp không có danh sách nước: đếm nước bằng chữ ẩn "nước N" của thanh hai ghế (có ở mọi khổ) và đọc toạ độ
  từ dòng thông báo. Case chạy ở chế độ Hai người để không có nước của máy chen vào.

## Tài khoản test

Không có.

## Ngoài phạm vi

- Thu phóng bằng hai ngón: app không hỗ trợ pinch (README chỉ nói lăn chuột) — không có requirement.
- Bố cục khổ hẹp (thanh dưới, sheet): module `responsive`.

## Tech debt liên quan

_(không có)_

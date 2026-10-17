# UNDOHINT — Quyết định

Đi cặp với `docs/requirements/undo-hint.md`.

## Nguồn

Đọc ngày 2026-10-17 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-07, FR-10), `docs/01-product/journeys.md` (US-03 "Nhảy tới một nước rồi
  bấm hoàn nước"), `docs/decisions/0016-hints-always-use-the-hard-engine.md`, `0017-confirm-button-picks-a-free-side.md`,
  `docs/03-design/invariants.md` (#7 requestId), `docs/specs/move-history-and-review/design.md`, `README.md` §"Every
  move is listed…" (hint) và §"Play against the machine…" (undo).
- **Code:** `client/src/hooks/useGame.ts` (`undoMove` lùi 2 ở đấu máy và hỏi lại engine khi tới lượt máy, `askHint`),
  `client/src/views/Home/index.tsx` (`controlProps.canUndo`, `canHint`), `client/src/views/Home/ghosts/ShowHintPreview`,
  `client/src/views/Home/mains/BoardStage/index.tsx` (nút Đánh).
- **Test đã gom (gợi ý):** `client/e2e/play.spec.ts` "hoàn nước lấy lại CẢ nước của máy" → TC-UNDOHINT-001,
  "gợi ý không thêm nước nào vào ván" → TC-UNDOHINT-004.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** "Gợi ý dùng mức Khó" kiểm hộp đen thế nào? → Cùng một thế cờ (Hai người, 4 nước định sẵn), xin gợi ý trong ván
  chọn mức Dễ và trong ván chọn mức Khó: hai gợi ý phải trùng nhau. Mức Dễ "mù có chủ đích" (ADR-0005) nên nếu gợi ý theo
  mức đang chơi thì không có gì bảo đảm trùng. Mức khó của ván hai người vẫn được ghi theo lựa chọn ở màn bắt đầu trước khi
  bấm Hai người.
- **Q2** Nước thắng cho TC-UNDOHINT-007 dựng bằng ván gieo sẵn (người có 0..3, 0 mở hai đầu, tới lượt người). Gợi ý đúng
  là `4, 0` hoặc `−1, 0` — cả hai đều thắng ngay.
- **Q3** "Nước máy đang tính bị bỏ" chứng minh bằng trạng thái, không bằng chờ: Hoàn ngay khi máy (mức Khó) đang nghĩ, rồi
  đánh một nước mới; sau khi máy trả lời nước mới, bàn phải có đúng 2 nước và nước đầu là nước mới.

## Tài khoản test

Không có.

## Ngoài phạm vi

- Vị trí nút "Đánh" né quân bên cạnh (ADR-0017): hình học trên canvas, đã có unit test `placeConfirmButton`.
- Phím `h` / `u`: module `accessibility`.
- Gợi ý tắt khi máy đang nghĩ / ván đã kết thúc: TC-OPPONENT-005, TC-WINRULE-010.

## Tech debt liên quan

_(không có)_

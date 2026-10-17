# PIECESET — Quyết định

Đi cặp với `docs/requirements/piece-set.md`.

## Nguồn

Đọc ngày 2026-10-17 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-20), `docs/01-product/journeys.md` (US-06 bước 3 "mỗi ô xem trước vẽ
  đúng hai hình của bộ đó", "Đổi bộ quân không đổi kết quả ván nào"; rủi ro tên bộ không tồn tại), 
  `docs/decisions/0027-a-piece-set-is-a-pair-of-shapes-never-a-pair-of-colours.md`, `docs/03-design/invariants.md` (#16),
  `docs/specs/v2/design.md` §4, `README.md` §"Settings that belong to the machine" (Four piece sets).
- **Code:** `client/src/views/Home/mains/SettingsSheet` (lưới bốn ô, `PieceGlyph` hai ghế), 
  `client/src/views/Home/components/PieceGlyph` (màu `var(--mark-one|two)`), `client/src/game/appearance/shapes.ts`,
  `client/src/game/render/layers/marks.ts`, `client/src/views/Home/components/SeatBar`, `StartOverlay`.
- **Test đã gom (gợi ý):** `client/e2e/hotseat-and-theme.spec.ts` "đổi bộ quân vẽ lại bàn ngay, và sống qua reload" →
  TC-PIECESET-002 / TC-PIECESET-003.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** "Hai hình thật" kiểm bằng dữ liệu đường vẽ SVG của hai glyph trong mỗi ô: hai `d` khác nhau trong một ô, và bộ
  `d` của bốn ô khác nhau từng đôi. Không so ảnh.
- **Q2** "Bàn vẽ lại" kiểm bằng dấu vân ảnh canvas sau khi đổi bộ: khác trước, và đổi về bộ cũ thì trùng lại.
- **Q3** "Không đổi màu" kiểm trên glyph (cùng dữ liệu hình với bàn, cùng token màu): `color` tính được của glyph ghế một
  giống nhau ở cả bốn bộ, tương tự ghế hai, và hai ghế khác màu.
- **Q4** Tên bộ quân không tồn tại trong bộ nhớ: đã kiểm ở TC-SETTINGS-013 (cả khối cài đặt về mặc định).

## Tài khoản test

Không có.

## Ngoài phạm vi

- Đọc được ở ô 16px và khi xám hoá (NFR-A11Y-07): nhìn tận mắt theo nfr.md, đã ghi ĐẠT 2026-09-11.

## Tech debt liên quan

_(không có)_

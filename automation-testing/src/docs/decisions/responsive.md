# RESPONSIVE — Quyết định

Đi cặp với `docs/requirements/responsive.md`.

## Nguồn

Đọc ngày 2026-10-17 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/01-product/journeys.md` (US-01 bối cảnh "trên điện thoại"; US-07 "màn hình 375px: nút không đè lên
  nhau"), `docs/design-system/gomoku/MASTER.md`, `.claude/skills/feature-flow/SKILL.md` §1 (ba khổ 375 / 768 / 1440),
  `docs/decisions/0028-a-two-seat-bar-replaces-the-status-line.md`.
- **Code:** `client/src/views/Home/index.tsx` (`lg:` = 1024px: `aside` cột phải, khối `lg:hidden` thông báo + WinSheet +
  Controls), `client/src/views/Home/components/Controls` (Bỏ ván chỉ icon dưới `sm`), `SettingsSheet` (sheet đáy / `lg:fixed`
  cột phải 320px), `ReviewPane` (`variant="sheet"`), `client/src/hooks/useBoardCanvas.ts` (`MOBILE_MAX_WIDTH = 640`).
- **Test đã gom:** không có case bố cục trong bộ cũ ngoài header 375px của Ducker ID (module `ducker-id`).

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Khổ đo: 320, 375, 768, 1024, 1440 — biên dưới, điện thoại phổ biến, tablet, ngay tại ngưỡng `lg`, desktop rộng.
- **Q2** Cỡ ô kiểm như module `board`: bấm cách tâm đúng một cạnh ô phải ra ô `1, 0`.
- **Q3** "Sheet neo đáy" = mép dưới hộp thoại trùng mép dưới khung bàn và rộng bằng màn; "cột phải" = mép phải trùng cửa
  sổ, rộng 320px.

## Tài khoản test

Không có.

## Ngoài phạm vi

- Thẩm mỹ từng khổ (khoảng cách, cỡ chữ): duyệt bằng mắt trong feature-flow §5.
- Header 375px khi có nút Đăng nhập: module `ducker-id`.

## Tech debt liên quan

- `docs/04-state/backlog.md`: đổi kích thước cửa sổ có thể đẩy thế trận ra ngoài khung nhìn (lối thoát là nút Giữa).
